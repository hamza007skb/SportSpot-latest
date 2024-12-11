from Services.Booking.booking import book_ground
from Services.Booking.models import BookingRequestModel
from fastapi import APIRouter, Depends
from Database.Async_DB_Connection import get_db
from sqlalchemy.ext.asyncio import AsyncSession


router = APIRouter(
    prefix="/ground_booking",
    tags=["Ground Booking"]
)


@router.post("/")
async def create_ground_booking(booking: BookingRequestModel, db: AsyncSession = Depends(get_db)):
    return await book_ground(booking, db)

