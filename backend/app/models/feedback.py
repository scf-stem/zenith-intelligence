"""User feedback model."""

from __future__ import annotations

import uuid
from datetime import datetime

from app.extensions import db


class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category = db.Column(db.String(32), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)
    contact = db.Column(db.String(120), nullable=True)
    page_url = db.Column(db.String(2048), nullable=True)
    user_agent = db.Column(db.String(512), nullable=True)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=True, index=True)
    status = db.Column(db.String(20), nullable=False, default="open", index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    user = db.relationship("User", backref=db.backref("feedback", lazy="dynamic"))

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "category": self.category,
            "content": self.content,
            "contact": self.contact,
            "pageUrl": self.page_url,
            "userAgent": self.user_agent,
            "userId": self.user_id,
            "username": self.user.username if self.user else None,
            "status": self.status,
            "createdAt": self._to_iso(self.created_at),
            "updatedAt": self._to_iso(self.updated_at),
        }

    @staticmethod
    def _to_iso(value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.isoformat(timespec="milliseconds") + "Z"
