from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from db import Base


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, nullable=False)
    title = Column(String)
    summary = Column(Text)
    raw_html = Column(Text)
    sections = Column(JSON)
    key_entities = Column(JSON)
    related_topics = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("articles.id"))
    quiz_json = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
