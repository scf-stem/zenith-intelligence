import os
import unittest


os.environ["FLASK_ENV"] = "testing"

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models.course import Chapter, Course, Lesson  # noqa: E402


class CourseI18nApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.app.config["RATELIMIT_STORAGE_URI"] = "memory://"
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.drop_all()
        db.create_all()

        course = Course(
            name="Python 基础编程",
            description="中文课程描述",
            subject="programming",
            difficulty=2,
            instructor="AI 助手",
            duration=280,
            order_index=1,
            is_active=True,
        )
        db.session.add(course)
        db.session.flush()

        chapter = Chapter(
            course_id=course.id,
            name="Python基础",
            description="中文章节描述",
            order_index=1,
            is_active=True,
        )
        db.session.add(chapter)
        db.session.flush()

        lesson = Lesson(
            chapter_id=chapter.id,
            name="Python基础",
            description="中文课时描述",
            content="# 中文内容\n\n这是一节中文课程。",
            content_type="markdown",
            duration=45,
            order_index=1,
            is_active=True,
        )
        db.session.add(lesson)
        db.session.commit()
        self.course_id = course.id
        self.lesson_id = lesson.id

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_course_list_returns_english_metadata_when_requested(self):
        response = self.client.get("/api/course/list?locale=en")
        data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(data["data"][0]["name"], "Python Programming Basics")
        self.assertEqual(data["data"][0]["instructor"], "AI Tutor")

    def test_course_detail_returns_english_chapters_when_requested(self):
        response = self.client.get(f"/api/course/{self.course_id}?locale=en")
        data = response.get_json()["data"]

        self.assertEqual(data["name"], "Python Programming Basics")
        self.assertEqual(data["chapters"][0]["name"], "Python Basics")
        self.assertEqual(data["chapters"][0]["lessons"][0]["name"], "Python Basics")

    def test_lesson_returns_english_markdown_when_requested(self):
        response = self.client.get(f"/api/course/lesson/{self.lesson_id}?locale=en")
        data = response.get_json()["data"]

        self.assertEqual(data["name"], "Python Basics")
        self.assertIn("# Python Basics", data["content"])
        self.assertNotIn("中文内容", data["content"])

    def test_chinese_locale_preserves_database_content(self):
        response = self.client.get(f"/api/course/lesson/{self.lesson_id}?locale=zh-CN")
        data = response.get_json()["data"]

        self.assertEqual(data["name"], "Python基础")
        self.assertIn("中文内容", data["content"])


if __name__ == "__main__":
    unittest.main()
