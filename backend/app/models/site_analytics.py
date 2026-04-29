"""Lightweight first-party site analytics models."""

from __future__ import annotations

import uuid
from datetime import datetime

from app.extensions import db


class SiteVisit(db.Model):
    __tablename__ = "site_visits"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    visitor_id = db.Column(db.String(64), nullable=False, index=True)
    session_id = db.Column(db.String(64), nullable=False, index=True)
    path = db.Column(db.String(512), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=True)
    referrer = db.Column(db.String(512), nullable=True)
    user_agent = db.Column(db.String(512), nullable=True)
    ip_hash = db.Column(db.String(64), nullable=True, index=True)
    duration = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "visitorId": self.visitor_id,
            "sessionId": self.session_id,
            "path": self.path,
            "title": self.title,
            "referrer": self.referrer,
            "userAgent": self.user_agent,
            "duration": self.duration,
            "createdAt": self._to_iso(self.created_at),
        }

    @staticmethod
    def _to_iso(value: datetime | None) -> str | None:
        if value is None:
            return None
        return value.isoformat(timespec="milliseconds") + "Z"


class SiteEvent(db.Model):
    __tablename__ = "site_events"

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    visitor_id = db.Column(db.String(64), nullable=False, index=True)
    session_id = db.Column(db.String(64), nullable=False, index=True)
    event_name = db.Column(db.String(80), nullable=False, index=True)
    path = db.Column(db.String(512), nullable=False, index=True)
    metadata_json = db.Column(db.JSON, nullable=False, default=dict)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "visitorId": self.visitor_id,
            "sessionId": self.session_id,
            "eventName": self.event_name,
            "path": self.path,
            "metadata": self.metadata_json or {},
            "createdAt": SiteVisit._to_iso(self.created_at),
        }
