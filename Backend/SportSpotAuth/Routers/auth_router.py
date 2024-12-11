from fastapi import APIRouter, Form, Depends
from starlette import status
from Services.Auth.SignUp.sign_up import create_user
from Services.Auth.models import UserRequestModel, UserSignUpModel, TokenModel
from sqlalchemy.ext.asyncio import AsyncSession
from Database.Async_DB_Connection import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup_user(
        username: str = Form(...),
        email: str = Form(...),
        password: str = Form(...),
        db: AsyncSession = Depends(get_db)
):
    return await create_user(UserSignUpModel(username=username, email=email, password=password), db)
