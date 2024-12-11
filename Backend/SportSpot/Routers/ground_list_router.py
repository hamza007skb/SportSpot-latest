from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from Database.Async_DB_Connection import get_db
from Services.Ground.ground_list import get_ground_list, get_img_by_groundID, search_grounds_by_game, general_search
from Services.Ground.ground_detail import get_ground_images, get_pitches
from Services.Ground.models import GroundResponseModel, PitchResponseModel

router = APIRouter(
    prefix="/ground_list",
    tags=["ground_list"],
)


@router.get("/", response_model=List[GroundResponseModel])
async def read_ground_list(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)) -> List[GroundResponseModel]:
    return await get_ground_list(skip=skip, limit=limit, db=db)


@router.get("/groundimages/{images_id}")
async def get_images(images_id: int, db: AsyncSession = Depends(get_db)):
    try:
        images_id = int(images_id)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid ID format")
    return await get_ground_images(id=images_id, db=db)


@router.get("/ground_img_by_id/{image_id}")
async def get_image_by_id(image_id: int = 17, db: AsyncSession = Depends(get_db)):
    return await get_img_by_groundID(groundID=image_id, db=db)


@router.get("/ground_detail/pitches/{ground_id}", response_model=List[PitchResponseModel])
async def get_ground_pitches(ground_id, db: AsyncSession = Depends(get_db)):
    return await get_pitches(ground_id=ground_id, db=db)


@router.get("/search_grounds_by_game/{game_type}", response_model=List[GroundResponseModel])
async def get_searched_grounds(game_type: str, db: AsyncSession = Depends(get_db)):
    return await search_grounds_by_game(pitch_game=game_type, db=db)


@router.get("/search_grounds/{keywords}", response_model=List[GroundResponseModel])
async def search_grounds(keywords: str, db: AsyncSession = Depends(get_db)):
    keyword_list = keywords.lower().split(' ')
    return await general_search(keywords=keyword_list, db=db)