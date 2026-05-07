"""Model provider abstraction for DeepSeek-based text support."""

from __future__ import annotations

import json
from abc import ABC, abstractmethod
from typing import Dict, Generator

import requests
from flask import current_app

from app.services.chatglm_service import ChatGLMService
from app.utils.errors import APIError


class BaseModelProvider(ABC):
    """Abstract base class for AI model providers."""

    name: str = "base"
    display_name: str = "Base Model"

    @abstractmethod
    def parse_problem(self, text: str, locale: str = "en") -> Dict:
        """Parse problem and extract metadata."""

    @abstractmethod
    def generate_solution(self, text: str, parse_result: Dict, locale: str = "en") -> Dict:
        """Generate solution for the problem."""

    @abstractmethod
    def generate_solution_stream(
        self, text: str, parse_result: Dict, locale: str = "en"
    ) -> Generator[str, None, None]:
        """Generate solution with streaming."""

    @abstractmethod
    def health_check(self) -> bool:
        """Check if the model is available."""

    @abstractmethod
    def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> str:
        """Run a generic completion request and return normalized text output."""

    def get_config(self, key: str, default=None):
        """Get configuration value."""
        config_key = f"{self.name.upper()}_{key}"
        return current_app.config.get(config_key, default)


class DeepSeekProvider(BaseModelProvider):
    """DeepSeek text provider using the OpenAI-compatible chat completions API."""

    name = "deepseek"
    display_name = "DeepSeek V4 Flash"

    def __init__(self):
        self._parser = ChatGLMService()

    def _request(self, data: dict, stream: bool = False) -> requests.Response:
        api_key = self.get_config("API_KEY") or current_app.config.get("DEEPSEEK_API_KEY")
        api_url = self.get_config("API_URL") or current_app.config.get("DEEPSEEK_API_URL")
        timeout = current_app.config.get("REQUEST_TIMEOUT", 120)

        if not api_key:
            raise APIError("DeepSeek API Key 未配置", 500)

        api_url = (api_url or "https://api.deepseek.com").rstrip("/")
        completion_url = (
            api_url
            if api_url.endswith("/chat/completions")
            else f"{api_url}/chat/completions"
        )

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                completion_url,
                json=data,
                headers=headers,
                timeout=timeout,
                stream=stream,
            )
            response.raise_for_status()
            return response
        except requests.RequestException as exc:
            message = str(exc)
            detail = ""
            if exc.response is not None:
                try:
                    detail = json.dumps(exc.response.json(), ensure_ascii=False)
                except Exception:
                    detail = exc.response.text
            if detail:
                message = f"{message}; {detail}"
            raise APIError(f"DeepSeek API 错误: {message}", 500) from exc

    def _build_request(
        self,
        messages: list[dict],
        temperature: float,
        max_tokens: int,
        stream: bool = False,
        json_response: bool = False,
    ) -> dict:
        request_data = {
            "model": self.get_config("MODEL", "deepseek-v4-flash"),
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if json_response:
            request_data["response_format"] = {"type": "json_object"}
        if stream:
            request_data["stream"] = True
        return request_data

    def _extract_message_text(self, payload: dict) -> str:
        try:
            message = payload["choices"][0]["message"]
        except (KeyError, IndexError, TypeError) as exc:
            raise APIError("DeepSeek 响应结构异常", 500) from exc

        if not isinstance(message, dict):
            raise APIError("DeepSeek 响应结构异常: message is not a dict", 500)

        content = ChatGLMService._normalize_text_content(message.get("content", "") or "")
        if content:
            return content

        reasoning = ChatGLMService._normalize_text_content(
            message.get("reasoning_content", "") or ""
        )
        if reasoning:
            return reasoning

        raise APIError("DeepSeek 未返回有效内容", 500)

    def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        max_tokens: int = 2048,
    ) -> str:
        request_data = self._build_request(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            json_response=True,
        )
        response = self._request(request_data)
        return self._extract_message_text(response.json())

    @staticmethod
    def _is_english(locale: str) -> bool:
        return locale != "zh-CN"

    @staticmethod
    def _normalize_list(value) -> list[str]:
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        if value is None or value == "":
            return []
        return [str(value).strip()]

    def _coerce_parse_result_en(self, data: Dict, source_text: str) -> Dict:
        return {
            "type": str(data.get("type") or "Solution").strip(),
            "subject": str(data.get("subject") or "General").strip(),
            "knowledgePoints": self._normalize_list(data.get("knowledgePoints")) or ["Problem analysis", "Solution method"],
            "difficulty": str(data.get("difficulty") or "Medium").strip(),
            "prerequisites": self._normalize_list(data.get("prerequisites")) or ["Relevant basic concepts"],
        }

    def parse_problem(self, text: str, locale: str = "en") -> Dict:
        if self._is_english(locale):
            system_prompt = (
                "You are a professional education analyst. "
                "Analyze academic problems and return only a valid JSON object. "
                "Do not add markdown fences or extra text. All user-facing values must be in English."
            )
            user_prompt = f"""Analyze the following problem:

Problem:
{text}

Return only this JSON object:
{{
    "type": "Problem type, one of: Multiple choice / Fill in the blank / Solution / True or false",
    "subject": "Subject",
    "knowledgePoints": ["knowledge point 1", "knowledge point 2"],
    "difficulty": "Difficulty, one of: Easy / Medium / Hard",
    "prerequisites": ["prerequisite 1", "prerequisite 2"]
}}"""
        else:
            system_prompt = (
                "你是一位专业的教育分析师，擅长分析各类学科题目。"
                "你必须只输出纯 JSON 格式，不要添加任何 markdown 标记或其他文字。"
            )
            user_prompt = f"""你是一位经验丰富的教师，请分析以下题目：

题目：{text}

请按以下 JSON 格式输出分析结果（只输出 JSON，不要添加 markdown 代码块标记或其他内容）：

{{
    "type": "题目类型（选择/填空/解答/判断）",
    "subject": "所属学科",
    "knowledgePoints": ["知识点1", "知识点2"],
    "difficulty": "难度等级（简单/中等/困难）",
    "prerequisites": ["前置知识1", "前置知识2"]
}}"""

        content = self.complete(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.0,
            max_tokens=512,
        )

        try:
            parsed = ChatGLMService._extract_json(content)
            if self._is_english(locale):
                return self._coerce_parse_result_en(parsed, text)
            return self._parser._coerce_parse_result(parsed, text)
        except APIError:
            current_app.logger.warning(
                "DeepSeek 解析返回非标准 JSON，降级提取字段。content=%s",
                content[:600],
            )
            if self._is_english(locale):
                return self._coerce_parse_result_en({}, text)
            return self._parser._extract_fields_from_text(content, text)

    def generate_solution(self, text: str, parse_result: Dict, locale: str = "en") -> Dict:
        knowledge_points = parse_result.get("knowledgePoints", [])
        if isinstance(knowledge_points, list):
            knowledge_text = (", " if self._is_english(locale) else "、").join(str(item) for item in knowledge_points)
        else:
            knowledge_text = str(knowledge_points)

        if self._is_english(locale):
            system_prompt = (
                "You are an excellent AI teacher. Return only a valid JSON object. "
                "Do not output markdown code fences or extra commentary. "
                "The JSON field values may contain Markdown and LaTeX. "
                "All user-facing explanation must be in English."
            )
            user_prompt = f"""Provide a detailed solution for the following problem.

### Problem
{text}

### Metadata
- Problem type: {parse_result.get('type', '')}
- Subject: {parse_result.get('subject', '')}
- Core knowledge points: {knowledge_text}
- Difficulty: {parse_result.get('difficulty', '')}

### Output requirements
Return exactly one valid, concise JSON object. Do not include markdown code fences, explanatory text outside JSON, or copies of this prompt.

The JSON structure must be exactly:
{{
    "thinking": "Write only the reasoning text. Do not include a heading such as Reasoning.",
    "steps": ["Write only the step content. Do not prefix with Step 1.", "Write only the step content. Do not prefix with Step 2."],
    "answer": "Write only the final answer. Do not include a heading such as Final Answer.",
    "summary": "Write only the knowledge summary. Do not include a heading such as Summary."
}}

Constraints:
1. `steps` must be an array of strings with at least 2 clear logical steps.
2. Keep simple problems concise.
3. Use LaTeX for mathematical expressions: inline $...$ and block $$...$$.
4. Ensure all newlines and quotes are escaped correctly in JSON strings."""
        else:
            system_prompt = (
                "你是一位优秀的 AI 教师。你必须只输出纯 JSON，"
                "禁止输出 markdown 代码块和额外说明。JSON 字段内容允许 Markdown 与 LaTeX。"
            )
            user_prompt = f"""你是一位耐心的 AI 教师，针对以下题目提供详细解答。

### 题目内容
{text}

### 辅助信息
- 题目类型：{parse_result.get('type', '')}
- 所属学科：{parse_result.get('subject', '')}
- 核心知识点：{knowledge_text}
- 难度等级：{parse_result.get('difficulty', '')}

### 输出要求
请严格输出一个合法、简洁的 JSON 对象。禁止包含任何 Markdown 代码块标签（如 ```json）、禁止包含任何解释性文字或提示词的副本。

JSON 结构必须严格如下：
{{
    "thinking": "只写思路正文，不要再写“解题思路”等标题",
    "steps": ["只写步骤内容，不要写“步骤1：”前缀", "只写步骤内容，不要写“步骤2：”前缀"],
    "answer": "只写最终答案内容，不要写“最终答案”标题",
    "summary": "只写总结正文，不要写“知识总结”标题"
}}

### 具体约束
1. **禁止重复**：严禁在输出中重复本提示词中的规则内容。
2. **数组要求**：`steps` 字段必须是字符串数组，包含至少 2 个明确的逻辑步骤。
3. **格式规范**：`thinking`、`steps`、`answer` 和 `summary` 字段内容都不要包含章节标题、序号前缀或字段名回显。
4. **数学公式**：所有数学表达式必须使用 LaTeX 格式：行内公式用 $...$，独立块级公式用 $$...$$。
5. **JSON 转义**：确保所有换行符和引号在 JSON 字符串中正确转义（使用 \\n）。"""

        content = self.complete(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=0.1,
            max_tokens=1200,
        )

        return ChatGLMService.parse_solution_content(content)

    def generate_solution_stream(
        self, text: str, parse_result: Dict, locale: str = "en"
    ) -> Generator[str, None, None]:
        knowledge_points = parse_result.get("knowledgePoints", [])
        if isinstance(knowledge_points, list):
            knowledge_text = (", " if self._is_english(locale) else "、").join(str(item) for item in knowledge_points)
        else:
            knowledge_text = str(knowledge_points)

        if self._is_english(locale):
            system_content = "You are an excellent AI teacher who explains problems clearly and accessibly. Answer in English."
            user_content = f"""Provide a detailed solution for the student.

Problem: {text}
Problem type: {parse_result.get('type', '')}
Subject: {parse_result.get('subject', '')}
Knowledge points: {knowledge_text}

Include reasoning, steps, final answer, and a knowledge summary.

Formatting:
1. Use Markdown;
2. Use LaTeX for math: inline $...$, block $$...$$;
3. Do not include unrelated self-reflection."""
        else:
            system_content = "你是一位优秀的 AI 教师，擅长用清晰、易懂的方式讲解题目。"
            user_content = f"""你是一位耐心的 AI 教师，请为学生提供详细的解答。

题目：{text}
题目类型：{parse_result.get('type', '')}
所属学科：{parse_result.get('subject', '')}
知识点：{knowledge_text}

请提供详细的解题思路、步骤、答案和知识总结。

格式要求：
1. 使用 Markdown 组织内容；
2. 数学公式使用 LaTeX（行内 $...$，块级 $$...$$）；
3. 不要输出与答案无关的自我反思。"""

        request_data = self._build_request(
            messages=[
                {
                    "role": "system",
                    "content": system_content,
                },
                {
                    "role": "user",
                    "content": user_content,
                },
            ],
            temperature=0.7,
            max_tokens=2000,
            stream=True,
        )

        response = self._request(request_data, stream=True)

        for line in response.iter_lines(decode_unicode=True):
            if not line:
                continue
            line = line.strip()
            if not line.startswith("data:"):
                continue

            data = line[5:].strip()
            if data == "[DONE]":
                break

            try:
                parsed = json.loads(data)
            except json.JSONDecodeError:
                continue

            delta = parsed.get("choices", [{}])[0].get("delta", {})
            if not isinstance(delta, dict):
                continue

            content = ChatGLMService._normalize_text_content(delta.get("content"))
            if content:
                yield content

    def health_check(self) -> bool:
        request_data = self._build_request(
            messages=[{"role": "user", "content": "你好"}],
            temperature=0.1,
            max_tokens=10,
        )
        try:
            self._request(request_data)
            return True
        except APIError:
            return False


class ModelProviderFactory:
    """Factory for creating model providers."""

    _providers: Dict[str, type[BaseModelProvider]] = {
        "deepseek": DeepSeekProvider,
    }
    _aliases: Dict[str, str] = {
        "chatglm": "deepseek",
        "minimax": "deepseek",
    }

    @classmethod
    def register_provider(cls, name: str, provider_class: type[BaseModelProvider]):
        """Register a new model provider."""
        cls._providers[name] = provider_class

    @classmethod
    def get_provider(cls, name: str) -> BaseModelProvider:
        """Get a model provider by name."""
        resolved_name = cls._aliases.get(name, name)
        if resolved_name not in cls._providers:
            raise APIError(f"未知的模型提供商: {name}", 400)
        return cls._providers[resolved_name]()

    @classmethod
    def list_providers(cls) -> list[Dict]:
        """List all available model providers."""
        return [
            {"name": name, "display_name": cls._providers[name].display_name}
            for name in cls._providers
        ]


model_provider_factory = ModelProviderFactory()
