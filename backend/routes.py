from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from db import SessionLocal
from models import Article, Quiz
from schemas import URLRequest
from scraper import scrape_wikipedia
from llm import generate_quiz

router = APIRouter()


# database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# test scraper
@router.get("/test-scrape")
def test_scrape():
    data = scrape_wikipedia("https://en.wikipedia.org/wiki/Alan_Turing")
    return {
        "title": data["title"],
        "summary": data["summary"],
        "sections": data["sections"][:5],
    }


# test LLM
@router.get("/test-llm")
def test_llm():
    data = scrape_wikipedia("https://en.wikipedia.org/wiki/Alan_Turing")
    result = generate_quiz(data)
    return result


# generate quiz
@router.post("/generate-quiz")
def generate_quiz_api(payload: URLRequest, db: Session = Depends(get_db)):
    url = payload.url

    # check cache first
    existing_article = db.query(Article).filter(Article.url == url).first()
    if existing_article:
        existing_quiz = (
            db.query(Quiz)
            .filter(Quiz.article_id == existing_article.id)
            .first()
        )

        return {
            "id": existing_article.id,
            "url": existing_article.url,
            "title": existing_article.title,
            "summary": existing_article.summary,
            "sections": existing_article.sections,
            "quiz": existing_quiz.quiz_json,
            "related_topics": existing_article.related_topics,
        }

    scraped = scrape_wikipedia(url)
    llm_output = generate_quiz(scraped)

    article = Article(
        url=url,
        title=scraped["title"],
        summary=scraped["summary"],
        raw_html=scraped["raw_html"],
        sections=scraped["sections"],
        related_topics=llm_output["related_topics"],
    )
    db.add(article)
    db.commit()
    db.refresh(article)

    quiz = Quiz(
        article_id=article.id,
        quiz_json=llm_output["quiz"],
    )
    db.add(quiz)
    db.commit()

    return {
        "id": article.id,
        "url": article.url,
        "title": article.title,
        "summary": article.summary,
        "sections": article.sections,
        "quiz": llm_output["quiz"],
        "related_topics": article.related_topics,
    }

@router.post("/preview-url")
def preview_url(body: dict):
    data = scrape_wikipedia(body["url"])
    return {"title": data["title"]}

# history
@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    articles = db.query(Article).order_by(Article.created_at.desc()).all()

    return [
        {
            "id": article.id,
            "url": article.url,
            "title": article.title,
            "created_at": article.created_at,
        }
        for article in articles
    ]


# quiz details (modal)
@router.get("/quiz/{article_id}")
def get_quiz_details(article_id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    quiz = db.query(Quiz).filter(Quiz.article_id == article_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "id": article.id,
        "url": article.url,
        "title": article.title,
        "summary": article.summary,
        "sections": article.sections,
        "quiz": quiz.quiz_json,
        "related_topics": article.related_topics,
    }
