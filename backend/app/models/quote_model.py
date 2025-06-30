from pydantic import BaseModel

class QuoteModel(BaseModel):
    text: str
    author: str
