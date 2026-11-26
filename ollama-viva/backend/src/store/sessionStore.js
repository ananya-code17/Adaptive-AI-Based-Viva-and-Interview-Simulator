const sessions = new Map();

export function createSession(data) {
  const id = crypto.randomUUID();
  const session = {
    id,
    topic: data.topic,
    category: data.category || "Viva",
    preferredDifficulty: data.difficulty || "easy",
    totalQuestions: Math.min(Math.max(Number(data.numberOfQuestions) || 5, 1), 20),
    currentDifficulty: "easy",
    questions: [],
    completed: false,
    createdAt: new Date().toISOString()
  };
  sessions.set(id, session);
  return session;
}

export function getSession(id) {
  return sessions.get(id);
}

export function saveSession(session) {
  sessions.set(session.id, session);
  return session;
}
