import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "./api";

interface Stats { visits: number; likes: number; messages: number; shares: number; }
interface Message { id: number; content: string; ip: string | null; createdAt: string; }

type Tab = "overview" | "messages" | "camera" | "settings";

/* ─── Confirm Reset Dialog ─── */
const ConfirmReset = ({
  label, onConfirm, onCancel,
}: { label: string; onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
    <div className="bg-[#110008] border border-white/10 rounded-2xl p-6 max-w-xs w-full space-y-4 text-center">
      <p className="font-['Marhey'] text-lg text-white/90">تصفير {label}؟</p>
      <p className="text-xs text-white/40">لا يمكن التراجع عن هذه العملية</p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-white/10 text-white/50 text-sm hover:border-white/25 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
        >
          تصفير
        </button>
      </div>
    </div>
  </div>
);

/* ─── Camera View ─── */
const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<"idle" | "requesting" | "active" | "denied">("idle");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (mode: "user" | "environment") => {
    // stop existing stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStatus("active");
    } catch {
      setStatus("denied");
    }
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("idle");
  };

  const switchCamera = () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    startCamera(next);
  };

  // Cleanup on unmount
  useEffect(() => () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-black aspect-video flex items-center justify-center">
        {status !== "active" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            {status === "idle" && (
              <>
                <div className="text-5xl opacity-30">📷</div>
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-6 py-3 rounded-xl bg-[hsl(var(--rose))]/20 border border-[hsl(var(--rose))]/40 text-[hsl(var(--primary))] font-['Marhey'] text-base hover:bg-[hsl(var(--rose))]/30 transition-all"
                >
                  فتح الكاميرا
                </button>
              </>
            )}
            {status === "requesting" && (
              <p className="text-white/40 text-sm animate-pulse">جاري تشغيل الكاميرا ...</p>
            )}
            {status === "denied" && (
              <div className="text-center space-y-2 px-6">
                <p className="text-red-400/80 text-sm">تعذّر الوصول إلى الكاميرا</p>
                <p className="text-white/30 text-xs">تأكدي من منح الإذن للمتصفح</p>
                <button
                  onClick={() => startCamera(facingMode)}
                  className="mt-2 px-4 py-2 rounded-xl border border-white/15 text-white/50 text-xs hover:border-white/30 transition-colors"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${status === "active" ? "opacity-100" : "opacity-0"}`}
          style={{ transform: facingMode === "user" ? "scaleX(-1)" : "none" }}
        />
        {status === "active" && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] text-white/60 tracking-wider">مباشر</span>
          </div>
        )}
      </div>

      {status === "active" && (
        <div className="flex gap-3">
          <button
            onClick={switchCamera}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm hover:border-white/25 transition-colors"
          >
            تبديل الكاميرا
          </button>
          <button
            onClick={stopCamera}
            className="flex-1 py-2.5 rounded-xl border border-red-500/25 text-red-400/70 text-sm hover:bg-red-500/10 transition-colors"
          >
            إيقاف
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Stat Card with Reset ─── */
const StatCard = ({
  label, value, color, onReset,
}: { label: string; value: number; color: string; onReset: () => void }) => (
  <div className={`rounded-2xl p-5 border ${color} flex flex-col gap-3`}>
    <p className="text-xs tracking-widest opacity-60 font-sans">{label}</p>
    <p className="text-4xl font-light font-['Marhey']">{value.toLocaleString("ar-EG")}</p>
    <button
      onClick={onReset}
      className="self-start text-[10px] text-white/25 hover:text-red-400/70 transition-colors border border-white/8 hover:border-red-400/30 rounded-lg px-2 py-1"
    >
      تصفير
    </button>
  </div>
);

/* ─── Main Panel ─── */
const AdminPanel = () => {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [songUploading, setSongUploading] = useState(false);
  const [confirmReset, setConfirmReset] = useState<null | { label: string; action: () => Promise<void> }>(null);

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

  const askReset = (label: string, action: () => Promise<void>) => {
    setConfirmReset({ label, action });
  };

  const doReset = async () => {
    if (!confirmReset) return;
    await confirmReset.action();
    setConfirmReset(null);
    load(pass);
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
    if (res.url) setSettings((s) => ({ ...s, heroImageUrl: res.url }));
    setImageUploading(false);
  };

  const handleSongUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSongUploading(true);
    const res = await api.uploadSong(file, pass);
    if (res.url) setSettings((s) => ({ ...s, songUrl: res.url }));
    setSongUploading(false);
  };

  /* ── Login screen ── */
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

  const TABS: { id: Tab; label: string }[] = [
    { id: "overview", label: "نظرة عامة" },
    { id: "messages", label: "الرسائل" },
    { id: "camera", label: "الكاميرا" },
    { id: "settings", label: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0005] text-white p-4 md:p-8" dir="rtl">
      {confirmReset && (
        <ConfirmReset
          label={confirmReset.label}
          onConfirm={doReset}
          onCancel={() => setConfirmReset(null)}
        />
      )}

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
        <div className="flex gap-1 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-['Marhey'] transition-all border-b-2 -mb-px ${
                tab === t.id
                  ? "border-[hsl(var(--rose))] text-[hsl(var(--primary))]"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-center text-white/40 text-sm py-8">جاري التحميل ...</p>}

        {/* ══ Overview ══ */}
        {!loading && tab === "overview" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="زيارة"
                value={stats.visits}
                color="border-blue-500/20 bg-blue-500/5"
                onReset={() => askReset("الزيارات", () => api.resetVisits(pass))}
              />
              <StatCard
                label="إعجاب"
                value={stats.likes}
                color="border-[hsl(var(--rose))]/25 bg-[hsl(var(--rose))]/5"
                onReset={() => askReset("الإعجابات", () => api.resetLikes(pass))}
              />
              <StatCard
                label="رسالة"
                value={stats.messages}
                color="border-green-500/20 bg-green-500/5"
                onReset={() => askReset("الرسائل", () => api.resetMessages(pass))}
              />
              <StatCard
                label="مشاركة"
                value={stats.shares}
                color="border-yellow-500/20 bg-yellow-500/5"
                onReset={() => askReset("المشاركات", () => api.resetShares(pass))}
              />
            </div>

            {/* Status summary */}
            <div className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-3">
              <p className="text-sm text-white/50 tracking-wider mb-1">حالة الهدية</p>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${stats.likes > 0 ? "bg-green-400" : "bg-white/15"}`} />
                <span className="text-sm text-white/70">
                  {stats.likes > 0 ? `أُعجب بالهدية ${stats.likes} ${stats.likes === 1 ? "مرة" : "مرات"}` : "لم تُسجَّل إعجابات بعد"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${stats.messages > 0 ? "bg-green-400" : "bg-white/15"}`} />
                <span className="text-sm text-white/70">
                  {stats.messages > 0
                    ? `${stats.messages} ${stats.messages === 1 ? "رسالة مكتوبة" : "رسائل مكتوبة"} — افتح تبويب الرسائل`
                    : "لم تُكتب رسائل بعد"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-blue-400" />
                <span className="text-sm text-white/70">{stats.visits} زيارة لصفحة الهدية</span>
              </div>
              {stats.shares > 0 && (
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-yellow-400" />
                  <span className="text-sm text-white/70">شُورك الرابط {stats.shares} {stats.shares === 1 ? "مرة" : "مرات"}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ Messages ══ */}
        {!loading && tab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-white/30 text-sm">لم تُكتب رسائل بعد</div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-white/40">{messages.length} رسالة</p>
                  <button
                    onClick={() => askReset("جميع الرسائل", () => api.resetMessages(pass).then(() => setMessages([])))}
                    className="text-xs text-red-400/50 hover:text-red-400/80 transition-colors"
                  >
                    حذف الكل
                  </button>
                </div>
                {messages.map((msg) => (
                  <div key={msg.id} className="rounded-2xl p-5 border border-white/8 bg-white/3 space-y-2">
                    <p className="font-['Aref_Ruqaa'] text-lg leading-loose text-white/90">{msg.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/30">
                        {new Date(msg.createdAt).toLocaleString("ar-SY", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ══ Camera ══ */}
        {tab === "camera" && <CameraView />}

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
                  <p className="text-xs text-white/40">الصورة الحالية:</p>
                  <img src={settings.heroImageUrl} className="w-32 h-20 object-cover rounded-lg opacity-70" alt="preview" />
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
                <audio src={settings.songUrl} controls className="w-full mt-2 h-8 opacity-70" />
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
