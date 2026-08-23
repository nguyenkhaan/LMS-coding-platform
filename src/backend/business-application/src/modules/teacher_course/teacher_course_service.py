from typing import List, Dict, Any
from fastapi import HTTPException
from src.models.base_model import CourseStatus
from src.modules.teacher_course.teacher_course_dto import (
    TeacherCourseCreateRequest, TeacherCourseUpdateRequest, TeacherCourseResponse,
    TeacherCourseSectionCreateRequest, TeacherCourseSectionUpdateRequest, TeacherCourseSectionResponse,
    TeacherCourseLessonCreateRequest, TeacherCourseLessonUpdateRequest, TeacherCourseLessonResponse,
    TeacherCourseLessonContentCreateRequest, TeacherCourseLessonContentUpdateRequest, TeacherCourseReadingCreateRequest, TeacherCourseReadingCreateResponse, TeacherCourseReadingUpdateRequest, TeacherCourseReadingResponse, TeacherCourseLessonContentResponse,
    TeacherCourseReorderRequest, TeacherCourseReorderResponse, TeacherCourseDeleteResponse
)

_courses: Dict[int, Dict[str, Any]] = {}
_sections: Dict[int, Dict[str, Any]] = {}
_readings: Dict[int, dict] = {}
_reading_id_counter = 1
_lessons: Dict[int, Dict[str, Any]] = {}
_contents: Dict[int, Dict[str, Any]] = {}
_course_id_counter = 1
_section_id_counter = 1
_lesson_id_counter = 1
_content_id_counter = 1

