
# Wiki Quiz Generator

An AI-powered full stack application that converts any Wikipedia article into a structured quiz with explanations, difficulty levels, related topics, and an optional interactive quiz mode.

This project demonstrates practical LLM integration, real-time web scraping, caching, database design, and a modern React frontend working together as a cohesive system.


## Overview

The system takes a Wikipedia URL as input and performs the following pipeline:

1.  Scrapes and cleans article content
    
2.  Uses an LLM to generate a structured quiz (8 MCQs)
    
3.  Stores quiz, metadata, and raw HTML in PostgreSQL
    
4.  Returns the quiz to the frontend for display
    
5.  Supports quiz history, caching, and an interactive “Take Quiz” mode
    

The design focuses on reliability, prompt correctness, JSON safety, caching, and separation of concerns between scraping, LLM processing, storage, and presentation.



## Features

### Core Requirements

-   Generate 5–10 MCQs (fixed to 8 for consistency)
    
-   Each question includes:
    
    -   Question text
        
    -   Four options (A–D)
        
    -   Correct answer
        
    -   Short explanation
        
    -   Difficulty level (easy, medium, hard)
        
-   Suggest related Wikipedia topics
    
-   History of previously generated quizzes
    
-   Clean, modern React UI
    

### Bonus Implemented

-   “Take Quiz” mode with scoring (separate quiz attempt)
    
-   URL validation and article title preview before processing
    
-   Raw scraped HTML stored in database
    
-   Caching to avoid duplicate scraping and LLM calls
    



## Architecture

```
Frontend (React + Tailwind)
        |
        | REST API
        v
FastAPI Backend
        |
        |----------------------|
        |                      |
   Scraper Module         LLM Module (Groq)
        |                      |
        |                      |
     Clean Data --------> Structured JSON Quiz
        |
        v
PostgreSQL (NeonDB)
``` 


## Backend Design (FastAPI)

The backend is modular and separated into clear responsibilities.

### Scraper (`scraper.py`)

-   Fetches Wikipedia HTML
    
-   Extracts title, summary, sections, and cleaned article text
    
-   Returns structured data for LLM processing
    

### LLM Module (`llm.py`)

-   Uses Groq via LangChain
    
-   Strict prompt design to force valid JSON output
    
-   Robust JSON extraction to handle model formatting issues
    
-   Always generates exactly 8 questions
    

### Routes (`routes.py`)

-   `/preview-url` → validates URL and fetches article title
    
-   `/generate-quiz` → full pipeline execution
    
-   `/history` → list of past quizzes
    
-   `/quiz/{id}` → retrieve stored quiz without calling LLM
    

### Database (PostgreSQL via SQLAlchemy)

Each quiz record stores:

-   URL
    
-   Title and summary
    
-   Generated quiz JSON
    
-   Related topics
    
-   Raw scraped HTML (for traceability)
    
-   Timestamp
    

Caching logic checks if a URL already exists before re-scraping or re-calling the LLM.



## Frontend Design (React + Tailwind v4)

The UI is built to reflect a real quiz platform rather than a demo page.

### Pages

-   **Generate Quiz**
    
    -   URL input with validation
        
    -   Article preview
        
    -   Quiz preview (answers, difficulty, explanation)
        
    -   “Take Quiz” interactive mode
        
-   **History**
    
    -   Previously generated quizzes
        
    -   Load and view past quiz content
        

### Quiz Flow

1.  User generates quiz → sees questions with answers and explanations
    
2.  User clicks “Take Quiz” → new set of questions generated
    
3.  User attempts quiz → scoring shown
    



## Prompt Engineering Strategy

The LLM prompt is designed to:

-   Force exactly 8 questions
    
-   Enforce JSON-only output
    
-   Include difficulty and explanation
    
-   Cover multiple article sections
    
-   Avoid partial or malformed responses
    

Curly brace escaping and LangChain PromptTemplate are used to avoid Python formatting errors.



## Tech Stack

```
| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | React + TypeScript + Tailwind |
| Backend  | FastAPI                       |
| LLM      | Groq (LLaMA via LangChain)    |
| Database | PostgreSQL (NeonDB)           |
| ORM      | SQLAlchemy                    |
```


## Setup Instructions

### Backend

`cd backend`
`python -m venv venv`
`venv\Scripts\activate`
`pip install -r requirements.txt`
`uvicorn main:app --reload` 

### Frontend

`cd frontend`
`npm install`
`npm run dev` 

----------

## API Endpoints

```
| Endpoint         | Method | Description                  |
| ---------------- | ------ | ---------------------------- |
| `/preview-url`   | POST   | Validate URL and fetch title |
| `/generate-quiz` | POST   | Generate and store quiz      |
| `/history`       | GET    | List past quizzes            |
| `/quiz/{id}`     | GET    | Retrieve quiz from database  |
```



## Key Engineering Decisions

-   Strict prompt to control LLM output size and format
    
-   JSON extraction logic to handle LLM variability
    
-   Caching to reduce API cost and latency
    
-   Raw HTML storage for traceability and debugging
    
-   Separation between preview quiz and interactive quiz
    
-   Tailwind v4 for rapid, modern UI styling
    

## What This Project Demonstrates

-   Real LLM integration in a production-style backend
    
-   Handling of model output inconsistencies
    
-   Clean API design
    
-   Full stack integration
    
-   UX that matches problem statement requirements
    
-   Thoughtful prompt engineering and error handling

## Sample Test Data

The sample_data/ folder contains:

- Example Wikipedia URLs tested

- Corresponding JSON API outputs captured from /generate-quiz

- Prompt templates used for quiz generation


This allows verification of system behavior without running the full stack.

## How to Test the System

- Start backend:

`uvicorn main:app --reload`

- Open Swagger:

`http://127.0.0.1:8000/docs`


- Test:

`/preview-url`

`/generate-quiz`

`/history`

`/quiz/{id}`

- Start frontend:

`npm run dev`


Use any Wikipedia URL to generate a quiz.


## Future Improvements

-   Authentication and user profiles
    
-   Quiz analytics and scoring history
    
-   Support for non-Wikipedia sources
    
-   Deployment with Docker and CI/CD