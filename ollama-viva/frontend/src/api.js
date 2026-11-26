const API = "http://localhost:5000/api";

async function request(url, options = {}) {
  const response = await fetch(API + url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export const startSession = data =>
  request("/sessions/start", { method: "POST", body: JSON.stringify(data) });

export const submitAnswer = (id, answer) =>
  request(`/sessions/${id}/answer`, {
    method: "POST",
    body: JSON.stringify({ answer })
  });
