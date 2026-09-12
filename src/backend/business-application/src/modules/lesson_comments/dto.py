import re
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

COMMENT_TOMBSTONE = "Comment has been deleted"
MAX_COMMENT_LENGTH = 3000
_UNSAFE_CONTROL_CHARACTERS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


class CommentWrite(BaseModel):
    content: str = Field(min_length=1, max_length=MAX_COMMENT_LENGTH)
    parent_id: int | None = Field(default=None, ge=1)

    model_config = ConfigDict(extra="forbid")

    @field_validator("content", mode="before")
    @classmethod
    def normalize_content(cls, value: object) -> object:
        if not isinstance(value, str):
            return value

        normalized = value.replace("\r\n", "\n").replace("\r", "\n")
        normalized = _UNSAFE_CONTROL_CHARACTERS.sub("", normalized).strip()
        return normalized


class PaginationView(BaseModel):
    page: int
    size: int
    total: int


class CommentView(BaseModel):
    id: int
    lesson_content_id: int
    user_id: int
    parent_id: int | None
    content: str
    created_at: datetime
    updated_at: datetime
    is_deleted: bool


class CommentAuthorView(BaseModel):
    id: int
    full_name: str
    avatar_url: str | None


class LessonContentReferenceView(BaseModel):
    id: int
    lesson_id: int


class TeacherCommentView(CommentView):
    author: CommentAuthorView
    lesson_content: LessonContentReferenceView


class CommentListResponse(BaseModel):
    data: list[CommentView]
    pagination: PaginationView


class TeacherCommentListResponse(BaseModel):
    data: list[TeacherCommentView]
    pagination: PaginationView


class CommentMutationResponse(BaseModel):
    data: CommentView
    message: str


class DeleteCommentResponse(BaseModel):
    message: str = "Comment deleted successfully"
