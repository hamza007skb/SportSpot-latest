from pydantic import BaseModel
from datetime import datetime


class GroundResponseModel(BaseModel):
    id: int
    name: str
    phone_no: str
    latitude: str
    longitude: str
    city: str
    address: str
    description: str
    rating: float
    verified_by: str
    created_at: datetime
    country: str


class PitchResponseModel(BaseModel):
    ground_id: int
    name: str
    description: str
    length: str
    width: str
    price_per_60mins: str
    price_per_90mins: str
    created_at: datetime