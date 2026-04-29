"""Feedback API blueprint."""

from __future__ import annotations

from flask import Blueprint, jsonify, request
from flask_jwt_extended import decode_token, jwt_required

from app.extensions import db, limiter
from app.models.feedback import Feedback
from app.models.user import User
from app.schemas.feedback import (
    FeedbackCreateSchema,
    FeedbackQuerySchema,
    FeedbackUpdateSchema,
)


feedback_bp = Blueprint("feedback", __name__)

create_schema = FeedbackCreateSchema()
query_schema = FeedbackQuerySchema()
update_schema = FeedbackUpdateSchema()


def _optional_user_id() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0] != "Bearer":
        return None

    try:
        decoded = decode_token(parts[1])
    except Exception:  # noqa: BLE001
        return None

    user_id = decoded.get("sub")
    if not user_id or not db.session.get(User, user_id):
        return None
    return user_id


@feedback_bp.post("")
@limiter.limit("5 per minute")
def create_feedback():
    payload = create_schema.load(request.get_json(silent=True) or {})
    user_agent = (request.headers.get("User-Agent") or "")[:512] or None

    feedback = Feedback(
        category=payload["category"],
        content=payload["content"].strip(),
        contact=(payload.get("contact") or "").strip() or None,
        page_url=(payload.get("page_url") or "").strip() or None,
        user_agent=user_agent,
        user_id=_optional_user_id(),
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({"success": True, "data": {"feedback": feedback.to_dict()}}), 201


@feedback_bp.get("")
@jwt_required()
def list_feedback():
    payload = query_schema.load(request.args)

    query = Feedback.query
    if payload.get("category"):
        query = query.filter_by(category=payload["category"])
    if payload.get("status"):
        query = query.filter_by(status=payload["status"])

    pagination = query.order_by(Feedback.created_at.desc()).paginate(
        page=payload["page"],
        per_page=payload["per_page"],
        error_out=False,
    )

    return jsonify(
        {
            "success": True,
            "data": {
                "records": [feedback.to_dict() for feedback in pagination.items],
                "pagination": {
                    "page": pagination.page,
                    "perPage": pagination.per_page,
                    "total": pagination.total,
                    "pages": pagination.pages,
                },
            },
        }
    )


@feedback_bp.get("/<feedback_id>")
@jwt_required()
def get_feedback(feedback_id: str):
    feedback = db.session.get(Feedback, feedback_id)
    if not feedback:
        return jsonify({"success": False, "error": "反馈不存在"}), 404

    return jsonify({"success": True, "data": {"feedback": feedback.to_dict()}})


@feedback_bp.patch("/<feedback_id>")
@jwt_required()
def update_feedback(feedback_id: str):
    feedback = db.session.get(Feedback, feedback_id)
    if not feedback:
        return jsonify({"success": False, "error": "反馈不存在"}), 404

    payload = update_schema.load(request.get_json(silent=True) or {})
    feedback.status = payload["status"]
    db.session.commit()

    return jsonify({"success": True, "data": {"feedback": feedback.to_dict()}})
