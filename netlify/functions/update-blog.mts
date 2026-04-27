import type { Config } from "@netlify/functions";

const ALLOWED_FILES = new Set([
  "blog-2026-04-27.html",
  "blog-2026-04-14.html",
  "blog-2026-03-29.html",
]);

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
    BLOG_ADMIN_CODE,
  } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !BLOG_ADMIN_CODE) {
    return Response.json(
      { error: "Missing server environment variables" },
      { status: 500 }
    );
  }

  let payload: {
    code?: string;
    file?: string;
    title?: string;
    body?: string;
  };

  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const code = String(payload.code || "");
  const file = String(payload.file || "");
  const title = String(payload.title || "").trim();
  const body = String(payload.body || "").trim();

  if (code !== BLOG_ADMIN_CODE) {
    return Response.json({ error: "Wrong admin code" }, { status: 401 });
  }

  if (!ALLOWED_FILES.has(file)) {
    return Response.json({ error: "Invalid blog file" }, { status: 400 });
  }

  if (!title || title.length > 120) {
    return Response.json({ error: "Title must be 1-120 characters" }, { status: 400 });
  }

  if (!body || body.length > 12000) {
    return Response.json({ error: "Body must be 1-12000 characters" }, { status: 400 });
  }

  const apiUrl =
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${file}`;

  const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "prayash-blog-editor",
    },
  });

  if (!getRes.ok) {
    const text = await getRes.text();
    return Response.json(
      { error: "Could not read file from GitHub", details: text },
      { status: 500 }
    );
  }

  const current = await getRes.json() as {
    sha: string;
    content: string;
    encoding: string;
  };

  const html = Buffer.from(current.content, "base64").toString("utf8");

  let updated = html;

  updated = updated.replace(
    /<h1>[\s\S]*?<\/h1>/,
    `<h1>${escapeHtml(title)}</h1>`
  );

  updated = updated.replace(
    /const text = [\s\S]*?;\s*const target = document\.getElementById\("terminal-text"\);/,
    `const text = ${JSON.stringify(body)};\n    const target = document.getElementById("terminal-text");`
  );

  if (updated === html) {
    return Response.json(
      { error: "No matching blog fields found in HTML" },
      { status: 500 }
    );
  }

  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": "prayash-blog-editor",
    },
    body: JSON.stringify({
      message: `Update blog post: ${title}`,
      content: Buffer.from(updated, "utf8").toString("base64"),
      sha: current.sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!putRes.ok) {
    const text = await putRes.text();
    return Response.json(
      { error: "Could not update GitHub file", details: text },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    message: "Blog updated. Netlify should redeploy from GitHub shortly.",
  });
};

export const config: Config = {
  path: "/api/update-blog",
  method: ["POST"],
};
