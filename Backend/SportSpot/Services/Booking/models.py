from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import Literal


class BookingRequestModel(BaseModel):
    pitch_name: str
    ground_id: int
    user_email: str
    user_contact_no: str
    start_time: datetime
    booking_date: str
    duration: timedelta
    payment_status: Literal['pending', 'paid'] = 'pending'
