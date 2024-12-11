from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from Services.Login.Auth.LogIn.log_in import login_user
from Services.Login.Auth.auth import get_current_user
from Services.Login.Auth.models import UserRequestModel, TokenModel
from sqlalchemy.ext.asyncio import AsyncSession
from Database.Async_DB_Connection import get_db

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/login", response_model=TokenModel)
async def login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(get_db)
):
    return await login_user(UserRequestModel(email=form_data.username, password=form_data.password), db)


@router.post("/me", response_model=TokenModel)
async def get_profile(current_user: str = Depends(get_current_user)):
    return {"user": current_user}