class TeacherCourseService:
    def __init__(self):
        pass

    def _partial_update(self, record: dict, data: Any) -> dict:
        updates = data.model_dump(exclude_unset=True, exclude_none=True)
        record.update(updates)
        return record

    def _get_course_or_404(self, course_id: int, teacher_id: int) -> dict:
        course = _courses.get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course["teacher_id"] != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        return course

    def _get_section_or_404(self, section_id: int, teacher_id: int) -> dict:
        section = _sections.get(section_id)
        if not section:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
        self._get_course_or_404(section["course_id"], teacher_id)
        return section

    def _get_lesson_or_404(self, lesson_id: int, teacher_id: int) -> dict:
        lesson = _lessons.get(lesson_id)
        if not lesson:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
        self._get_section_or_404(lesson["section_id"], teacher_id)
        return lesson

    def _get_content_or_404(self, content_id: int, teacher_id: int) -> dict:
        content = _contents.get(content_id)
        if not content:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
        self._get_lesson_or_404(content["lesson_id"], teacher_id)
        return content

    async def get_teacher_courses(self, teacher_id: int) -> List[TeacherCourseResponse]:
        return [TeacherCourseResponse(**c) for c in _courses.values() if c["teacher_id"] == teacher_id]

    async def create_course(self, teacher_id: int, data: TeacherCourseCreateRequest) -> TeacherCourseResponse:
        global _course_id_counter
        course_id = _course_id_counter
        _course_id_counter += 1

        course_data = data.model_dump()
        course_data["id"] = course_id
        course_data["teacher_id"] = teacher_id
        course_data["status"] = getattr(data, "status", CourseStatus.DRAFT) or CourseStatus.DRAFT

        _courses[course_id] = course_data
        return TeacherCourseResponse(**course_data)

    async def update_course(self, teacher_id: int, course_id: int, data: TeacherCourseUpdateRequest) -> TeacherCourseResponse:
        course = self._get_course_or_404(course_id, teacher_id)
        self._partial_update(course, data)
        _courses[course_id] = course
        return TeacherCourseResponse(**course)

    async def get_course_detail(self, teacher_id: int, course_id: int) -> TeacherCourseResponse:
        course = self._get_course_or_404(course_id, teacher_id)
        return TeacherCourseResponse(**course)

    async def submit_course_review(self, teacher_id: int, course_id: int) -> TeacherCourseResponse:
        from datetime import datetime, timezone
        course = self._get_course_or_404(course_id, teacher_id)
        
        if course["status"] not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        course["status"] = CourseStatus.PENDING_REVIEW
        course["submitted_at"] = datetime.now(timezone.utc).isoformat()
        
        _courses[course_id] = course
        return TeacherCourseResponse(**course)

    @classmethod
    def _reset_mock_data(cls):
        global _course_id_counter, _section_id_counter, _lesson_id_counter, _content_id_counter, _reading_id_counter
        _courses.clear()
        _sections.clear()
        _lessons.clear()
        _contents.clear()
        _readings.clear()
        _course_id_counter = 1
        _section_id_counter = 1
        _lesson_id_counter = 1
        _content_id_counter = 1
        _reading_id_counter = 1

    async def create_section(self, teacher_id: int, course_id: int, data: TeacherCourseSectionCreateRequest) -> TeacherCourseSectionResponse:
        self._get_course_or_404(course_id, teacher_id)

        global _section_id_counter
        section_id = _section_id_counter
        _section_id_counter += 1

        section_data = data.model_dump()
        section_data["id"] = section_id
        section_data["course_id"] = course_id

        _sections[section_id] = section_data
        return TeacherCourseSectionResponse(**section_data)

    async def update_section(self, teacher_id: int, section_id: int, data: TeacherCourseSectionUpdateRequest) -> TeacherCourseSectionResponse:
        section = self._get_section_or_404(section_id, teacher_id)
        self._partial_update(section, data)
        _sections[section_id] = section
        return TeacherCourseSectionResponse(**section)

    async def delete_section(self, teacher_id: int, section_id: int) -> TeacherCourseDeleteResponse:
        self._get_section_or_404(section_id, teacher_id)
        del _sections[section_id]

        lessons_to_delete = [lid for lid, l in _lessons.items() if l["section_id"] == section_id]
        for lid in lessons_to_delete:
            contents_to_delete = [cid for cid, c in _contents.items() if c["lesson_id"] == lid]
            for cid in contents_to_delete:
                del _contents[cid]
            del _lessons[lid]

        return TeacherCourseDeleteResponse(message="Section deleted successfully")

    async def create_lesson(self, teacher_id: int, section_id: int, data: TeacherCourseLessonCreateRequest) -> TeacherCourseLessonResponse:
        self._get_section_or_404(section_id, teacher_id)

        global _lesson_id_counter
        lesson_id = _lesson_id_counter
        _lesson_id_counter += 1

        lesson_data = data.model_dump()
        lesson_data["id"] = lesson_id
        lesson_data["section_id"] = section_id

        _lessons[lesson_id] = lesson_data
        return TeacherCourseLessonResponse(**lesson_data)

    async def update_lesson(self, teacher_id: int, lesson_id: int, data: TeacherCourseLessonUpdateRequest) -> TeacherCourseLessonResponse:
        lesson = self._get_lesson_or_404(lesson_id, teacher_id)
        self._partial_update(lesson, data)
        _lessons[lesson_id] = lesson
        return TeacherCourseLessonResponse(**lesson)

    async def delete_lesson(self, teacher_id: int, lesson_id: int) -> TeacherCourseDeleteResponse:
        lesson = self._get_lesson_or_404(lesson_id, teacher_id)
        section = _sections.get(lesson["section_id"])
        course = _courses.get(section["course_id"])
        
        if course["status"] not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        has_contents = any(c["lesson_id"] == lesson_id for c in _contents.values())
        if has_contents:
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        del _lessons[lesson_id]
        return TeacherCourseDeleteResponse(message="Deleted successfully")

    async def create_reading_content(self, teacher_id: int, lesson_id: int, data: TeacherCourseReadingCreateRequest) -> TeacherCourseReadingCreateResponse:
        lesson = self._get_lesson_or_404(lesson_id, teacher_id)
        section = _sections.get(lesson["section_id"])
        course = _courses.get(section["course_id"])
        
        if course["status"] not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")

        from datetime import datetime, timezone
        
        global _reading_id_counter, _content_id_counter
        reading_id = _reading_id_counter
        _reading_id_counter += 1
        
        content_id = _content_id_counter
        _content_id_counter += 1

        now = datetime.now(timezone.utc).isoformat()
        
        reading_data = {
            "id": reading_id,
            "title": data.title,
            "content": data.content,
            "created_at": now,
            "updated_at": now
        }
        _readings[reading_id] = reading_data
        
        lesson_content_data = {
            "id": content_id,
            "lesson_id": lesson_id,
            "content_type": "READING",
            "content_id": reading_id,
            "position": data.order,
            "created_at": now
        }
        _contents[content_id] = lesson_content_data
        
        return TeacherCourseReadingCreateResponse(
            reading_content=TeacherCourseReadingResponse(**reading_data),
            lesson_content=TeacherCourseLessonContentResponse(**lesson_content_data)
        )

    async def update_reading_content(self, teacher_id: int, content_id: int, data: TeacherCourseReadingUpdateRequest) -> TeacherCourseReadingResponse:
        content = self._get_content_or_404(content_id, teacher_id)
        
        lesson = _lessons.get(content["lesson_id"])
        section = _sections.get(lesson["section_id"])
        course = _courses.get(section["course_id"])
        
        if course["status"] not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        if content["content_type"] != "READING":
            raise HTTPException(status_code=400, detail="INVALID_REQUEST")
            
        reading = _readings.get(content["content_id"])
        if not reading:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
            
        from datetime import datetime, timezone
        if data.title is not None:
            reading["title"] = data.title
        if data.content is not None:
            reading["content"] = data.content
        reading["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        _readings[content["content_id"]] = reading
        return TeacherCourseReadingResponse(**reading)

    async def create_lesson_content(self, teacher_id: int, lesson_id: int, data: TeacherCourseLessonContentCreateRequest) -> TeacherCourseLessonContentResponse:
        self._get_lesson_or_404(lesson_id, teacher_id)

        global _content_id_counter
        content_id = _content_id_counter
        _content_id_counter += 1

        content_data = data.model_dump()
        content_data["id"] = content_id
        content_data["lesson_id"] = lesson_id

        _contents[content_id] = content_data
        return TeacherCourseLessonContentResponse(**content_data)

    async def update_lesson_content(self, teacher_id: int, content_id: int, data: TeacherCourseLessonContentUpdateRequest) -> TeacherCourseLessonContentResponse:
        content = self._get_content_or_404(content_id, teacher_id)
        self._partial_update(content, data)
        _contents[content_id] = content
        return TeacherCourseLessonContentResponse(**content)

    async def delete_lesson_content(self, teacher_id: int, content_id: int) -> TeacherCourseDeleteResponse:
        content = self._get_content_or_404(content_id, teacher_id)
        
        lesson = _lessons.get(content["lesson_id"])
        section = _sections.get(lesson["section_id"])
        course = _courses.get(section["course_id"])
        
        if course["status"] not in (CourseStatus.DRAFT, CourseStatus.REJECTED):
            raise HTTPException(status_code=409, detail="INVALID_STATE")
            
        del _contents[content_id]
        # Also clean up the reading content if it exists
        if content["content_type"] == "READING":
            reading_id = content.get("content_id")
            if reading_id in _readings:
                del _readings[reading_id]
                
        return TeacherCourseDeleteResponse(message="Deleted successfully")

    async def reorder_curriculum(self, teacher_id: int, course_id: int, data: TeacherCourseReorderRequest) -> TeacherCourseReorderResponse:
        self._get_course_or_404(course_id, teacher_id)

        # 1. Gather all existing items for this course
        existing_sections = {sid: s for sid, s in _sections.items() if s["course_id"] == course_id}
        existing_lessons = {lid: l for lid, l in _lessons.items() if l["section_id"] in existing_sections}
        existing_contents = {cid: c for cid, c in _contents.items() if c["lesson_id"] in existing_lessons}
        
        # 2. Check if the provided items match the existing items exactly
        provided_sections = {item.id for item in data.items if item.item_kind == "section"}
        provided_lessons = {item.id for item in data.items if item.item_kind == "lesson"}
        provided_contents = {item.id for item in data.items if item.item_kind == "lesson_content"}
        
        if provided_sections != set(existing_sections.keys()) or \
           provided_lessons != set(existing_lessons.keys()) or \
           provided_contents != set(existing_contents.keys()):
            raise HTTPException(status_code=400, detail="INVALID_REQUEST")

        # 3. Validate parent changes and uniqueness of positions
        positions_by_parent = {}

        for item in data.items:
            if item.item_kind == "section":
                parent_key = "course"
            elif item.item_kind == "lesson":
                if item.section_id is not None:
                    if item.section_id not in existing_sections:
                        raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
                    parent_key = f"section_{item.section_id}"
                else:
                    parent_key = f"section_{existing_lessons[item.id]['section_id']}"
            elif item.item_kind == "lesson_content":
                if item.section_id is not None:
                    if item.section_id not in existing_lessons:
                        raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
                    parent_key = f"lesson_{item.section_id}"
                else:
                    parent_key = f"lesson_{existing_contents[item.id]['lesson_id']}"
                    
            if parent_key not in positions_by_parent:
                positions_by_parent[parent_key] = set()
            if item.order in positions_by_parent[parent_key]:
                raise HTTPException(status_code=409, detail="INVALID_STATE")
            positions_by_parent[parent_key].add(item.order)

        # 4. Apply updates
        for item in data.items:
            if item.item_kind == "section":
                _sections[item.id]["order"] = item.order
            elif item.item_kind == "lesson":
                _lessons[item.id]["order"] = item.order
                if item.section_id is not None:
                    _lessons[item.id]["section_id"] = item.section_id
            elif item.item_kind == "lesson_content":
                _contents[item.id]["order"] = item.order
                if item.section_id is not None:
                    _contents[item.id]["lesson_id"] = item.section_id
                    
        return TeacherCourseReorderResponse(message="Reordered successfully")






