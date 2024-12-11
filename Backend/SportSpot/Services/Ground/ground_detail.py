import base64
from typing import List

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from Database.async_tables import get_ground_images_table, get_pitches_table
from .models import PitchResponseModel


async def get_ground_images(id: int, db: AsyncSession):
    ground_img = await get_ground_images_table()
    query = select(ground_img.c.image_data).where(ground_img.c.ground_id == id)
    result = await db.stream(query)

    images_base64 = []

    async for row in result:
        image_data = row[0]  # `row` is a tuple, and image_data is the first element
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        images_base64.append(image_base64)

    if not images_base64:
        raise HTTPException(status_code=404, detail="No images found for the specified ground ID")
    return JSONResponse(content={"images": images_base64})


async def get_pitches(ground_id: int, db: AsyncSession) -> List[PitchResponseModel]:
    pitch_table = await get_pitches_table()
    query = select(pitch_table).where(pitch_table.c.ground_id == int(ground_id))
    result = await db.execute(query)
    rows = result.mappings().all()
    pitches = [PitchResponseModel(**row) for row in rows]

    return pitches

