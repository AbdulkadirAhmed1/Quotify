# /app/models/quote_model.py

from pydantic import BaseModel, Field

class QuoteModel(BaseModel):
    text: str = Field(..., min_length=1, description="The quote text")
    author: str = Field(..., min_length=1, description="The author name")