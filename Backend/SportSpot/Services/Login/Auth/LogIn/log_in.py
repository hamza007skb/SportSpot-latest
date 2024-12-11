from fastapi import HTTPException
from Encryption.bcrypt_context import bcrypt_context
from starlette import status
from Database.async_tables import get_users_table
from datetime import timedelta
from Services.Login.Auth.auth import create_access_token
from Services.Login.Auth.auth_credentials import ACCESS_TOKEN_EXPIRE
from Services.Login.Auth.models import UserRequestModel, TokenModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select


async def login_user(user_request: UserRequestModel, db: AsyncSession) -> TokenModel:
    try:
        users_table = await get_users_table()
        query = select(users_table).where(users_table.c.email == user_request.email)
        result = await db.execute(query)
        user = result.fetchone()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No user registered with this email",
            )
        if not bcrypt_context.verify(user_request.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password",
            )

        access_token = create_access_token(
            data={"email": user.email},
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE)
        )
        return TokenModel(
            access_token=access_token,
            token_type="Bearer",
            message="Logged in successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )
