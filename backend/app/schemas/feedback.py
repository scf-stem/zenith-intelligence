"""Feedback request schemas."""

from marshmallow import Schema, ValidationError, fields, validate, validates_schema


FEEDBACK_CATEGORIES = ("general", "bug", "feature", "account", "content")
FEEDBACK_STATUSES = ("open", "reviewing", "resolved", "archived")


class FeedbackCreateSchema(Schema):
    category = fields.String(
        load_default="general",
        validate=validate.OneOf(FEEDBACK_CATEGORIES, error="反馈类型无效"),
    )
    content = fields.String(
        required=True,
        validate=validate.Length(min=5, max=2000, error="反馈内容长度需在 5-2000 个字符之间"),
        error_messages={"required": "请填写反馈内容"},
    )
    contact = fields.String(
        load_default=None,
        allow_none=True,
        validate=validate.Length(max=120, error="联系方式不能超过 120 个字符"),
    )
    page_url = fields.String(
        data_key="pageUrl",
        load_default=None,
        allow_none=True,
        validate=validate.Length(max=2048, error="页面地址过长"),
    )

    @validates_schema
    def validate_trimmed_content(self, data, **kwargs):
        if not (data.get("content") or "").strip():
            raise ValidationError("请填写反馈内容", field_name="content")


class FeedbackQuerySchema(Schema):
    page = fields.Integer(load_default=1, validate=validate.Range(min=1))
    per_page = fields.Integer(
        data_key="perPage",
        load_default=20,
        validate=validate.Range(min=1, max=100),
    )
    category = fields.String(
        load_default=None,
        allow_none=True,
        validate=validate.OneOf(FEEDBACK_CATEGORIES, error="反馈类型无效"),
    )
    status = fields.String(
        load_default=None,
        allow_none=True,
        validate=validate.OneOf(FEEDBACK_STATUSES, error="反馈状态无效"),
    )


class FeedbackUpdateSchema(Schema):
    status = fields.String(
        required=True,
        validate=validate.OneOf(FEEDBACK_STATUSES, error="反馈状态无效"),
        error_messages={"required": "请提供反馈状态"},
    )
