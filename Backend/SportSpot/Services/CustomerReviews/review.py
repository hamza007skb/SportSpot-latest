from fastapi import HTTPException
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from .models import UserReviewModel
from Database.async_tables import get_user_reviews_table


async def post_user_review(review: UserReviewModel, db: AsyncSession):
    user_reviews = await get_user_reviews_table()
    query = select(user_reviews).where(
        user_reviews.c.user_id == review.user_id,
        user_reviews.c.ground_id == review.ground
    )
    result = await db.execute(query)
    if result.scalar():
        raise HTTPException(
            status_code=400, detail="User has already reviewed this ground"
        )

    # Insert the new review into the table
    insert_statement = insert(user_reviews).values(
        user_id=review.user_id,
        rating=review.rating,
        ground_id=review.ground,
        comment=review.comment,
    )
    await db.execute(insert_statement)
    await db.commit()

    return {"status": "Review added successfully"}


async def get_reviews_by_ground(ground_id: int, db: AsyncSession):
    user_reviews = await get_user_reviews_table()

    # Query to fetch reviews for the specified ground_id
    query = select(user_reviews).where(user_reviews.c.ground_id == ground_id)
    result = await db.execute(query)
    reviews = result.fetchall()

    # If no reviews are found, raise a 404 error
    if not reviews:
        raise HTTPException(status_code=404, detail=f"No reviews found for ground ID {ground_id}")

    # Format and return the results
    return [
        {
            "user_id": review.user_id,
            "rating": review.rating,
            "ground_id": review.ground_id,
            "comment": review.comment,
        }
        for review in reviews
    ]
