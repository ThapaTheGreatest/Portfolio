import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

const STORE_NAME = "zetamac-leaderboard";
const SCORES_KEY = "top-scores";
const MAX_SCORES = 10;

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export default async (req: Request) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    const scores = (await store.get(SCORES_KEY, { type: "json" })) as ScoreEntry[] | null;
    return Response.json(scores || []);
  }

  if (req.method === "POST") {
    const { name, score } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length === 0 || name.trim().length > 20) {
      return Response.json({ error: "Name must be 1-20 characters" }, { status: 400 });
    }
    if (typeof score !== "number" || !Number.isInteger(score)) {
      return Response.json({ error: "Invalid score" }, { status: 400 });
    }

    const existing = (await store.get(SCORES_KEY, { type: "json" })) as ScoreEntry[] | null;
    const scores: ScoreEntry[] = existing || [];

    scores.push({
      name: name.trim(),
      score,
      date: new Date().toISOString(),
    });

    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, MAX_SCORES);

    await store.setJSON(SCORES_KEY, topScores);

    return Response.json(topScores);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = {
  path: "/api/leaderboard",
  method: ["GET", "POST"],
};
