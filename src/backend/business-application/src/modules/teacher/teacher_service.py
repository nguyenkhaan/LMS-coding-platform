from sqlalchemy.ext.asyncio import AsyncSession

class TeacherService: 
    def __init__(self, db_session: AsyncSession): 
        self.db_session = db_session 
    