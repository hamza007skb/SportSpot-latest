from fastapi import FastAPI
from Routers import ground_list_router, ground_booking_router, auth_router, review_router
from Database.Async_DB_Connection import init_async_db
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(on_startup=[init_async_db])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ground_list_router.router)
app.include_router(ground_booking_router.router)
app.include_router(auth_router.router)
app.include_router(review_router.router)




