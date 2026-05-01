import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  tributeVisitsTable,
  tributeLikesTable,
  tributeMessagesTable,
  tributeSharesTable,
  tributeSettingsTable,
} from "@workspace/db/schema";
import { eq, count, desc } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin2026";

/* ─── helpers ─── */
const ip = (req: Request) =>
  (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
  req.socket.remoteAddress ??
  "unknown";

const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const pass = req.headers["x-admin-password"] as string | undefined;
  if (pass !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

/* ─── file upload ─── */
const uploadDir = path.resolve("artifacts/tribute/public/uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

/* ══════════════════════════════════════════════════════
   PUBLIC ROUTES
══════════════════════════════════════════════════════ */

/* Record a visit */
router.post("/visit", async (req: Request, res: Response) => {
  try {
    await db.insert(tributeVisitsTable).values({
      ip: ip(req),
      userAgent: req.headers["user-agent"] ?? null,
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Record a like */
router.post("/like", async (req: Request, res: Response) => {
  try {
    await db.insert(tributeLikesTable).values({ ip: ip(req) });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Save a message */
router.post("/message", async (req: Request, res: Response) => {
  const { content } = req.body as { content?: string };
  if (!content || content.trim().length < 1) {
    res.status(400).json({ error: "Message is empty" });
    return;
  }
  if (content.trim().length > 500) {
    res.status(400).json({ error: "Message too long" });
    return;
  }
  try {
    const [row] = await db
      .insert(tributeMessagesTable)
      .values({ content: content.trim(), ip: ip(req) })
      .returning();
    res.json({ ok: true, id: row?.id });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Record a share */
router.post("/share", async (req: Request, res: Response) => {
  try {
    await db.insert(tributeSharesTable).values({ ip: ip(req) });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Get public content settings */
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    const rows = await db.select().from(tributeSettingsTable);
    const settings: Record<string, string> = {};
    for (const r of rows) settings[r.key] = r.value;
    res.json(settings);
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* ══════════════════════════════════════════════════════
   ADMIN ROUTES
══════════════════════════════════════════════════════ */

/* Verify admin password */
router.post("/admin/verify", (req: Request, res: Response) => {
  const { password } = req.body as { password?: string };
  if (password === ADMIN_PASSWORD) res.json({ ok: true });
  else res.status(401).json({ error: "Wrong password" });
});

/* Get stats */
router.get("/admin/stats", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [visits] = await db.select({ c: count() }).from(tributeVisitsTable);
    const [likes] = await db.select({ c: count() }).from(tributeLikesTable);
    const [messages] = await db.select({ c: count() }).from(tributeMessagesTable);
    const [shares] = await db.select({ c: count() }).from(tributeSharesTable);
    res.json({
      visits: visits?.c ?? 0,
      likes: likes?.c ?? 0,
      messages: messages?.c ?? 0,
      shares: shares?.c ?? 0,
    });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Get messages */
router.get("/admin/messages", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(tributeMessagesTable)
      .orderBy(desc(tributeMessagesTable.createdAt));
    res.json(rows);
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Delete message */
router.delete("/admin/messages/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id ?? "0", 10);
  try {
    await db.delete(tributeMessagesTable).where(eq(tributeMessagesTable.id, id));
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Update settings */
router.put("/admin/settings", requireAdmin, async (req: Request, res: Response) => {
  const updates = req.body as Record<string, string>;
  try {
    for (const [key, value] of Object.entries(updates)) {
      if (typeof value !== "string") continue;
      await db
        .insert(tributeSettingsTable)
        .values({ key, value })
        .onConflictDoUpdate({
          target: tributeSettingsTable.key,
          set: { value, updatedAt: new Date() },
        });
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

/* Upload image */
router.post(
  "/admin/upload/image",
  requireAdmin,
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) { res.status(400).json({ error: "No file" }); return; }
    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url });
  }
);

/* Upload song */
router.post(
  "/admin/upload/song",
  requireAdmin,
  upload.single("song"),
  (req: Request, res: Response) => {
    if (!req.file) { res.status(400).json({ error: "No file" }); return; }
    const url = `/uploads/${req.file.filename}`;
    res.json({ ok: true, url });
  }
);

/* Get recent visits (last 20) */
router.get("/admin/visits", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(tributeVisitsTable)
      .orderBy(desc(tributeVisitsTable.createdAt))
      .limit(20);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "DB error" });
  }
});

export default router;
