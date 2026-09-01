from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.base_model import LessonContentType
from src.models.course_model import CourseModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_model import LessonModel
from src.models.quiz_model import QuizModel
from src.models.section_model import SectionModel
from src.modules.teacher.teacher_course.teacher_course_dto import (
    TeacherCourseLessonContentResponse,
    TeacherCourseQuizCreateRequest,
    TeacherCourseQuizCreateResponse,
    TeacherCourseQuizQuestionsUpdateRequest,
    TeacherCourseQuizResponse,
    TeacherCourseQuizUpdateRequest,
)
class TeacherQuizService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _require_owned_lesson(self, lesson_id: int, teacher_id: int) -> None:
        from sqlalchemy import select

        course_teacher_id = await self.db.scalar(
            select(CourseModel.teacher_id)
            .select_from(LessonModel)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .join(CourseModel, CourseModel.id == SectionModel.course_id)
            .where(
                LessonModel.id == lesson_id,
                CourseModel.deleted_at.is_(None),
            )
        )
        if course_teacher_id is None:
            raise HTTPException(status_code=404, detail="LESSON_NOT_FOUND")
        if course_teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="FORBIDDEN")

    async def create_quiz(self, teacher_id: int, lesson_id: int, data: TeacherCourseQuizCreateRequest) -> TeacherCourseQuizCreateResponse:
        # Verify ownership using Task 1 pattern
        # Quiz creation/editing is intentionally NOT restricted by course status (unlike sections/lessons) - confirmed with team lead, since teachers may need to fix quiz content even after course is published.
        await self._require_owned_lesson(lesson_id, teacher_id)
        
        # Atomic creation
        new_quiz = QuizModel(
            title=data.title,
            passing_score=data.passing_score,
            start_date=data.start_date,
            end_date=data.end_date,
            attempts=data.attempts
        )
        self.db.add(new_quiz)
        await self.db.flush()
        
        new_content = LessonContentModel(
            lesson_id=lesson_id,
            content_type=LessonContentType.QUIZ,
            content_id=new_quiz.id,
            position=data.order
        )
        self.db.add(new_content)
        await self.db.commit()
        await self.db.refresh(new_quiz)
        await self.db.refresh(new_content)
        
        return TeacherCourseQuizCreateResponse(
            quiz=TeacherCourseQuizResponse.model_validate(new_quiz),
            lesson_content=TeacherCourseLessonContentResponse(
                id=new_content.id,
                lesson_id=new_content.lesson_id,
                content_type=new_content.content_type,
                content_id=new_content.content_id,
                media_url=new_content.media_url,
                position=new_content.position,
                created_at=new_content.created_at.isoformat() if new_content.created_at else None
            )
        )
    async def update_quiz(self, teacher_id: int, quiz_id: int, data: TeacherCourseQuizUpdateRequest) -> TeacherCourseQuizResponse:
        from sqlalchemy import select
        
        # Verify ownership by finding the lesson_content
        stmt = select(LessonContentModel).where(
            LessonContentModel.content_type == LessonContentType.QUIZ,
            LessonContentModel.content_id == quiz_id
        )
        result = await self.db.execute(stmt)
        lesson_content = result.scalar_one_or_none()
        
        if not lesson_content:
            raise HTTPException(status_code=404, detail="QUIZ_NOT_FOUND")
            
        # Verify ownership
        await self._require_owned_lesson(lesson_content.lesson_id, teacher_id)
        
        # Get quiz
        quiz_stmt = select(QuizModel).where(QuizModel.id == quiz_id)
        quiz_result = await self.db.execute(quiz_stmt)
        quiz = quiz_result.scalar_one_or_none()
        
        if not quiz:
            raise HTTPException(status_code=404, detail="QUIZ_NOT_FOUND")
            
        # Update quiz fields
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(quiz, key, value)
            
        await self.db.commit()
        await self.db.refresh(quiz)
        
        return TeacherCourseQuizResponse.model_validate(quiz)
    async def update_quiz_questions(self, teacher_id: int, quiz_id: int, data: TeacherCourseQuizQuestionsUpdateRequest) -> TeacherCourseQuizResponse:
        from sqlalchemy import delete, select

        from src.models.base_model import QuizAttemptStatus
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.models.quiz_option_model import QuizOptionModel
        from src.models.quiz_question_model import QuizQuestionModel
        
        # Verify ownership by finding the lesson_content
        stmt = select(LessonContentModel).where(
            LessonContentModel.content_type == LessonContentType.QUIZ,
            LessonContentModel.content_id == quiz_id
        )
        result = await self.db.execute(stmt)
        lesson_content = result.scalar_one_or_none()
        
        if not lesson_content:
            raise HTTPException(status_code=404, detail="QUIZ_NOT_FOUND")
            
        # Verify ownership
        await self._require_owned_lesson(lesson_content.lesson_id, teacher_id)
        
        # Check if quiz exists
        quiz_stmt = select(QuizModel).where(QuizModel.id == quiz_id)
        quiz_result = await self.db.execute(quiz_stmt)
        quiz = quiz_result.scalar_one_or_none()
        if not quiz:
            raise HTTPException(status_code=404, detail="QUIZ_NOT_FOUND")
            
        # 1. Check for IN_PROGRESS attempts
        attempt_stmt = select(QuizAttemptModel).where(
            QuizAttemptModel.quiz_id == quiz_id,
            QuizAttemptModel.status == QuizAttemptStatus.IN_PROGRESS
        )
        attempt_result = await self.db.execute(attempt_stmt)
        if attempt_result.first():
            raise HTTPException(status_code=409, detail="Cannot modify questions while students have an in-progress attempt")
            
        # 2. Bulk delete old options and questions
        question_ids_stmt = select(QuizQuestionModel.id).where(QuizQuestionModel.quiz_id == quiz_id)
        question_ids_result = await self.db.execute(question_ids_stmt)
        question_ids = question_ids_result.scalars().all()
        
        if question_ids:
            delete_options = delete(QuizOptionModel).where(QuizOptionModel.question_id.in_(question_ids))
            await self.db.execute(delete_options)
            
            delete_questions = delete(QuizQuestionModel).where(QuizQuestionModel.quiz_id == quiz_id)
            await self.db.execute(delete_questions)
            
        # 3. Bulk insert new questions and options
        for q_req in data.questions:
            new_q = QuizQuestionModel(
                quiz_id=quiz_id,
                title=q_req.title,
                content=q_req.content,
                question_type=q_req.question_type,
                points=q_req.points
            )
            self.db.add(new_q)
            await self.db.flush() # flush to get new_q.id
            
            for opt_req in q_req.options:
                new_opt = QuizOptionModel(
                    question_id=new_q.id,
                    content=opt_req.content,
                    is_correct=opt_req.is_correct
                )
                self.db.add(new_opt)
                
        await self.db.commit()
        await self.db.refresh(quiz)
        
        return TeacherCourseQuizResponse.model_validate(quiz)
