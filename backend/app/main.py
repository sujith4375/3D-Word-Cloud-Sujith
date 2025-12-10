from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import httpx
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import TfidfVectorizer
import re

app = FastAPI(title="3D Word Cloud API")


class AnalyzeRequest(BaseModel):
    url: str


class WordItem(BaseModel):
    word: str
    weight: float


class AnalyzeResponse(BaseModel):
    words: List[WordItem]


async def fetch_article_text(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch URL")
    except httpx.RequestError:
        raise HTTPException(status_code=400, detail="Error fetching URL")

    soup = BeautifulSoup(resp.text, "html.parser")
    # Simple heuristic: join all paragraph text
    paragraphs = [p.get_text(separator=" ", strip=True) for p in soup.find_all("p")]
    text = " ".join(paragraphs)
    # Basic cleanup
    text = re.sub(r"\s+", " ", text)
    if not text or len(text.split()) < 50:
        raise HTTPException(status_code=400, detail="Not enough text found in article")
    return text


def extract_keywords_tfidf(text: str, top_k: int = 60) -> List[WordItem]:
    # Treat the whole article as a single document
    docs = [text]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=2000,
        ngram_range=(1, 2),
    )
    tfidf_matrix = vectorizer.fit_transform(docs)
    feature_names = vectorizer.get_feature_names_out()
    scores = tfidf_matrix.toarray()[0]

    # Take top_k tokens
    indexed_scores = list(enumerate(scores))
    indexed_scores.sort(key=lambda x: x[1], reverse=True)
    top_items = indexed_scores[:top_k]

    # Normalize weights between 0.2 and 1.0 for visualization
    if not top_items:
        return []

    max_score = top_items[0][1] or 1.0
    words: List[WordItem] = []
    for idx, score in top_items:
        token = feature_names[idx]
        norm_weight = 0.2 + 0.8 * (score / max_score)
        words.append(WordItem(word=token, weight=float(norm_weight)))
    return words


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    text = await fetch_article_text(request.url)
    words = extract_keywords_tfidf(text)
    if not words:
        raise HTTPException(status_code=400, detail="Could not extract keywords")
    return AnalyzeResponse(words=words)
