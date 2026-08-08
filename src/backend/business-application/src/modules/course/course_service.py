from typing import List, Dict, Any
from fastapi import HTTPException
from src.modules.course.course_dto import (
    CourseCreateRequest, CourseUpdateRequest, CourseResponse,
    SectionCreateRequest, SectionUpdateRequest, SectionResponse,
    LessonCreateRequest, LessonUpdateRequest, LessonResponse,
    LessonContentCreateRequest, LessonContentUpdateRequest, LessonContentResponse,
    ReorderCurriculumRequest, ReorderResponse, DeleteResponse
)

# Mock storage
_courses: Dict[int, Dict[str, Any]] = {}
_sections: Dict[int, Dict[str, Any]] = {}
_lessons: Dict[int, Dict[str, Any]] = {}
_contents: Dict[int, Dict[str, Any]] = {}
_course_id_counter = 1
_section_id_counter = 1
_lesson_id_counter = 1
_content_id_counter = 1

class CourseService:
    def __init__(self):
        pass

    # --- HELPER METHODS FOR HIERARCHY AND OWNERSHIP ---
    def _verify_course(self, course_id: int, teacher_id: int) -> dict:
        course = _courses.get(course_id)
        if not course:
            raise HTTPException(status_code=404, detail="COURSE_NOT_FOUND")
        if course["teacher_id"] != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")
        return course

    def _verify_section(self, section_id: int, teacher_id: int) -> dict:
        section = _sections.get(section_id)
        if not section:
            raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
        self._verify_course(section["course_id"], teacher_id)
        return section

    def _verify_lesson(self, lesson_id: int, teacher_id: int) -> dict:
        lesson = _lessons.get(lesson_id)
        if not lesson:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
        self._verify_section(lesson["section_id"], teacher_id)
        return lesson

    def _verify_content(self, content_id: int, teacher_id: int) -> dict:
        content = _contents.get(content_id)
        if not content:
            raise HTTPException(status_code=404, detail="CONTENT_NOT_FOUND")
        self._verify_lesson(content["lesson_id"], teacher_id)
        return content

    # --- COURSE METHODS ---
    async def get_teacher_courses(self, teacher_id: int) -> List[CourseResponse]:
        return [CourseResponse(**c) for c in _courses.values() if c["teacher_id"] == teacher_id]

    async def create_course(self, teacher_id: int, data: CourseCreateRequest) -> CourseResponse:
        global _course_id_counter
        course_id = _course_id_counter
        _course_id_counter += 1
        
        course_data = data.model_dump()
        course_data["id"] = course_id
        course_data["teacher_id"] = teacher_id
        course_data["status"] = "DRAFT"
        
        _courses[course_id] = course_data
        return CourseResponse(**course_data)
        
    async def update_course(self, teacher_id: int, course_id: int, data: CourseUpdateRequest) -> CourseResponse:
        course = self._verify_course(course_id, teacher_id)
        course.update(data.model_dump())
        _courses[course_id] = course
        return CourseResponse(**course)

    # Note: Using class-level clear for tests
    @classmethod
    def _clear_mock_data(cls):
        global _course_id_counter, _section_id_counter, _lesson_id_counter, _content_id_counter
        _courses.clear()
        _sections.clear()
        _lessons.clear()
        _contents.clear()
        _course_id_counter = 1
        _section_id_counter = 1
        _lesson_id_counter = 1
        _content_id_counter = 1

    # --- SECTION METHODS ---
    async def create_section(self, teacher_id: int, course_id: int, data: SectionCreateRequest) -> SectionResponse:
        self._verify_course(course_id, teacher_id)
            
        global _section_id_counter
        section_id = _section_id_counter
        _section_id_counter += 1
        
        section_data = data.model_dump()
        section_data["id"] = section_id
        section_data["course_id"] = course_id
        
        _sections[section_id] = section_data
        return SectionResponse(**section_data)

    async def update_section(self, teacher_id: int, section_id: int, data: SectionUpdateRequest) -> SectionResponse:
        section = self._verify_section(section_id, teacher_id)
        section.update(data.model_dump())
        _sections[section_id] = section
        return SectionResponse(**section)

    async def delete_section(self, teacher_id: int, section_id: int) -> DeleteResponse:
        self._verify_section(section_id, teacher_id)
        del _sections[section_id]
        
        # Cascade delete lessons and their contents
        lessons_to_delete = [lid for lid, l in _lessons.items() if l["section_id"] == section_id]
        for lid in lessons_to_delete:
            contents_to_delete = [cid for cid, c in _contents.items() if c["lesson_id"] == lid]
            for cid in contents_to_delete:
                del _contents[cid]
            del _lessons[lid]
            
        return DeleteResponse(message="Section deleted successfully")

    # --- LESSON METHODS ---
    async def create_lesson(self, teacher_id: int, section_id: int, data: LessonCreateRequest) -> LessonResponse:
        self._verify_section(section_id, teacher_id)
            
        global _lesson_id_counter
        lesson_id = _lesson_id_counter
        _lesson_id_counter += 1
        
        lesson_data = data.model_dump()
        lesson_data["id"] = lesson_id
        lesson_data["section_id"] = section_id
        
        _lessons[lesson_id] = lesson_data
        return LessonResponse(**lesson_data)

    async def update_lesson(self, teacher_id: int, lesson_id: int, data: LessonUpdateRequest) -> LessonResponse:
        lesson = self._verify_lesson(lesson_id, teacher_id)
        lesson.update(data.model_dump())
        _lessons[lesson_id] = lesson
        return LessonResponse(**lesson)

    # --- LESSON CONTENT METHODS ---
    async def create_lesson_content(self, teacher_id: int, lesson_id: int, data: LessonContentCreateRequest) -> LessonContentResponse:
        self._verify_lesson(lesson_id, teacher_id)
            
        global _content_id_counter
        content_id = _content_id_counter
        _content_id_counter += 1
        
        content_data = data.model_dump()
        content_data["id"] = content_id
        content_data["lesson_id"] = lesson_id
        
        _contents[content_id] = content_data
        return LessonContentResponse(**content_data)

    async def update_lesson_content(self, teacher_id: int, content_id: int, data: LessonContentUpdateRequest) -> LessonContentResponse:
        content = self._verify_content(content_id, teacher_id)
        content.update(data.model_dump())
        _contents[content_id] = content
        return LessonContentResponse(**content)

    # --- REORDER METHODS ---
    async def reorder_curriculum(self, teacher_id: int, course_id: int, data: ReorderCurriculumRequest) -> ReorderResponse:
        self._verify_course(course_id, teacher_id)
            
        # Validate all items first
        for item in data.reorder_data:
            if item.item_type == "section":
                section = _sections.get(item.id)
                if not section or section["course_id"] != course_id:
                    raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
            elif item.item_type == "lesson":
                lesson = _lessons.get(item.id)
                if not lesson:
                    raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
                
                # Check current ownership
                current_section = _sections.get(lesson["section_id"])
                if not current_section or current_section["course_id"] != course_id:
                    raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
                    
                # If moving to a new section, validate new section belongs to same course
                if item.parent_id is not None:
                    new_section = _sections.get(item.parent_id)
                    if not new_section or new_section["course_id"] != course_id:
                        raise HTTPException(status_code=404, detail="SECTION_NOT_FOUND")
                        
        # Apply changes
        for item in data.reorder_data:
            if item.item_type == "section":
                _sections[item.id]["position"] = item.position
            elif item.item_type == "lesson":
                _lessons[item.id]["position"] = item.position
                if item.parent_id is not None:
                    _lessons[item.id]["section_id"] = item.parent_id
                    
        return ReorderResponse(message="Reordered successfully")
