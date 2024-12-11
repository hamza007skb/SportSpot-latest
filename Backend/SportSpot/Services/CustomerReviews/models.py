from pydantic import BaseModel
from typing import Optional


class UserReviewModel(BaseModel):
    user_id: str
    rating: float
    ground: int
    comment: str

