"""Site analytics request schemas."""

from marshmallow import Schema, fields, validate


class AnalyticsCollectSchema(Schema):
    type = fields.String(
        required=True,
        validate=validate.OneOf(("pageview", "duration", "event"), error="统计类型无效"),
        error_messages={"required": "缺少统计类型"},
    )
    visitor_id = fields.String(
        required=True,
        data_key="visitorId",
        validate=validate.Length(min=8, max=64, error="访客标识无效"),
        error_messages={"required": "缺少访客标识"},
    )
    session_id = fields.String(
        required=True,
        data_key="sessionId",
        validate=validate.Length(min=8, max=64, error="会话标识无效"),
        error_messages={"required": "缺少会话标识"},
    )
    path = fields.String(
        required=True,
        validate=validate.Length(min=1, max=512, error="页面路径无效"),
        error_messages={"required": "缺少页面路径"},
    )
    title = fields.String(load_default=None, allow_none=True, validate=validate.Length(max=200))
    referrer = fields.String(load_default=None, allow_none=True, validate=validate.Length(max=512))
    duration = fields.Integer(load_default=0, validate=validate.Range(min=0, max=86400))
    event_name = fields.String(
        data_key="eventName",
        load_default=None,
        allow_none=True,
        validate=validate.Length(min=1, max=80, error="事件名称无效"),
    )
    metadata = fields.Dict(load_default=dict)


class AnalyticsSummaryQuerySchema(Schema):
    days = fields.Integer(load_default=30, validate=validate.Range(min=1, max=90))
