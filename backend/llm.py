import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
import json
import re

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    temperature=0.3,
)

prompt_template = PromptTemplate.from_template("""
You are an AI quiz generator.

From the given Wikipedia article, generate EXACTLY 8 multiple choice questions.

Rules:
- Each question must have 4 options.
- Provide the correct answer.
- Provide a short explanation (1–2 lines).
- Assign a difficulty level: easy, medium, or hard.
- Questions must be factually correct from the article.
- Cover different sections of the article.

Return ONLY valid JSON in this format:

{{
  "quiz": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "...",
      "difficulty": "easy",
      "explanation": "..."
    }}
  ],
  "related_topics": ["topic1", "topic2"]
}}

Article Title: {title}
Summary: {summary}
Sections: {sections}
Content:
{article_text}
""")


def extract_json(text: str):
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise Exception("No JSON object found in LLM output")
    json_str = text[start:end+1]
    return json.loads(json_str)


def generate_quiz(data: dict):
    prompt = prompt_template.format(
        title=data["title"],
        summary=data["summary"],
        sections=data["sections"],
        article_text=data["article_text"][:12000],
    )

    response = llm.invoke(prompt).content

    try:
        return extract_json(response)
    except Exception as e:
        print("LLM RAW OUTPUT:\n", response)  # for debugging
        raise Exception("LLM did not return valid JSON")