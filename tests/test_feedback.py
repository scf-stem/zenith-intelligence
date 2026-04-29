import os
import unittest


os.environ["FLASK_ENV"] = "testing"

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402


class FeedbackApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.app.config["RATELIMIT_STORAGE_URI"] = "memory://"
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.drop_all()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def _login(self):
        self.client.post(
            "/api/auth/register",
            json={
                "username": "tester",
                "password": "password1",
                "confirmPassword": "password1",
            },
        )
        response = self.client.post(
            "/api/auth/login",
            json={"username": "tester", "password": "password1"},
        )
        return response.get_json()["data"]["token"]

    def test_anonymous_feedback_create_success(self):
        response = self.client.post(
            "/api/feedback",
            json={
                "category": "bug",
                "content": "首页登录按钮偶尔没有响应",
                "contact": "student@example.com",
                "pageUrl": "http://localhost:8080/index.html",
            },
            headers={"User-Agent": "feedback-test"},
        )

        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertTrue(data["success"])
        self.assertEqual(data["data"]["feedback"]["category"], "bug")
        self.assertIsNone(data["data"]["feedback"]["userId"])

    def test_feedback_requires_content(self):
        response = self.client.post("/api/feedback", json={"category": "general"})

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()["success"])

    def test_feedback_rejects_long_content(self):
        response = self.client.post(
            "/api/feedback",
            json={"category": "general", "content": "x" * 2001},
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()["success"])

    def test_feedback_rejects_invalid_category(self):
        response = self.client.post(
            "/api/feedback",
            json={"category": "invalid", "content": "这是一个有效长度的反馈"},
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()["success"])

    def test_list_feedback_requires_login(self):
        response = self.client.get("/api/feedback")

        self.assertEqual(response.status_code, 401)
        self.assertFalse(response.get_json()["success"])

    def test_logged_in_user_can_list_and_update_feedback(self):
        token = self._login()
        self.client.post(
            "/api/feedback",
            json={"category": "feature", "content": "希望增加错题导出功能"},
        )

        list_response = self.client.get(
            "/api/feedback?status=open&category=feature",
            headers={"Authorization": f"Bearer {token}"},
        )
        list_data = list_response.get_json()

        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_data["data"]["pagination"]["total"], 1)

        feedback_id = list_data["data"]["records"][0]["id"]
        update_response = self.client.patch(
            f"/api/feedback/{feedback_id}",
            json={"status": "reviewing"},
            headers={"Authorization": f"Bearer {token}"},
        )

        self.assertEqual(update_response.status_code, 200)
        self.assertEqual(update_response.get_json()["data"]["feedback"]["status"], "reviewing")

    def test_feedback_submit_is_rate_limited(self):
        for _ in range(5):
            response = self.client.post(
                "/api/feedback",
                json={"category": "general", "content": "这是一个有效长度的反馈"},
            )
            self.assertEqual(response.status_code, 201)

        response = self.client.post(
            "/api/feedback",
            json={"category": "general", "content": "这是一个有效长度的反馈"},
        )

        self.assertEqual(response.status_code, 429)


if __name__ == "__main__":
    unittest.main()
