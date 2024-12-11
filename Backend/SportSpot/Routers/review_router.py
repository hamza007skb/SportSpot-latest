from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from Database.Async_DB_Connection import get_db
from Services.CustomerReviews.models import UserReviewModel
from Services.CustomerReviews.review import post_user_review, get_reviews_by_ground

router = APIRouter(
    prefix="/review",
    tags=["Review"],
)


@router.post('/post_review')
async def create_review(review: UserReviewModel, db: AsyncSession = Depends(get_db)):
    return await post_user_review(review=review, db=db)


@router.get('/get_reviews/{id}')
async def get_reviews(id: int, db: AsyncSession = Depends(get_db)):
    return await get_reviews_by_ground(ground_id=id, db=db)
