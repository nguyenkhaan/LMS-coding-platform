from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.base_model import LessonContentType
from src.models.lesson_content_model import LessonContentModel
from src.models.quiz_model import QuizModel
from src.modules.courses.authoring.dto import TeacherCourseLessonContentResponse
from src.modules.courses.authoring.service import TeacherCourseService
from src.modules.quizzes.dto import (
    TeacherCourseQuizCreateRequest,
    TeacherCourseQuizCreateResponse,
    TeacherCourseQuizQuestionsUpdateRequest,
    TeacherCourseQuizResponse,
    TeacherCourseQuizUpdateRequest,
)


class TeacherQuizService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.course_service = TeacherCourseService(self.db)

    async def _verify_lesson_ownership(self, lesson_id: int, teacher_id: int):
        from sqlalchemy import select

        from src.models.course_model import CourseModel
        from src.models.lesson_model import LessonModel
        from src.models.section_model import SectionModel

        lesson_stmt = select(LessonModel).where(LessonModel.id == lesson_id)
        lesson = (await self.db.execute(lesson_stmt)).scalar_one_or_none()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

        section_stmt = select(SectionModel).where(SectionModel.id == lesson.section_id)
        section = (await self.db.execute(section_stmt)).scalar_one_or_none()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")

        course_stmt = select(CourseModel).where(
            CourseModel.id == section.course_id, CourseModel.deleted_at.is_(None)
        )
        course = (await self.db.execute(course_stmt)).scalar_one_or_none()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        if course.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="You do not have permission to modify this lesson or quiz")

    async def create_quiz(
        self, teacher_id: int, lesson_id: int, data: TeacherCourseQuizCreateRequest
    ) -> TeacherCourseQuizCreateResponse:
        # Quiz authoring remains available after publication so teachers can fix quiz
        # content without changing course moderation state.
        await self._verify_lesson_ownership(lesson_id, teacher_id)

        # Atomic creation
        new_quiz = QuizModel(
            title=data.title,
            passing_score=data.passing_score,
            start_date=data.start_date,
            end_date=data.end_date,
            attempts=data.attempts,
        )
        self.db.add(new_quiz)
        await self.db.flush()

        new_content = LessonContentModel(
            lesson_id=lesson_id,
            content_type=LessonContentType.QUIZ,
            content_id=new_quiz.id,
            position=data.order,
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
                content_type=new_content.content_type.value,
                content_id=new_content.content_id,
                media_url=new_content.media_url,
                position=new_content.position,
                created_at=new_content.created_at.isoformat()
                if new_content.created_at
                else None,
            ),
        )

    async def update_quiz(
        self, teacher_id: int, quiz_id: int, data: TeacherCourseQuizUpdateRequest
    ) -> TeacherCourseQuizResponse:
        from sqlalchemy import select

        # Verify ownership by finding the lesson_content
        stmt = select(LessonContentModel).where(
            LessonContentModel.content_type == LessonContentType.QUIZ,
            LessonContentModel.content_id == quiz_id,
        )
        result = await self.db.execute(stmt)
        lesson_content = result.scalar_one_or_none()

        if not lesson_content:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Verify ownership
        await self._verify_lesson_ownership(lesson_content.lesson_id, teacher_id)

        # Get quiz
        quiz_stmt = select(QuizModel).where(QuizModel.id == quiz_id)
        quiz_result = await self.db.execute(quiz_stmt)
        quiz = quiz_result.scalar_one_or_none()

        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Update quiz fields
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(quiz, key, value)

        await self.db.commit()
        await self.db.refresh(quiz)

        return TeacherCourseQuizResponse.model_validate(quiz)

    async def update_quiz_questions(
        self,
        teacher_id: int,
        quiz_id: int,
        data: TeacherCourseQuizQuestionsUpdateRequest,
    ) -> TeacherCourseQuizResponse:
        from sqlalchemy import delete, select

        from src.models.base_model import QuizAttemptStatus
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.models.quiz_option_model import QuizOptionModel
        from src.models.quiz_question_model import QuizQuestionModel

        # Verify ownership by finding the lesson_content
        stmt = select(LessonContentModel).where(
            LessonContentModel.content_type == LessonContentType.QUIZ,
            LessonContentModel.content_id == quiz_id,
        )
        result = await self.db.execute(stmt)
        lesson_content = result.scalar_one_or_none()

        if not lesson_content:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Verify ownership
        await self._verify_lesson_ownership(lesson_content.lesson_id, teacher_id)
        quiz_stmt = select(QuizModel).where(QuizModel.id == quiz_id)
        quiz_result = await self.db.execute(quiz_stmt)
        quiz = quiz_result.scalar_one_or_none()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # 1. Check for IN_PROGRESS attempts
        attempt_stmt = select(QuizAttemptModel).where(
            QuizAttemptModel.quiz_id == quiz_id,
            QuizAttemptModel.status == QuizAttemptStatus.IN_PROGRESS,
        )
        attempt_result = await self.db.execute(attempt_stmt)
        if attempt_result.first():
            raise HTTPException(
                status_code=409,
                detail="Cannot modify questions while students have an in-progress attempt",
            )

        # 2. Bulk delete old options and questions
        question_ids_stmt = select(QuizQuestionModel.id).where(
            QuizQuestionModel.quiz_id == quiz_id
        )
        question_ids_result = await self.db.execute(question_ids_stmt)
        question_ids = question_ids_result.scalars().all()

        if question_ids:
            delete_options = delete(QuizOptionModel).where(
                QuizOptionModel.question_id.in_(question_ids)
            )
            await self.db.execute(delete_options)

            delete_questions = delete(QuizQuestionModel).where(
                QuizQuestionModel.quiz_id == quiz_id
            )
            await self.db.execute(delete_questions)

        # 3. Bulk insert new questions and options
        for q_req in data.questions:
            new_q = QuizQuestionModel(
                quiz_id=quiz_id,
                title=q_req.title,
                content=q_req.content,
                question_type=q_req.question_type.value
                if hasattr(q_req.question_type, "value")
                else q_req.question_type,
                points=q_req.points,
            )
            self.db.add(new_q)
            await self.db.flush()  # flush to get new_q.id

            for opt_req in q_req.options:
                new_opt = QuizOptionModel(
                    question_id=new_q.id,
                    content=opt_req.content,
                    is_correct=opt_req.is_correct,
                )
                self.db.add(new_opt)

        await self.db.commit()
        await self.db.refresh(quiz)

        return TeacherCourseQuizResponse.model_validate(quiz)

