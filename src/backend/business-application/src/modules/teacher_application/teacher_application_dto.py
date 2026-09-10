from dataclasses import dataclass
from datetime import date, datetime
from typing import Literal

from fastapi import UploadFile
from pydantic import BaseModel, ConfigDict, Field, model_validator

from src.models.base_model import TeacherRegisterStatus


class TeacherApplicationCreateRequest(BaseModel):
    """Fields a student may provide while creating a draft.

    ``identity_number`` remains required because the existing database column is
    non-null and unique. All other fields are validated when the draft is
    submitted.
    """

    model_config = ConfigDict(extra="forbid")

    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str = Field(min_length=1)
    motivation: str | None = None


class TeacherApplicationUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str | None = Field(default=None, min_length=1)
    motivation: str | None = None


@dataclass(frozen=True)
class TeacherApplicationDocumentUploads:
    """Files accepted only as multipart uploads, never client-supplied URLs."""

    identity_front: UploadFile | None = None
    identity_back: UploadFile | None = None
    selfie_with_id: UploadFile | None = None
    education_evidence: UploadFile | None = None
    cv: UploadFile | None = None

    def has_any(self) -> bool:
        return any(
            (
                self.identity_front,
                self.identity_back,
                self.selfie_with_id,
                self.education_evidence,
                self.cv,
            )
        )


class TeacherApplicationSubmitSchema(BaseModel):
    """Persisted fields that must be present before the status becomes PENDING."""

    model_config = ConfigDict(from_attributes=True)

    legal_full_name: str = Field(min_length=1)
    identity_number: str = Field(min_length=1)
    education_evidence_urls: str = Field(min_length=1)
    identity_front_url: str = Field(min_length=1)
    identity_back_url: str = Field(min_length=1)
    selfie_with_id_url: str = Field(min_length=1)
    cv_url: str = Field(min_length=1)


class TeacherProfileView(BaseModel):
    """Projection limited to columns that exist in ``teacher_profile``."""

    model_config = ConfigDict(from_attributes=True)

    user_id: int
    avatar_url: str | None = None
    headline: str | None = None
    expertise_tags: str | None = None
    years_of_experience: int | None = None
    education_entries: str | None = None
    experience_entries: str | None = None
    github_url: str | None = None
    linkedin_url: str | None = None
    website_url: str | None = None
    email: str | None = None
    phone: str | None = None
    created_at: datetime
    updated_at: datetime


class TeacherApplicationHistoryView(BaseModel):
    id: int
    teacher_register_id: int
    status: TeacherRegisterStatus
    note: str | None = None
    acted_by: int | None = None
    acted_at: datetime


class TeacherApplicationView(BaseModel):
    id: int
    teacher_profile_id: int
    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str | None = None
    identity_front_url: str | None = None
    identity_back_url: str | None = None
    selfie_with_id_url: str | None = None
    cv_url: str | None = None
    motivation: str | None = None
    status: TeacherRegisterStatus
    reviewed_note: str | None = None
    reviewed_by: int | None = None
    reviewed_at: datetime | None = None
    submitted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class TeacherApplicationMeResponse(BaseModel):
    application: TeacherApplicationView
    teacher_profile: TeacherProfileView
    history: list[TeacherApplicationHistoryView]
    can_edit: bool
    can_submit: bool


class TeacherApplicationAdminDetailResponse(BaseModel):
    application: TeacherApplicationView
    teacher_profile: TeacherProfileView
    history: list[TeacherApplicationHistoryView]


class TeacherApplicationSubmitResponse(BaseModel):
    id: int
    status: Literal[TeacherRegisterStatus.PENDING]
    submitted_at: datetime


class TeacherApplicationReviewResponse(BaseModel):
    application: TeacherApplicationView
    history: TeacherApplicationHistoryView


class TeacherApplicationListResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[TeacherApplicationView]


class TeacherApplicationReviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    decision: Literal[
        TeacherRegisterStatus.APPROVED,
        TeacherRegisterStatus.REJECTED,
    ]
    note: str | None = None

    @model_validator(mode="after")
    def rejection_requires_note(self) -> "TeacherApplicationReviewRequest":
        if self.decision == TeacherRegisterStatus.REJECTED and not self.note:
            raise ValueError("note is required when rejecting an application")
        return self
