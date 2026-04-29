"""Lightweight first-party site analytics API."""

from __future__ import annotations

import hashlib
from collections import defaultdict
from datetime import date, datetime, timedelta
from urllib.parse import urlparse

from flask import Blueprint, jsonify, request
from sqlalchemy import distinct, func

from app.extensions import db, limiter
from app.models.site_analytics import SiteEvent, SiteVisit
from app.schemas.site_analytics import AnalyticsCollectSchema, AnalyticsSummaryQuerySchema


site_analytics_bp = Blueprint("site_analytics", __name__)

collect_schema = AnalyticsCollectSchema()
summary_query_schema = AnalyticsSummaryQuerySchema()


def _hash_ip() -> str | None:
    forwarded_for = request.headers.get("X-Forwarded-For", "")
    ip = forwarded_for.split(",", 1)[0].strip() or request.remote_addr
    if not ip:
        return None
    return hashlib.sha256(ip.encode("utf-8")).hexdigest()


def _to_domain(referrer: str | None) -> str:
    if not referrer:
        return "直接访问"
    parsed = urlparse(referrer)
    return parsed.netloc or "直接访问"


def _iso_day(value: date) -> str:
    return value.isoformat()


@site_analytics_bp.post("/collect")
@limiter.limit("120 per minute")
def collect():
    payload = collect_schema.load(request.get_json(silent=True) or {})
    event_type = payload["type"]

    if event_type == "pageview":
        visit = SiteVisit(
            visitor_id=payload["visitor_id"],
            session_id=payload["session_id"],
            path=payload["path"],
            title=payload.get("title"),
            referrer=payload.get("referrer"),
            user_agent=(request.headers.get("User-Agent") or "")[:512] or None,
            ip_hash=_hash_ip(),
        )
        db.session.add(visit)
        db.session.commit()
        return jsonify({"success": True, "data": {"visitId": visit.id}}), 201

    if event_type == "duration":
        visit = (
            SiteVisit.query
            .filter_by(visitor_id=payload["visitor_id"], session_id=payload["session_id"], path=payload["path"])
            .order_by(SiteVisit.created_at.desc())
            .first()
        )
        if visit:
            visit.duration = max(visit.duration or 0, payload.get("duration", 0))
            db.session.commit()
        return jsonify({"success": True})

    event_name = payload.get("event_name")
    if not event_name:
        return jsonify({"success": False, "error": "缺少事件名称"}), 400

    event = SiteEvent(
        visitor_id=payload["visitor_id"],
        session_id=payload["session_id"],
        event_name=event_name,
        path=payload["path"],
        metadata_json=payload.get("metadata") or {},
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"success": True, "data": {"eventId": event.id}}), 201


@site_analytics_bp.get("/summary")
def summary():
    payload = summary_query_schema.load(request.args)
    days = payload["days"]
    start_date = date.today() - timedelta(days=days - 1)
    start_dt = datetime.combine(start_date, datetime.min.time())

    visit_query = SiteVisit.query.filter(SiteVisit.created_at >= start_dt)
    event_query = SiteEvent.query.filter(SiteEvent.created_at >= start_dt)

    total_pv = visit_query.count()
    total_uv = visit_query.with_entities(func.count(distinct(SiteVisit.visitor_id))).scalar() or 0
    total_events = event_query.count()
    avg_duration = int(visit_query.with_entities(func.avg(SiteVisit.duration)).scalar() or 0)

    trend_rows = (
        visit_query
        .with_entities(
            func.date(SiteVisit.created_at).label("day"),
            func.count(SiteVisit.id).label("pv"),
            func.count(distinct(SiteVisit.visitor_id)).label("uv"),
        )
        .group_by(func.date(SiteVisit.created_at))
        .all()
    )
    trend_map = {str(row.day): {"pv": row.pv, "uv": row.uv} for row in trend_rows}
    trend = []
    for offset in range(days):
        day = start_date + timedelta(days=offset)
        item = trend_map.get(_iso_day(day), {"pv": 0, "uv": 0})
        trend.append({"date": _iso_day(day), **item})

    page_rows = (
        visit_query
        .with_entities(
            SiteVisit.path,
            func.count(SiteVisit.id).label("pv"),
            func.count(distinct(SiteVisit.visitor_id)).label("uv"),
            func.avg(SiteVisit.duration).label("avg_duration"),
        )
        .group_by(SiteVisit.path)
        .order_by(func.count(SiteVisit.id).desc())
        .limit(10)
        .all()
    )
    pages = [
        {
            "path": row.path,
            "pv": row.pv,
            "uv": row.uv,
            "avgDuration": int(row.avg_duration or 0),
        }
        for row in page_rows
    ]

    referrer_counts = defaultdict(int)
    for (referrer,) in visit_query.with_entities(SiteVisit.referrer).all():
        referrer_counts[_to_domain(referrer)] += 1
    referrers = [
        {"source": source, "count": count}
        for source, count in sorted(referrer_counts.items(), key=lambda item: item[1], reverse=True)[:10]
    ]

    event_rows = (
        event_query
        .with_entities(SiteEvent.event_name, func.count(SiteEvent.id).label("count"))
        .group_by(SiteEvent.event_name)
        .order_by(func.count(SiteEvent.id).desc())
        .limit(10)
        .all()
    )
    events = [{"eventName": row.event_name, "count": row.count} for row in event_rows]

    recent_visits = [
        visit.to_dict()
        for visit in visit_query.order_by(SiteVisit.created_at.desc()).limit(12).all()
    ]

    return jsonify(
        {
            "success": True,
            "data": {
                "overview": {
                    "pv": total_pv,
                    "uv": total_uv,
                    "events": total_events,
                    "avgDuration": avg_duration,
                },
                "trend": trend,
                "pages": pages,
                "referrers": referrers,
                "events": events,
                "recentVisits": recent_visits,
            },
        }
    )
