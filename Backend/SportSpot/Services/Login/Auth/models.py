from pydantic import BaseModel


class UserRequestModel(BaseModel):
    email: str
    password: str


class TokenModel(BaseModel):
    access_token: str
    token_type: str
    message: str

