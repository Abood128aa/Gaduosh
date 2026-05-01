const BASE = "/api/tribute";

async function post(path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function get(path: string, adminPassword?: string) {
  const headers: Record<string, string> = {};
  if (adminPassword) headers["x-admin-password"] = adminPassword;
  const res = await fetch(`${BASE}${path}`, { headers });
  return res.json();
}

async function del(path: string, adminPassword: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { "x-admin-password": adminPassword },
  });
  return res.json();
}

async function put(path: string, body: unknown, adminPassword: string) {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-password": adminPassword },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function uploadFile(path: string, fieldName: string, file: File, adminPassword: string) {
  const form = new FormData();
  form.append(fieldName, file);
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "x-admin-password": adminPassword },
    body: form,
  });
  return res.json();
}

export const api = {
  recordVisit: () => post("/visit"),
  recordLike: () => post("/like"),
  sendMessage: (content: string) => post("/message", { content }),
  recordShare: () => post("/share"),
  getSettings: () => get("/settings"),

  verifyAdmin: (password: string) => post("/admin/verify", { password }),
  getStats: (p: string) => get("/admin/stats", p),
  getMessages: (p: string) => get("/admin/messages", p),
  deleteMessage: (id: number, p: string) => del(`/admin/messages/${id}`, p),
  updateSettings: (settings: Record<string, string>, p: string) => put("/admin/settings", settings, p),
  uploadImage: (file: File, p: string) => uploadFile("/admin/upload/image", "image", file, p),
  uploadSong: (file: File, p: string) => uploadFile("/admin/upload/song", "song", file, p),
  getVisits: (p: string) => get("/admin/visits", p),
};
