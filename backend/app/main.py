from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.quotes import router as quotes_router

app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(quotes_router)

@app.get("/")
async def root():
    return {"message": "Quotify API is running"}
