import os
import unittest


os.environ["FLASK_ENV"] = "testing"

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402


class SiteAnalyticsApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app("testing")
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.drop_all()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_collect_pageview_and_summary(self):
        response = self.client.post(
            "/api/site-analytics/collect",
            json={
                "type": "pageview",
                "visitorId": "visitor-123456",
                "sessionId": "session-123456",
                "path": "/index.html",
                "title": "首页",
                "referrer": "https://example.com/article",
            },
            headers={"User-Agent": "analytics-test"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.get_json()["success"])

        summary = self.client.get("/api/site-analytics/summary?days=7")
        data = summary.get_json()["data"]

        self.assertEqual(summary.status_code, 200)
        self.assertEqual(data["overview"]["pv"], 1)
        self.assertEqual(data["overview"]["uv"], 1)
        self.assertEqual(data["pages"][0]["path"], "/index.html")
        self.assertEqual(data["referrers"][0]["source"], "example.com")

    def test_collect_duration_updates_latest_visit(self):
        payload = {
            "visitorId": "visitor-123456",
            "sessionId": "session-123456",
            "path": "/index.html",
        }
        self.client.post("/api/site-analytics/collect", json={"type": "pageview", **payload})
        response = self.client.post(
            "/api/site-analytics/collect",
            json={"type": "duration", "duration": 45, **payload},
        )

        self.assertEqual(response.status_code, 200)
        summary = self.client.get("/api/site-analytics/summary?days=7").get_json()["data"]
        self.assertEqual(summary["overview"]["avgDuration"], 45)

    def test_collect_custom_event(self):
        response = self.client.post(
            "/api/site-analytics/collect",
            json={
                "type": "event",
                "visitorId": "visitor-123456",
                "sessionId": "session-123456",
                "path": "/index.html",
                "eventName": "feedback_submit_success",
                "metadata": {"category": "general"},
            },
        )

        self.assertEqual(response.status_code, 201)
        summary = self.client.get("/api/site-analytics/summary?days=7").get_json()["data"]
        self.assertEqual(summary["overview"]["events"], 1)
        self.assertEqual(summary["events"][0]["eventName"], "feedback_submit_success")

    def test_event_requires_event_name(self):
        response = self.client.post(
            "/api/site-analytics/collect",
            json={
                "type": "event",
                "visitorId": "visitor-123456",
                "sessionId": "session-123456",
                "path": "/index.html",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.get_json()["success"])


if __name__ == "__main__":
    unittest.main()
