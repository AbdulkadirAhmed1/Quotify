# /app/models/quote_model.py

from pydantic import BaseModel, Field
from typing import List

class QuoteModel(BaseModel):
    text: str = Field(..., min_length=1, max_length=280, description="Quote text (1-280 characters)")
    author: str = Field(..., min_length=1, max_length=100, description="Author name (1-100 characters)")
    tags: List[str] = Field(default_factory=list, description="Optional list of tags")