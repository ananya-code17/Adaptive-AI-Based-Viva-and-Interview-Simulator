# Adaptive AI Viva & Interview Simulator — Ollama Edition

This version runs the LLM locally with Ollama. No OpenAI API key or API credits are required. Ollama exposes an OpenAI-compatible local endpoint at `http://localhost:11434/v1`.

## 1. Install Ollama
Download Ollama from https://ollama.com/download and install it.

## 2. Download a model
Open PowerShell/VS Code terminal and run:

```bash
ollama pull llama3.2
```

Then verify:

```bash
ollama list
```

## 3. Backend

```bash
cd backend
npm install
npm run dev
```

Expected:
`Backend running at http://localhost:5000`

## 4. Frontend
Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Notes
- `.env` contains only Ollama settings; no secret API key is needed.
- Ollama must be running while the app is used.
- The model is stored on your computer and inference happens locally.
- If `llama3.2` is too slow, use a smaller model available in your Ollama installation and change `OLLAMA_MODEL` accordingly.
