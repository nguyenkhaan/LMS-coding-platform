from dataclasses import dataclass

from fastapi import HTTPException
from sqlalchemy import case, func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import aliased

from src.models.base_model import AccountStatus, Role, utc_now
from src.models.comment_model import CommentModel
from src.models.course_model import CourseModel
from src.models.enrollment_model import EnrollmentModel
from src.models.lesson_content_model import LessonContentModel
from src.models.lesson_model import LessonModel
from src.models.role_model import UserRoleModel
from src.models.section_model import SectionModel
from src.models.user_model import UserModel
from src.modules.lesson_comment.lesson_comment_dto import (
    COMMENT_TOMBSTONE,
    CommentAuthorView,
    CommentListResponse,
    CommentMutationResponse,
    CommentView,
    CommentWrite,
    DeleteCommentResponse,
    LessonContentReferenceView,
    PaginationView,
    TeacherCommentListResponse,
    TeacherCommentView,
)


@dataclass(frozen=True, slots=True)
class _CourseContext:
    course_id: int
    teacher_id: int


class LessonCommentService:
    def __init__(self, db_session: AsyncSession) -> None:
        self.db_session = db_session

    async def list_lesson_content_comments(
        self,
        lesson_content_id: int,
        user_id: int,
        page: int,
        size: int,
    ) -> CommentListResponse:
        course = await self._get_lesson_content_course(lesson_content_id)
        if course is None:
            raise HTTPException(status_code=404, detail="Lesson content not found")
        await self._require_course_access(course, user_id)

        total = await self._count_root_comments(lesson_content_id)
        root_ids = await self._list_root_comment_ids(
            lesson_content_id=lesson_content_id,
            page=page,
            size=size,
        )
        comments = await self._list_comment_threads(root_ids)

        return CommentListResponse(
            data=[self._to_comment_view(comment) for comment in comments],
            pagination=PaginationView(page=page, size=size, total=total or 0),
        )

    async def create_comment(
        self,
        lesson_content_id: int,
        user_id: int,
        payload: CommentWrite,
    ) -> CommentMutationResponse:
        course = await self._get_lesson_content_course(lesson_content_id)
        if course is None:
            raise HTTPException(status_code=404, detail="Lesson content not found")
        await self._require_course_access(course, user_id)

        if payload.parent_id is not None:
            parent = await self._get_comment(payload.parent_id, for_update=True)
            if parent is None:
                raise HTTPException(status_code=404, detail="Parent comment not found")
            if parent.lesson_content_id != lesson_content_id:
                raise HTTPException(
                    status_code=400,
                    detail="Parent comment does not belong to this lesson content",
                )
            if parent.deleted_at is not None:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot reply to a deleted comment",
                )

        comment = CommentModel(
            lesson_content_id=lesson_content_id,
            user_id=user_id,
            parent_id=payload.parent_id,
            content=payload.content,
        )
        self.db_session.add(comment)
        try:
            await self.db_session.flush()
            await self.db_session.refresh(comment)
            await self.db_session.commit()
        except SQLAlchemyError:
            await self.db_session.rollback()
            raise

        return CommentMutationResponse(
            data=self._to_comment_view(comment),
            message="Comment created successfully",
        )

    async def delete_comment(
        self,
        comment_id: int,
        user_id: int,
    ) -> DeleteCommentResponse:
        await self._require_active_user(user_id)
        comment = await self._get_comment(comment_id, for_update=True)
        if comment is None:
            return DeleteCommentResponse()

        is_moderator = await self._is_course_moderator(
            lesson_content_id=comment.lesson_content_id,
            user_id=user_id,
        )
        if comment.user_id != user_id and not is_moderator:
            raise HTTPException(
                status_code=403,
                detail="You cannot delete this comment",
            )
        if comment.deleted_at is not None:
            return DeleteCommentResponse()

        try:
            if comment.parent_id is None:
                await self.db_session.delete(comment)
            else:
                child_id = await self.db_session.scalar(
                    select(CommentModel.id)
                    .where(CommentModel.parent_id == comment.id)
                    .limit(1)
                )
                if child_id is None:
                    await self.db_session.delete(comment)
                else:
                    comment.content = ""
                    comment.deleted_at = utc_now()
            await self.db_session.commit()
        except SQLAlchemyError:
            await self.db_session.rollback()
            raise

        return DeleteCommentResponse()

    async def list_teacher_course_comments(
        self,
        course_id: int,
        user_id: int,
        unanswered_only: bool,
        page: int,
        size: int,
    ) -> TeacherCommentListResponse:
        course = await self.db_session.scalar(
            select(CourseModel).where(
                CourseModel.id == course_id,
                CourseModel.deleted_at.is_(None),
            )
        )
        if course is None:
            raise HTTPException(status_code=404, detail="Course not found")
        await self._require_active_user(user_id)
        if course.teacher_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Only the course owner can view course comments",
            )

        comment = aliased(CommentModel)
        filters = [SectionModel.course_id == course_id]
        if unanswered_only:
            root = aliased(CommentModel)
            thread = (
                select(
                    root.id.label("comment_id"),
                    root.id.label("root_id"),
                )
                .select_from(root)
                .join(
                    LessonContentModel,
                    LessonContentModel.id == root.lesson_content_id,
                )
                .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
                .join(SectionModel, SectionModel.id == LessonModel.section_id)
                .where(
                    root.parent_id.is_(None),
                    SectionModel.course_id == course_id,
                )
                .cte("course_comment_thread", recursive=True)
            )
            descendant = aliased(CommentModel)
            thread = thread.union_all(
                select(descendant.id, thread.c.root_id)
                .select_from(descendant)
                .join(thread, descendant.parent_id == thread.c.comment_id)
            )
            reply = aliased(CommentModel)
            answered_root_ids = (
                select(thread.c.root_id)
                .join(reply, reply.id == thread.c.comment_id)
                .where(
                    thread.c.comment_id != thread.c.root_id,
                    reply.user_id == course.teacher_id,
                    reply.deleted_at.is_(None),
                )
            )
            filters.extend(
                [
                    comment.parent_id.is_(None),
                    comment.user_id != course.teacher_id,
                    comment.id.not_in(answered_root_ids),
                ]
            )

        total = await self.db_session.scalar(
            select(func.count(comment.id))
            .select_from(comment)
            .join(
                LessonContentModel,
                LessonContentModel.id == comment.lesson_content_id,
            )
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .where(*filters)
        )
        result = await self.db_session.execute(
            select(comment, UserModel, LessonContentModel)
            .select_from(comment)
            .join(UserModel, UserModel.id == comment.user_id)
            .join(
                LessonContentModel,
                LessonContentModel.id == comment.lesson_content_id,
            )
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .where(*filters)
            .order_by(comment.created_at.desc(), comment.id.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        rows = result.all()

        return TeacherCommentListResponse(
            data=[
                self._to_teacher_comment_view(comment_row, user, lesson_content)
                for comment_row, user, lesson_content in rows
            ],
            pagination=PaginationView(page=page, size=size, total=total or 0),
        )

    async def _count_root_comments(self, lesson_content_id: int) -> int:
        total = await self.db_session.scalar(
            select(func.count(CommentModel.id)).where(
                CommentModel.lesson_content_id == lesson_content_id,
                CommentModel.parent_id.is_(None),
            )
        )
        return total or 0

    async def _list_root_comment_ids(
        self,
        lesson_content_id: int,
        page: int,
        size: int,
    ) -> list[int]:
        result = await self.db_session.execute(
            select(CommentModel.id)
            .where(
                CommentModel.lesson_content_id == lesson_content_id,
                CommentModel.parent_id.is_(None),
            )
            .order_by(CommentModel.created_at.desc(), CommentModel.id.desc())
            .offset((page - 1) * size)
            .limit(size)
        )
        return list(result.scalars().all())

    async def _list_comment_threads(
        self,
        root_ids: list[int],
    ) -> list[CommentModel]:
        if not root_ids:
            return []

        thread = (
            select(
                CommentModel.id.label("comment_id"),
                CommentModel.id.label("root_id"),
            )
            .where(CommentModel.id.in_(root_ids))
            .cte("selected_comment_thread", recursive=True)
        )
        reply = aliased(CommentModel)
        thread = thread.union_all(
            select(reply.id, thread.c.root_id)
            .select_from(reply)
            .join(thread, reply.parent_id == thread.c.comment_id)
        )
        root_position = case(
            {root_id: position for position, root_id in enumerate(root_ids)},
            value=thread.c.root_id,
            else_=len(root_ids),
        )
        reply_position = case(
            (thread.c.comment_id == thread.c.root_id, 0),
            else_=1,
        )
        result = await self.db_session.execute(
            select(CommentModel)
            .join(thread, CommentModel.id == thread.c.comment_id)
            .order_by(
                root_position,
                reply_position,
                CommentModel.created_at.asc(),
                CommentModel.id.asc(),
            )
        )
        return list(result.scalars().all())

    async def _get_lesson_content_course(
        self,
        lesson_content_id: int,
    ) -> _CourseContext | None:
        result = await self.db_session.execute(
            select(
                CourseModel.id.label("course_id"),
                CourseModel.teacher_id.label("teacher_id"),
            )
            .select_from(LessonContentModel)
            .join(LessonModel, LessonModel.id == LessonContentModel.lesson_id)
            .join(SectionModel, SectionModel.id == LessonModel.section_id)
            .join(CourseModel, CourseModel.id == SectionModel.course_id)
            .where(
                LessonContentModel.id == lesson_content_id,
                CourseModel.deleted_at.is_(None),
            )
        )
        row = result.one_or_none()
        if row is None:
            return None
        return _CourseContext(course_id=row.course_id, teacher_id=row.teacher_id)

    async def _require_course_access(
        self,
        course: _CourseContext,
        user_id: int,
    ) -> None:
        await self._require_active_user(user_id)
        if course.teacher_id == user_id:
            return
        if await self._is_admin(user_id):
            return

        enrollment_id = await self.db_session.scalar(
            select(EnrollmentModel.id)
            .where(
                EnrollmentModel.student_id == user_id,
                EnrollmentModel.course_id == course.course_id,
            )
            .limit(1)
        )
        if enrollment_id is None:
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this course",
            )

    async def _require_active_user(self, user_id: int) -> None:
        active_user_id = await self.db_session.scalar(
            select(UserModel.id)
            .where(
                UserModel.id == user_id,
                UserModel.account_status == AccountStatus.ACTIVE,
            )
            .limit(1)
        )
        if active_user_id is None:
            raise HTTPException(status_code=403, detail="User account is not active")

    async def _is_admin(self, user_id: int) -> bool:
        role_id = await self.db_session.scalar(
            select(UserRoleModel.id)
            .where(
                UserRoleModel.user_id == user_id,
                UserRoleModel.role == Role.ADMIN,
            )
            .limit(1)
        )
        return role_id is not None

    async def _is_course_moderator(
        self,
        lesson_content_id: int,
        user_id: int,
    ) -> bool:
        course = await self._get_lesson_content_course(lesson_content_id)
        if course is None:
            return False
        return course.teacher_id == user_id or await self._is_admin(user_id)

    async def _get_comment(
        self,
        comment_id: int,
        *,
        for_update: bool = False,
    ) -> CommentModel | None:
        statement = select(CommentModel).where(CommentModel.id == comment_id)
        if for_update:
            statement = statement.with_for_update()
        return await self.db_session.scalar(statement)

    @staticmethod
    def _to_comment_view(comment: CommentModel) -> CommentView:
        is_deleted = comment.deleted_at is not None
        return CommentView(
            id=comment.id,
            lesson_content_id=comment.lesson_content_id,
            user_id=comment.user_id,
            parent_id=comment.parent_id,
            content=COMMENT_TOMBSTONE if is_deleted else comment.content,
            created_at=comment.created_at,
            updated_at=comment.updated_at,
            is_deleted=is_deleted,
        )

    @classmethod
    def _to_teacher_comment_view(
        cls,
        comment: CommentModel,
        user: UserModel,
        lesson_content: LessonContentModel,
    ) -> TeacherCommentView:
        comment_view = cls._to_comment_view(comment)
        return TeacherCommentView(
            **comment_view.model_dump(),
            author=CommentAuthorView(
                id=user.id,
                full_name=user.full_name,
                avatar_url=user.avatar_url,
            ),
            lesson_content=LessonContentReferenceView(
                id=lesson_content.id,
                lesson_id=lesson_content.lesson_id,
            ),
        )
