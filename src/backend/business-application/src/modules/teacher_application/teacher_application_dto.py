from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from src.models.base_model import TeacherRegisterStatus


class TeacherApplicationCreateRequest(BaseModel):
    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str
    identity_front_url: str | None = None
    identity_back_url: str | None = None
    selfie_with_id_url: str | None = None
    cv_url: str | None = None
    motivation: str | None = None

class TeacherApplicationUpdateRequest(BaseModel):
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

class TeacherApplicationSubmitSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    legal_full_name: str
    identity_number: str
    education_evidence_urls: str
    identity_front_url: str
    identity_back_url: str
    selfie_with_id_url: str
    cv_url: str

class TeacherApplicationView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    teacher_profile_id: int
    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str
    identity_front_url: str | None = None
    identity_back_url: str | None = None
    selfie_with_id_url: str | None = None
    cv_url: str | None = None
    motivation: str | None = None
    status: TeacherRegisterStatus
    reviewed_note: str | None = None
    submitted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

class TeacherApplicationResponse(BaseModel):
    data: TeacherApplicationView

class TeacherApplicationListItemView(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    teacher_profile_id: int
    bio: str | None = None
    education_evidence_urls: str | None = None
    legal_full_name: str | None = None
    date_of_birth: date | None = None
    identity_number: str  # will be masked in service
    identity_front_url: str | None = None # will be None
    identity_back_url: str | None = None # will be None
    selfie_with_id_url: str | None = None # will be None
    cv_url: str | None = None
    motivation: str | None = None
    status: TeacherRegisterStatus
    reviewed_note: str | None = None
    submitted_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

class TeacherApplicationListResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    items: list[TeacherApplicationListItemView]

from pydantic import model_validator


class TeacherApplicationReviewRequest(BaseModel):
    status: TeacherRegisterStatus
    note: str | None = None

    @model_validator(mode="after")
    def validate_note(self):
        if self.status == TeacherRegisterStatus.REJECTED and not self.note:
            raise ValueError("note is required when rejecting an application")
        return self