class StudentQuizService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _require_enrolled_in_quiz_course(self, quiz_id: int, student_id: int) -> tuple[int, int, int]:
        from sqlalchemy import select
        from src.models.lesson_content_model import LessonContentModel, LessonContentType
        from src.models.lesson_model import LessonModel
        from src.models.section_model import SectionModel
        from src.models.course_model import CourseModel
        from src.models.enrollment_model import EnrollmentModel as CourseEnrollmentModel

        stmt = (
            select(CourseModel.id, CourseEnrollmentModel.id, LessonContentModel.id)
            .join(SectionModel, SectionModel.course_id == CourseModel.id)
            .join(LessonModel, LessonModel.section_id == SectionModel.id)
            .join(LessonContentModel, LessonContentModel.lesson_id == LessonModel.id)
            .outerjoin(CourseEnrollmentModel, CourseEnrollmentModel.course_id == CourseModel.id)
            .where(LessonContentModel.content_id == quiz_id)
            .where(LessonContentModel.content_type == LessonContentType.QUIZ)
            .where(CourseModel.deleted_at.is_(None))
        )
        
        result = await self.db.execute(stmt)
        row = result.first()
        
        if not row:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found",
            )
            
        course_id, enrollment_id, lesson_content_id = row
        
        if enrollment_id is None:
            # We must check if the student is actually enrolled. The outerjoin means 
            # we need to check if there is an enrollment for THIS student.
            enrollment_stmt = select(CourseEnrollmentModel.id).where(
                CourseEnrollmentModel.course_id == course_id,
                CourseEnrollmentModel.student_id == student_id
            )
            real_enrollment_id = await self.db.scalar(enrollment_stmt)
            if not real_enrollment_id:
                from fastapi import HTTPException, status
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Student is not enrolled in the course containing this quiz",
                )
            enrollment_id = real_enrollment_id
        else:
            # Check if the joined enrollment belongs to the student
            # If not, query again explicitly
            enrollment_stmt = select(CourseEnrollmentModel.id).where(
                CourseEnrollmentModel.course_id == course_id,
                CourseEnrollmentModel.student_id == student_id
            )
            real_enrollment_id = await self.db.scalar(enrollment_stmt)
            if not real_enrollment_id:
                from fastapi import HTTPException, status
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Student is not enrolled in the course containing this quiz",
                )
            enrollment_id = real_enrollment_id

        return course_id, enrollment_id, lesson_content_id

    async def _get_quiz_with_learner_questions(self, quiz_id: int):
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        from src.models.quiz_model import QuizModel
        from src.models.quiz_question_model import QuizQuestionModel

        stmt = (
            select(QuizModel)
            .options(
                selectinload(QuizModel.questions).selectinload(QuizQuestionModel.options)
            )
            .where(QuizModel.id == quiz_id)
        )
        quiz = await self.db.scalar(stmt)
        
        if not quiz:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found",
            )
        return quiz

    async def start_attempt(self, quiz_id: int, student_id: int) -> QuizStartResponse:
        from datetime import datetime, UTC
        from sqlalchemy import select, func, update
        from fastapi import HTTPException, status
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.models.base_model import QuizAttemptStatus
        from src.modules.quizzes.dto import (
            QuizStartResponse, QuizAttemptDetailResponse, QuizAttemptView, QuizQuestionLearnerView, QuizOptionLearnerView
        )
        
        await self._require_enrolled_in_quiz_course(quiz_id, student_id)
        quiz = await self._get_quiz_with_learner_questions(quiz_id)

        now = datetime.now(UTC)
        if quiz.start_date and now < quiz.start_date.replace(tzinfo=UTC):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Quiz is not yet available",
            )
            
        if quiz.end_date and now > quiz.end_date.replace(tzinfo=UTC):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Quiz has ended",
            )

        if quiz.attempts is not None:
            attempt_count_stmt = select(func.count(QuizAttemptModel.id)).where(
                QuizAttemptModel.quiz_id == quiz_id,
                QuizAttemptModel.student_id == student_id
            )
            attempt_count = await self.db.scalar(attempt_count_stmt)
            
            if attempt_count >= quiz.attempts:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Maximum number of attempts reached for this quiz",
                )

        # Abandon previous IN_PROGRESS attempts
        abandon_stmt = (
            update(QuizAttemptModel)
            .where(
                QuizAttemptModel.quiz_id == quiz_id,
                QuizAttemptModel.student_id == student_id,
                QuizAttemptModel.status == QuizAttemptStatus.IN_PROGRESS
            )
            .values(status=QuizAttemptStatus.ABANDONED)
        )
        await self.db.execute(abandon_stmt)
        max_attempt_no_stmt = select(func.max(QuizAttemptModel.attempt_no)).where(
            QuizAttemptModel.quiz_id == quiz_id,
            QuizAttemptModel.student_id == student_id
        )
        max_attempt_no = await self.db.scalar(max_attempt_no_stmt)
        next_attempt_no = (max_attempt_no or 0) + 1

        new_attempt = QuizAttemptModel(
            quiz_id=quiz_id,
            student_id=student_id,
            attempt_no=next_attempt_no,
            status=QuizAttemptStatus.IN_PROGRESS,
            started_at=now
        )
        self.db.add(new_attempt)
        await self.db.commit()
        await self.db.refresh(new_attempt)

        attempt_view = QuizAttemptView.model_validate(new_attempt)
        attempt_view.expires_at = quiz.end_date

        learner_questions = []
        for q in quiz.questions:
            learner_options = [QuizOptionLearnerView.model_validate(o) for o in q.options]
            q_view = QuizQuestionLearnerView(
                id=q.id,
                quiz_id=q.quiz_id,
                title=q.title,
                content=q.content,
                question_type=q.question_type.value if hasattr(q.question_type, 'value') else q.question_type,
                points=float(q.points) if q.points is not None else 0.0,
                options=learner_options
            )
            learner_questions.append(q_view)

        return QuizStartResponse(
            attempt=attempt_view,
            questions=learner_questions
        )


    async def get_attempt_detail(self, quiz_id: int, attempt_id: int, student_id: int) -> QuizAttemptDetailResponse:
        from src.models.quiz_attempt_model import QuizAttemptModel
        from fastapi import HTTPException, status
        attempt = await self.db.get(QuizAttemptModel, attempt_id)
        if not attempt or attempt.quiz_id != quiz_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attempt not found",
            )
            
        if attempt.student_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own this attempt",
            )
        course_id, enrollment_id, lesson_content_id = await self._require_enrolled_in_quiz_course(quiz_id, student_id)

        quiz = await self._get_quiz_with_learner_questions(quiz_id)

        from src.modules.quizzes.dto import QuizAttemptView, QuizQuestionLearnerView, QuizOptionLearnerView, QuizAttemptDetailResponse
        attempt_view = QuizAttemptView.model_validate(attempt)
        attempt_view.expires_at = quiz.end_date

        learner_questions = []
        for q in quiz.questions:
            learner_options = [QuizOptionLearnerView.model_validate(o) for o in q.options]
            q_view = QuizQuestionLearnerView(
                id=q.id,
                quiz_id=q.quiz_id,
                title=q.title,
                content=q.content,
                question_type=q.question_type.value if hasattr(q.question_type, 'value') else q.question_type,
                points=float(q.points) if q.points is not None else 0.0,
                options=learner_options
            )
            learner_questions.append(q_view)

        return QuizAttemptDetailResponse(
            attempt=attempt_view,
            questions=learner_questions
        )





    async def submit_attempt(self, quiz_id: int, attempt_id: int, student_id: int, payload: QuizAttemptSubmitRequest) -> QuizSubmitResponse:
        # Business decision confirmed 2026-09-12: multi-select uses all-or-nothing scoring, no partial credit
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.models.base_model import QuizAttemptStatus
        from src.models.quiz_model import QuizModel
        from src.models.quiz_question_model import QuizQuestionModel
        from src.models.quiz_submission_model import QuizSubmissionModel
        from sqlalchemy import select
        from sqlalchemy.orm import selectinload
        from sqlalchemy.exc import IntegrityError
        from fastapi import HTTPException, status
        import json

        attempt = await self.db.get(QuizAttemptModel, attempt_id)
        if not attempt or attempt.quiz_id != quiz_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Attempt not found",
            )
            
        if attempt.student_id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not own this attempt",
            )
        course_id, enrollment_id, lesson_content_id = await self._require_enrolled_in_quiz_course(quiz_id, student_id)

        quiz = await self.db.scalar(
            select(QuizModel)
            .options(
                selectinload(QuizModel.questions).selectinload(QuizQuestionModel.options)
            )
            .where(QuizModel.id == quiz_id)
        )
        
        if not quiz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found",
            )

        if attempt.status == QuizAttemptStatus.SUBMITTED:
            existing_submission = await self.db.scalar(
                select(QuizSubmissionModel).where(QuizSubmissionModel.quiz_attempt_id == attempt_id)
            )
            if not existing_submission:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Data inconsistency: Attempt is SUBMITTED but has no submission"
                )
            
            # Re-calculate passed based on existing_submission.score and quiz.passing_score
            return self._build_idempotent_response(attempt, existing_submission, quiz)
            
        elif attempt.status == QuizAttemptStatus.ABANDONED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot submit an abandoned attempt",
            )
        elif attempt.status != QuizAttemptStatus.IN_PROGRESS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot submit attempt in {attempt.status.value} status",
            )
        valid_q_map = {q.id: [o.id for o in q.options] for q in quiz.questions}
        
        for ans in payload.answers:
            if ans.question_id not in valid_q_map:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Question {ans.question_id} does not belong to this quiz"
                )
            
            valid_opts = valid_q_map[ans.question_id]
            for opt_id in ans.option_ids:
                if opt_id not in valid_opts:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Option {opt_id} does not belong to question {ans.question_id}"
                    )

        # End of 7a validation.

        # Phase 7b: Grading
        correct_answers_map = {q.id: set(o.id for o in q.options if o.is_correct) for q in quiz.questions}
        submitted_answers_map = {ans.question_id: set(ans.option_ids) for ans in payload.answers}

        score = 0.0
        max_points = 0.0

        for q in quiz.questions:
            q_points = float(q.points) if q.points is not None else 0.0
            max_points += q_points
            
            correct_set = correct_answers_map[q.id]
            submitted_set = submitted_answers_map.get(q.id, set())
            
            # All-or-nothing scoring
            if correct_set == submitted_set:
                score += q_points

        from datetime import datetime, UTC
        submission = QuizSubmissionModel(
            quiz_attempt_id=attempt_id,
            score=score,
            answers=json.dumps(payload.model_dump(mode="json")["answers"]),
            submitted_at=datetime.now(UTC)
        )
        
        # Calculate passed
        if max_points > 0:
            passed = (score / max_points) * 100 >= quiz.passing_score
        else:
            passed = (quiz.passing_score == 0.0)

        attempt.status = QuizAttemptStatus.SUBMITTED
        
        progress_view = None
        if passed:
            from sqlalchemy.dialects.postgresql import insert
            from src.models.lesson_content_progress_model import LessonContentProgressModel
            
            stmt = insert(LessonContentProgressModel).values(
                enrollment_id=enrollment_id,
                lesson_content_id=lesson_content_id,
                completed=True,
                completed_at=datetime.now(UTC)
            ).on_conflict_do_nothing(
                index_elements=["enrollment_id", "lesson_content_id"]
            ).returning(LessonContentProgressModel)
            
            progress_row = await self.db.scalar(stmt)
            if progress_row:
                from src.modules.quizzes.dto import LessonContentProgressView
                progress_view = LessonContentProgressView.model_validate(progress_row)
        
        quiz_passing_score = quiz.passing_score
        quiz_end_date = quiz.end_date
        
        self.db.add(submission)
        try:
            await self.db.commit()
            await self.db.refresh(submission)
            await self.db.refresh(attempt)
        except IntegrityError:
            await self.db.rollback()
            # Race condition: another request submitted for this attempt concurrently.
            
            # Query the newly updated attempt from DB
            attempt = await self.db.get(QuizAttemptModel, attempt_id)
            
            existing_submission = await self.db.scalar(
                select(QuizSubmissionModel).where(QuizSubmissionModel.quiz_attempt_id == attempt_id)
            )
            if not existing_submission:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Data inconsistency: Attempt is SUBMITTED but has no submission after race condition"
                )
            
            return self._build_idempotent_response(attempt, existing_submission, quiz)

        from src.modules.quizzes.dto import QuizAttemptView, QuizSubmissionView, QuizSubmitResponse
        attempt_view = QuizAttemptView.model_validate(attempt)
        attempt_view.expires_at = quiz_end_date
        
        submission_view = QuizSubmissionView.model_validate(submission)
        
        return QuizSubmitResponse(
            attempt=attempt_view,
            submission=submission_view,
            passed=passed,
            progress=progress_view
        )

    def _build_idempotent_response(self, attempt, existing_submission, quiz):
        from src.modules.quizzes.dto import QuizAttemptView, QuizSubmissionView, QuizSubmitResponse
        
        max_points = sum(float(q.points) if q.points is not None else 0.0 for q in quiz.questions)
        if max_points > 0:
            passed = (float(existing_submission.score) / max_points) * 100 >= quiz.passing_score
        else:
            passed = (quiz.passing_score == 0.0)
        
        attempt_view = QuizAttemptView.model_validate(attempt)
        attempt_view.expires_at = quiz.end_date
        submission_view = QuizSubmissionView.model_validate(existing_submission)
        
        return QuizSubmitResponse(
            attempt=attempt_view,
            submission=submission_view,
            passed=passed,
            progress=None
        )





    async def list_attempts(self, quiz_id: int, student_id: int, page: int = 1, size: int = 20):
        from fastapi import HTTPException, status
        from sqlalchemy import select, func
        from src.models.quiz_model import QuizModel
        from src.models.quiz_attempt_model import QuizAttemptModel
        from src.modules.quizzes.dto import QuizAttemptView, QuizAttemptListResponse, PaginationMeta
        await self._require_enrolled_in_quiz_course(quiz_id, student_id)
        quiz = await self.db.scalar(select(QuizModel).where(QuizModel.id == quiz_id))
        if not quiz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found",
            )
        
        # Business decision confirmed 2026-09-12: Cap size to 100 for safety, not in spec
        if size > 100:
            size = 100
        if size < 1:
            size = 1
        if page < 1:
            page = 1
        total_stmt = select(func.count()).select_from(QuizAttemptModel).where(
            QuizAttemptModel.quiz_id == quiz_id,
            QuizAttemptModel.student_id == student_id
        )
        total = await self.db.scalar(total_stmt)
        stmt = (
            select(QuizAttemptModel)
            .where(
                QuizAttemptModel.quiz_id == quiz_id,
                QuizAttemptModel.student_id == student_id
            )
            .order_by(QuizAttemptModel.attempt_no.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        attempts_db = await self.db.scalars(stmt)
        
        items = []
        for attempt in attempts_db:
            view = QuizAttemptView.model_validate(attempt)
            view.expires_at = quiz.end_date
            items.append(view)
            
        return QuizAttemptListResponse(
            data=items,
            pagination=PaginationMeta(
                page=page,
                size=size,
                total=total
            )
        )

