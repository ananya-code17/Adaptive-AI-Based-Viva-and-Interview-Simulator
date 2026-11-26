# Adaptive AI-Based Viva and Interview Simulator

An AI-powered web application that helps students prepare for technical vivas and interviews through personalized questions, automated answer evaluation, and adaptive difficulty adjustment.

## Overview

Traditional interview preparation often lacks personalized feedback and adaptive practice. This project provides a centralized platform where students can practice technical questions, evaluate their answers, and identify areas for improvement.

The application uses a locally hosted LLaMA model to generate questions and expected key points based on the user's selected topic, interview category, and difficulty level.

## Key Features

- **AI Question Generation:** Generates topic-specific technical viva and interview questions.
- **Personalized Practice:** Allows users to select topics, interview categories, difficulty levels, and the number of questions.
- **Automated Answer Evaluation:** Evaluates submitted answers using keyword-based matching against expected key points.
- **Adaptive Difficulty:** Adjusts the difficulty of subsequent questions based on user performance.
- **Performance Reports:** Displays average scores, grades, strengths, weaknesses, and recommended revision topics.
- **Local AI Integration:** Uses Ollama to run the LLaMA 3.2 model locally.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | React.js, Vite, HTML, CSS, JavaScript |
| Backend | Node.js, Express.js, REST APIs |
| AI Model | LLaMA 3.2 (1B model configuration) |
| AI Runtime | Ollama |
| Evaluation | JavaScript-based keyword matching |
| Session Management | JavaScript Map |

## System Architecture

The application follows a frontend-backend architecture with local AI model integration.

1. The React frontend collects user preferences and displays questions and reports.
2. The Node.js and Express.js backend manages practice sessions and API requests.
3. Ollama runs the LLaMA model to generate questions and expected key points.
4. The evaluation module compares user answers with expected key points and calculates scores.
5. The adaptive difficulty engine adjusts the next question based on performance.
6. The final report summarizes the user's performance and revision requirements.

## Workflow

```text
User Input
    ↓
Question Generation using LLaMA
    ↓
Answer Submission
    ↓
Answer Evaluation and Scoring
    ↓
Adaptive Difficulty Adjustment
    ↓
Next Question
    ↓
Final Performance Report
```

## Project Setup

### Prerequisites

- Node.js and npm
- Ollama
- LLaMA 3.2 model
- Git

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd <your-project-folder>
```

### 2. Set Up Ollama

Install Ollama from [ollama.com](https://ollama.com).

Download the LLaMA 3.2 model:

```bash
ollama pull llama3.2:1b
```

Start the Ollama service:

```bash
ollama serve
```

The default local Ollama API endpoint is:

```text
http://localhost:11434
```

### 3. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
npm run dev
```

The backend API runs at:

```text
http://localhost:5000
```

### 4. Set Up the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

> Note: The commands above assume separate `frontend` and `backend` directories with the corresponding npm scripts. Adjust the directory names and startup commands to match your repository's actual structure.

## API Integration

The application uses REST APIs to connect the frontend with the backend.

| Service | Local Endpoint |
|---|---|
| Frontend | Vite development server |
| Backend | `http://localhost:5000/api` |
| Ollama | `http://localhost:11434/v1` |

The backend communicates with Ollama to generate questions and expected key points.

## Project Outcomes

- Automated generation of technical viva questions.
- Structured interview practice in a single application.
- Performance-based question difficulty adjustment.
- Automated scoring and final performance reports.
- Local AI model integration using Ollama.

## Future Enhancements

- LLM-based semantic answer evaluation.
- Personalized follow-up questions.
- Database integration for long-term progress tracking.
- Voice-based interviews and speech recognition.
- Detailed topic-wise performance analytics.

## Author

**Ananya Joshi**

B.Tech Computer Science Engineering – Data Science

UPES, Dehradun
