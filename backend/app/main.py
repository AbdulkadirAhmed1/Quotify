# /app/main.py

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from app.api.quotes import router as quotes_router
from starlette.exceptions import HTTPException as StarletteHTTPException

# 🌱 Load environment variables
from dotenv import load_dotenv
import os

load_dotenv()  # Render won't use this, but local dev will
mongo_url = os.getenv("MONGO_URI")

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": "Invalid input", "details": exc.errors()}
    )

# Global HTTPException Handler
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": str(exc.detail)}
    )

# Routes
app.include_router(quotes_router)

@app.get("/")
async def root():
    return {"success": True, "message": "Quotify API is running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}