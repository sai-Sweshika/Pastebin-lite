import kv from "@/lib/kv";
import { now } from "@/lib/time";

export async function GET(req, { params }) {
  const key = `paste:${params.id}`;
  const paste = await kv.get(key);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = now(req);

  if (paste.expires_at && currentTime >= paste.expires_at) {
    await kv.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
  });
}
