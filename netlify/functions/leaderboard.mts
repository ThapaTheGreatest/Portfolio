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

function dedupeScores(scores: ScoreEntry[]): ScoreEntry[] {
  const merged = new Map<string, ScoreEntry>();

  for (const entry of scores) {
    const key = entry.name.trim().toLowerCase();
    const existing = merged.get(key);

    if (
      !existing ||
      entry.score > existing.score ||
      (entry.score === existing.score && entry.date > existing.date)
    ) {
      merged.set(key, {
        name: entry.name.trim(),
        score: entry.score,
        date: entry.date,
      });
    }
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_SCORES);
}

export default async (req: Request) => {
  const store = getStore({ name: STORE_NAME, consistency: "strong" });

  if (req.method === "GET") {
    const existing = (await store.get(SCORES_KEY, {
      type: "json",
    })) as ScoreEntry[] | null;

    const scores = dedupeScores(existing || []);

    await store.setJSON(SCORES_KEY, scores);

    return Response.json(scores);
  }

  if (req.method === "POST") {
    const { name, score } = await req.json();

    const cleanName = typeof name === "string" ? name.trim() : "";

    if (!cleanName || cleanName.length > 20) {
      return Response.json(
        { error: "Name must be 1-20 characters" },
        { status: 400 }
      );
    }

    if (typeof score !== "number" || !Number.isInteger(score)) {
      return Response.json({ error: "Invalid score" }, { status: 400 });
    }

    const existing = (await store.get(SCORES_KEY, {
      type: "json",
    })) as ScoreEntry[] | null;

    const scores: ScoreEntry[] = existing || [];

    scores.push({
      name: cleanName,
      score,
      date: new Date().toISOString(),
    });

    const topScores = dedupeScores(scores);

    await store.setJSON(SCORES_KEY, topScores);

    return Response.json(topScores);
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config: Config = {
  path: "/api/leaderboard",
  method: ["GET", "POST"],
};
