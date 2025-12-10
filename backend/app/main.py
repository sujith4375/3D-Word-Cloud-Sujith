from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="3D Word Cloud API")


class AnalyzeRequest(BaseModel):
    url: str


class WordItem(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    words: List[WordItem]


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    # Temporary stub
    dummy_words = [
        {"word": "example", "weight": 1.0},
        {"word": "word", "weight": 0.8},
        {"word": "cloud", "weight": 0.6},
    ]
    return {"words": dummy_words}
