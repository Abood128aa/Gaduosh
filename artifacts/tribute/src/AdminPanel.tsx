import { useState, useEffect, useCallback } from "react";
import { api } from "./api";

interface Stats { visits: number; likes: number; messages: number; shares: number; }
interface Message { id: number; content: string; ip: string | null; createdAt: string; }

const StatCard = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`rounded-2xl p-5 border ${color} flex flex-col gap-2`}>
    <p className="text-xs tracking-widest opacity-60 font-sans">{label}</p>
    <p className="text-4xl font-light font-['Marhey']">{value.toLocaleString("ar-EG")}</p>
  </div>
);

const AdminPanel = () => {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<"overview" | "messages" | "settings">("overview");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [songUploading, setSongUploading] = useState(false);

  const load = useCallback(async (p: string) => {
    setLoading(true);
    const [s, m, cfg] = await Promise.all([
      api.getStats(p),
      api.getMessages(p),
      api.getSettings(),
    ]);
    if (!s.error) setStats(s);
    if (!m.error) setMessages(m);
    if (!cfg.error) setSettings(cfg);
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    setError("");
    const res = await api.verifyAdmin(pass);
    if (res.ok) { setAuthed(true); load(pass); }
    else setError("كلمة المرور غير صحيحة");
  };

  const handleDelete = async (id: number) => {
    await api.deleteMessage(id, pass);
    setMessages((m) => m.filter((x) => x.id !== id));
    setStats((s) => s ? { ...s, messages: s.messages - 1 } : s);
  };

  const handleSaveSettings = async () => {
    await api.updateSettings(settings, pass);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const res = await api.uploadImage(file, pass);
    if (res.url) {
      setSettings((s) => ({ ...s, heroImageUrl: res.url }));
    }
    setImageUploading(false);
  };

  const handleSongUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSongUploading(true);
    const res = await api.uploadSong(file, pass);
    if (res.url) {
      setSettings((s) => ({ ...s, songUrl: res.url }));
    }
    setSongUploading(false);
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0005] p-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-['Marhey'] text-3xl shimmer-text">لوحة التحكم</h1>
          <p className="text-sm text-white/40 tracking-wider">أدخل كلمة المرور للمتابعة</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="كلمة المرور"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center tracking-widest outline-none focus:border-[hsl(var(--rose))]/50 transition-colors"
            dir="ltr"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-[hsl(var(--rose))]/20 border border-[hsl(var(--rose))]/35 text-[hsl(var(--primary))] font-['Marhey'] text-lg hover:bg-[hsl(var(--rose))]/30 transition-all"
          >
            دخول
          </button>
          <a href="/" className="block text-xs text-white/30 hover:text-white/60 transition-colors mt-4">
            ← العودة للهدية
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0005] text-white p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="font-['Marhey'] text-2xl md:text-3xl shimmer-text">لوحة تحكم الهدية</h1>
          <div className="flex gap-3">
            <button onClick={() => load(pass)} className="text-xs text-white/40 hover:text-white/70 transition-colors">
              تحديث
            </button>
            <a href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              ← الهدية
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-0">
          {(["overview", "messages", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-['Marhey'] transition-all border-b-2 ${
                tab === t
                  ? "border-[hsl(var(--rose))] text-[hsl(var(--primary))]"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {t === "overview" ? "نظرة عامة" : t === "messages" ? "الرسائل" : "الإعدادات"}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-white/40 text-sm py-8">جاري التحميل ...</p>}

        {/* ══ Overview ══ */}
        {!loading && tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="زيارة" value={stats.visits} color="border-blue-500/20 bg-blue-500/5" />
              <StatCard label="إعجاب" value={stats.likes} color="border-[hsl(var(--rose))]/25 bg-[hsl(var(--rose))]/5" />
              <StatCard label="رسالة" value={stats.messages} color="border-green-500/20 bg-green-500/5" />
              <StatCard label="مشاركة" value={stats.shares} color="border-yellow-500/20 bg-yellow-500/5" />
            </div>

            {/* Status card */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-2">
              <p className="text-sm text-white/50 tracking-wider mb-3">حالة الهدية</p>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${stats.likes > 0 ? "bg-green-400" : "bg-white/20"}`} />
                <span className="text-sm">
                  {stats.likes > 0
                    ? `أُعجب بالهدية ${stats.likes} مرة`
                    : "لم تُسجَّل إعجابات بعد"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${stats.messages > 0 ? "bg-green-400" : "bg-white/20"}`} />
                <span className="text-sm">
                  {stats.messages > 0
                    ? `${stats.messages} رسالة مكتوبة — افتح تبويب الرسائل لتقرأها`
                    : "لم تُكتب رسائل بعد"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-sm">{stats.visits} زيارة لصفحة الهدية</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ Messages ══ */}
        {!loading && tab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">لم تُكتب رسائل بعد</div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-2 relative">
                  <p className="font-['Aref_Ruqaa'] text-lg leading-loose text-white/90">{msg.content}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30">
                      {new Date(msg.createdAt).toLocaleString("ar-SY", {
                        dateStyle: "medium", timeStyle: "short",
                      })}
                    </p>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══ Settings ══ */}
        {!loading && tab === "settings" && (
          <div className="space-y-5">
            {/* Image upload */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-3">
              <p className="font-['Marhey'] text-base text-[hsl(var(--primary))]/80">الصورة الرئيسية</p>
              <label className="flex flex-col items-center gap-2 cursor-pointer border border-dashed border-white/15 rounded-xl py-6 hover:border-[hsl(var(--rose))]/40 transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <span className="text-sm text-white/50">
                  {imageUploading ? "جاري الرفع ..." : "اضغط لرفع صورة جديدة"}
                </span>
              </label>
              {settings.heroImageUrl && (
                <div className="space-y-1">
                  <p className="text-xs text-white/40">مسار الصورة الحالية:</p>
                  <code className="text-xs text-[hsl(var(--rose))]/80 break-all">{settings.heroImageUrl}</code>
                  <img src={settings.heroImageUrl} className="w-32 h-20 object-cover rounded-lg mt-2 opacity-70" alt="preview" />
                </div>
              )}
            </div>

            {/* Song upload */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-3">
              <p className="font-['Marhey'] text-base text-[hsl(var(--primary))]/80">الأغنية</p>
              <label className="flex flex-col items-center gap-2 cursor-pointer border border-dashed border-white/15 rounded-xl py-6 hover:border-[hsl(var(--rose))]/40 transition-colors">
                <input type="file" accept="audio/*" className="hidden" onChange={handleSongUpload} />
                <span className="text-sm text-white/50">
                  {songUploading ? "جاري الرفع ..." : "اضغط لرفع أغنية جديدة"}
                </span>
              </label>
              {settings.songUrl && (
                <div className="space-y-1">
                  <p className="text-xs text-white/40">مسار الأغنية الحالية:</p>
                  <code className="text-xs text-[hsl(var(--rose))]/80 break-all">{settings.songUrl}</code>
                  <audio src={settings.songUrl} controls className="w-full mt-2 h-8 opacity-70" />
                </div>
              )}
            </div>

            {/* Text settings */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-4">
              <p className="font-['Marhey'] text-base text-[hsl(var(--primary))]/80">نصوص قابلة للتعديل</p>
              {[
                { key: "dedicationText", label: "نص الإهداء (أسفل الاسم)" },
                { key: "heroCaptionLine1", label: "السطر الأول على الصورة" },
                { key: "heroCaptionLine2", label: "السطر الثاني على الصورة" },
                { key: "closingLine", label: "الجملة الختامية" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs text-white/50 tracking-wider">{label}</label>
                  <input
                    type="text"
                    value={settings[key] ?? ""}
                    onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm outline-none focus:border-[hsl(var(--rose))]/50 transition-colors"
                    dir="rtl"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-3 rounded-xl bg-[hsl(var(--rose))]/20 border border-[hsl(var(--rose))]/40 text-[hsl(var(--primary))] font-['Marhey'] text-lg hover:bg-[hsl(var(--rose))]/30 transition-all"
            >
              {settingsSaved ? "تم الحفظ" : "حفظ الإعدادات"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
