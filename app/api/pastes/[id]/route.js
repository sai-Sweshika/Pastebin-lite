import { nanoid } from "nanoid";
import kv from "../../../lib/kv";
import { now } from "../../../lib/time";

export async function POST(req) {
  try {
    const body = await req.json();
    const { content, ttl_seconds, max_views } = body;

    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return Response.json({ error: "Invalid max_views" }, { status: 400 });
    }

    const id = nanoid(8);
    const createdAt = now(req);

    const paste = {
      content,
      created_at: createdAt,
      expires_at: ttl_seconds ? createdAt + ttl_seconds * 1000 : null,
      max_views: max_views ?? null,
      views: 0
    };

    await kv.set(`paste:${id}`, paste);

    return Response.json({
      id,
      url: `http://localhost:3000/p/${id}`
    });

  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json(
      { error: "Internal server error (KV not configured?)" },
      { status: 500 }
    );
  }
}
