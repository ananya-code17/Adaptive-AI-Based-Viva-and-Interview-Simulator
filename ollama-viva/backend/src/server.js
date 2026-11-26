import "dotenv/config";
import express from "express";
import cors from "cors";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Adaptive AI Viva & Interview Simulator API" });
});

app.use("/api/sessions", sessionRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
