
from fastapi import HTTPException
from sqlalchemy import delete, exc, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.problem_config_model import ProblemConfigModel
from src.models.problem_model import ProblemModel
from src.models.problem_tag_mapping_model import ProblemTagMappingModel
from src.models.problem_tag_model import ProblemTagModel
from src.modules.teacher.teacher_problem.teacher_problem_dto import (
    ProblemTagView,
    ProblemView,
    ProblemWrite,
    TestcaseUploadResponse,
    TestcaseView,
)


class TeacherProblemService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_problem_tags(self) -> list[ProblemTagView]:
        stmt = select(ProblemTagModel).order_by(ProblemTagModel.tag_name)
        result = await self.db.execute(stmt)
        tags = result.scalars().all()
        return [ProblemTagView.model_validate(t) for t in tags]

    async def _validate_tag_ids(self, tag_ids: list[int]) -> None:
        if tag_ids:
            stmt = select(ProblemTagModel.id).where(ProblemTagModel.id.in_(tag_ids))
            result = await self.db.execute(stmt)
            existing_tag_ids = result.scalars().all()
            if len(existing_tag_ids) != len(set(tag_ids)):
                raise HTTPException(status_code=400, detail="One or more tag_ids are invalid")

    async def create_problem(self, teacher_id: int, data: ProblemWrite) -> ProblemView:
        await self._validate_tag_ids(data.tag_ids)

        new_problem = ProblemModel(
            teacher_id=teacher_id,
            title=data.title,
            slug=data.slug,
            statement=data.statement,
            sample_input=data.sample_input,
            sample_output=data.sample_output,
            explanation=data.explanation,
            difficulty=data.difficulty,
            passing_score=data.passing_score,
            public=data.public
        )
        self.db.add(new_problem)
        try:
            await self.db.flush()
        except exc.IntegrityError:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail="Slug already exists")

        for t_id in set(data.tag_ids):
            self.db.add(ProblemTagMappingModel(problem_id=new_problem.id, tag_id=t_id))
            
        for conf in data.configs:
            self.db.add(ProblemConfigModel(
                problem_id=new_problem.id,
                language_id=conf.language_id,
                time_limit_ms=conf.time_limit_ms,
                memory_limit_mb=conf.memory_limit_mb
            ))

        await self.db.commit()
        await self.db.refresh(new_problem)
        return ProblemView.model_validate(new_problem)

    async def update_problem(self, teacher_id: int, problem_id: int, data: ProblemWrite) -> ProblemView:
        # Check problem existence and ownership
        stmt = select(ProblemModel).where(ProblemModel.id == problem_id)
        result = await self.db.execute(stmt)
        problem = result.scalar_one_or_none()
        
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
        if problem.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="You do not have permission to modify this problem")

        await self._validate_tag_ids(data.tag_ids)

        # Update problem fields
        problem.title = data.title
        problem.slug = data.slug
        problem.statement = data.statement
        problem.sample_input = data.sample_input
        problem.sample_output = data.sample_output
        problem.explanation = data.explanation
        problem.difficulty = data.difficulty
        problem.passing_score = data.passing_score
        problem.public = data.public

        try:
            await self.db.flush()
        except exc.IntegrityError:
            await self.db.rollback()
            raise HTTPException(status_code=400, detail="Slug already exists")

                # Update tags: replace all mapping
        stmt_del_tags = delete(ProblemTagMappingModel).where(ProblemTagMappingModel.problem_id == problem.id)
        await self.db.execute(stmt_del_tags)
        
        for t_id in set(data.tag_ids):
            self.db.add(ProblemTagMappingModel(problem_id=problem.id, tag_id=t_id))

        # Update configs: upsert by language_id to preserve ID
        # Note: PUT full-replace semantics - client must send all existing configs. Any omitted languages will be deleted.
        stmt_get_configs = select(ProblemConfigModel).where(ProblemConfigModel.problem_id == problem.id)
        result_configs = await self.db.execute(stmt_get_configs)
        existing_configs = result_configs.scalars().all()
        
        existing_config_map = {c.language_id: c for c in existing_configs}
        new_config_map = {c.language_id: c for c in data.configs}
        
        for lang_id, new_conf in new_config_map.items():
            if lang_id in existing_config_map:
                existing_conf = existing_config_map[lang_id]
                existing_conf.time_limit_ms = new_conf.time_limit_ms
                existing_conf.memory_limit_mb = new_conf.memory_limit_mb
            else:
                self.db.add(ProblemConfigModel(
                    problem_id=problem.id,
                    language_id=lang_id,
                    time_limit_ms=new_conf.time_limit_ms,
                    memory_limit_mb=new_conf.memory_limit_mb
                ))
                
        for lang_id, existing_conf in existing_config_map.items():
            if lang_id not in new_config_map:
                await self.db.delete(existing_conf)

        await self.db.commit()
        await self.db.refresh(problem)
        return ProblemView.model_validate(problem)

    async def upload_testcase(self, teacher_id: int, problem_id: int, input_file: str, output_file: str, score: float, is_hidden: bool) -> TestcaseUploadResponse:
        # Check problem existence and ownership
        stmt = select(ProblemModel).where(ProblemModel.id == problem_id)
        result = await self.db.execute(stmt)
        problem = result.scalar_one_or_none()
        
        if not problem:
            raise HTTPException(status_code=404, detail="Problem not found")
        if problem.teacher_id != teacher_id:
            raise HTTPException(status_code=403, detail="You do not have permission to modify this problem")

        from src.models.testcase_model import TestcaseModel

        new_tc = TestcaseModel(
            problem_id=problem.id,
            input_file=input_file,
            output_file=output_file,
            score=score,
            is_hidden=is_hidden
        )
        self.db.add(new_tc)
        await self.db.commit()
        await self.db.refresh(new_tc)
        
        return TestcaseUploadResponse(
            uploaded_count=1,
            message="Testcase uploaded successfully",
            testcases=[TestcaseView.model_validate(new_tc)]
        )
