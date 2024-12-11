from fastapi import HTTPException
from starlette import status
from Encryption.bcrypt_context import bcrypt_context
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from Database.async_tables import get_users_table
from Services.Auth.models import UserSignUpModel
from sqlalchemy import select


async def create_user(user: UserSignUpModel, db: AsyncSession) -> dict:
    try:
        users_table = await get_users_table()
        query = select(users_table).where(
            (users_table.c.email == user.email) |
            (users_table.c.username == user.username)
        )
        result = await db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email or username already exists."
            )

        hashed_password = bcrypt_context.hash(user.password)
        insert_stmt = users_table.insert().values(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password
        )
        await db.execute(insert_stmt)
        await db.commit()

        return {"message": "User created successfully"}
    except SQLAlchemyError as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error occurred while creating the user."
        )
