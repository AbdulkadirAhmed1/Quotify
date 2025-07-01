#/backend/app/models/quote_model.py
from pydantic import BaseModel

class QuoteModel(BaseModel):
    text: str
    author: str
