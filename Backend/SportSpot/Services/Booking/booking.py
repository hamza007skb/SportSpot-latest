from datetime import datetime

from .models import BookingRequestModel
from Database.async_tables import get_bookings_table
from fastapi import HTTPException
from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession


async def book_ground(booking: BookingRequestModel, db: AsyncSession):
    start_time_naive = booking.start_time.replace(tzinfo=None)
    booking_date_str = booking.booking_date  # Assuming this is the source
    booking_date = datetime.strptime(booking_date_str, "%d-%m-%y").date()

    bookings = await get_bookings_table()
    query = select(bookings).where(
        bookings.c.pitch_name == booking.pitch_name,
        bookings.c.start_time == booking.start_time
    )
    result = await db.execute(query)
    if result.scalar():
        raise HTTPException(
            status_code=400, detail="Pitch already booked"
        )
    insert_statement = insert(bookings).values(
        pitch_name=booking.pitch_name,
        ground_id=booking.ground_id,
        user_email=booking.user_email,
        user_contact_no=booking.user_contact_no,
        start_time=start_time_naive,
        duration=booking.duration,
        payment_status=booking.payment_status,
        booking_date=booking_date,
    )
    await db.execute(insert_statement)
    await db.commit()

    return {"status": "booked"}
