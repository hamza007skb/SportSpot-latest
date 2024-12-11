from .Async_DB_Connection import async_engine, metadata
from sqlalchemy import Table


async def get_grounds_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('grounds', metadata, autoload_with=connection)


async def get_ground_images_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('groundimages', metadata, autoload_with=connection)


async def get_bookings_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('bookings', metadata, autoload_with=connection)

async def get_users_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('users', metadata, autoload_with=connection)


async def get_pitches_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('pitches', metadata, autoload_with=connection)


async def get_user_reviews_table():
    async with async_engine.connect() as connection:
        await connection.run_sync(metadata.reflect)
        return Table('userreviews', metadata, autoload_with=connection)
