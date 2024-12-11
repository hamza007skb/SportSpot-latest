import base64
from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import JSONResponse
from .models import GroundResponseModel
from Database.async_tables import get_grounds_table, get_ground_images_table, get_pitches_table
from sqlalchemy import select, or_, and_, func


async def get_ground_list(skip: int, limit: int, db: AsyncSession) -> List[GroundResponseModel]:
    # Fetch the grounds table
    grounds_table = await get_grounds_table()
    query = select(grounds_table).offset(skip).limit(limit)
    result = await db.execute(query)
    rows = result.mappings().all()
    grounds = [GroundResponseModel(**row) for row in rows]

    return grounds


async def search_grounds_by_game(pitch_game: str, db: AsyncSession) -> List[GroundResponseModel]:
    pitches_table = await get_pitches_table()
    grounds_table = await get_grounds_table()
    query = (
        select(grounds_table, pitches_table)
        .join(pitches_table,
              (pitches_table.c.ground_id == grounds_table.c.id) & pitches_table.c.game_type.like(pitch_game))
    )
    result = await db.execute(query)
    rows = result.mappings().all()
    grounds = [GroundResponseModel(**row) for row in rows]

    return grounds


async def general_search(keywords: List[str], db: AsyncSession) -> List[GroundResponseModel]:
    grounds_table = await get_grounds_table()
    conditions = [
        or_(
            func.lower(grounds_table.c.name).like(f'%{keyword}%'),
            func.lower(grounds_table.c.address).like(f'%{keyword}%'),
            func.lower(grounds_table.c.country).like(f'%{keyword}%'),
            func.lower(grounds_table.c.city).like(f'%{keyword}%'),
            func.lower(grounds_table.c.description).like(f'%{keyword}%')
        ) for keyword in keywords
    ]
    query = select(grounds_table).where(*conditions)
    result = await db.execute(query)
    rows = result.mappings().all()
    grounds = [GroundResponseModel(**row) for row in rows]

    return grounds


async def get_img_by_groundID(groundID: int, db: AsyncSession):
    ground_imgs = await get_ground_images_table()
    query = select(ground_imgs.c.image_data).where(ground_imgs.c.ground_id == groundID).limit(1)
    result = await db.execute(query)
    row = result.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="No image found for the specified ground ID")

    image_data = row[0]
    image_base64 = base64.b64encode(image_data).decode('utf-8')

    return JSONResponse(content={"image": image_base64})
