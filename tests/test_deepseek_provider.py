import json
import unittest
from unittest.mock import Mock, patch

from flask import Flask

from app.services.model_provider import DeepSeekProvider, model_provider_factory
from app.utils.errors import APIError


class DeepSeekProviderTestCase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.config.update(
            DEEPSEEK_API_KEY="test-key",
            DEEPSEEK_API_URL="https://api.deepseek.com",
            DEEPSEEK_MODEL="deepseek-v4-flash",
            REQUEST_TIMEOUT=15,
        )
        self.ctx = self.app.app_context()
        self.ctx.push()
        self.provider = DeepSeekProvider()

    def tearDown(self):
        self.ctx.pop()

    def _mock_response(self, content):
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {
            "choices": [{"message": {"content": content}}],
        }
        return response

    @patch("app.services.model_provider.requests.post")
    def test_complete_uses_deepseek_chat_completions(self, post):
        post.return_value = self._mock_response('{"ok": true}')

        result = self.provider.complete("system", "user", temperature=0.1, max_tokens=64)

        self.assertEqual(result, '{"ok": true}')
        _, kwargs = post.call_args
        self.assertEqual(post.call_args.args[0], "https://api.deepseek.com/chat/completions")
        self.assertEqual(kwargs["headers"]["Authorization"], "Bearer test-key")
        self.assertEqual(kwargs["json"]["model"], "deepseek-v4-flash")
        self.assertEqual(kwargs["json"]["response_format"], {"type": "json_object"})

    @patch("app.services.model_provider.requests.post")
    def test_parse_problem_normalizes_json_response(self, post):
        post.return_value = self._mock_response(
            json.dumps(
                {
                    "type": "解答",
                    "subject": "数学",
                    "knowledgePoints": ["方程"],
                    "difficulty": "简单",
                    "prerequisites": ["代数"],
                },
                ensure_ascii=False,
            )
        )

        result = self.provider.parse_problem("x + 1 = 2")

        self.assertEqual(result["subject"], "数学")
        self.assertEqual(result["knowledgePoints"], ["方程"])

    @patch("app.services.model_provider.requests.post")
    def test_generate_solution_parses_solution_json(self, post):
        post.return_value = self._mock_response(
            json.dumps(
                {
                    "thinking": "移项求解。",
                    "steps": ["两边减 1", "得到 x=1"],
                    "answer": "x=1",
                    "summary": "一元一次方程可通过移项求解。",
                },
                ensure_ascii=False,
            )
        )

        result = self.provider.generate_solution("x + 1 = 2", {"knowledgePoints": ["方程"]})

        self.assertEqual(result["answer"], "x=1")
        self.assertEqual(result["steps"], ["两边减 1", "得到 x=1"])

    @patch("app.services.model_provider.requests.post")
    def test_streaming_yields_content_deltas(self, post):
        response = Mock()
        response.raise_for_status.return_value = None
        response.iter_lines.return_value = [
            'data: {"choices":[{"delta":{"content":"A"}}]}',
            'data: {"choices":[{"delta":{"content":"B"}}]}',
            "data: [DONE]",
        ]
        post.return_value = response

        chunks = list(self.provider.generate_solution_stream("x", {}))

        self.assertEqual(chunks, ["A", "B"])
        self.assertTrue(post.call_args.kwargs["stream"])
        self.assertNotIn("response_format", post.call_args.kwargs["json"])

    @patch("app.services.model_provider.requests.post")
    def test_health_check_uses_non_json_probe(self, post):
        post.return_value = self._mock_response("ok")

        self.assertTrue(self.provider.health_check())
        self.assertNotIn("response_format", post.call_args.kwargs["json"])

    def test_legacy_aliases_resolve_to_deepseek(self):
        self.assertIsInstance(model_provider_factory.get_provider("minimax"), DeepSeekProvider)
        self.assertIsInstance(model_provider_factory.get_provider("chatglm"), DeepSeekProvider)

    def test_list_providers_exposes_only_deepseek(self):
        self.assertEqual(
            model_provider_factory.list_providers(),
            [{"name": "deepseek", "display_name": "DeepSeek V4 Flash"}],
        )

    def test_missing_key_raises_api_error(self):
        self.app.config["DEEPSEEK_API_KEY"] = ""

        with self.assertRaises(APIError):
            self.provider.complete("system", "user")


if __name__ == "__main__":
    unittest.main()
