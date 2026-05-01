import { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroImage from "@assets/FB_IMG_1777583498554_1777583587493.jpg";
const songUrl = `${import.meta.env.BASE_URL}tribute-song.mp3`;

/* ==================== Icons ==================== */
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const HeartSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const SparkleSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2 L13.5 9 L21 10.5 L13.5 12 L12 19 L10.5 12 L3 10.5 L10.5 9 Z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ==================== Rose SVG ==================== */
const RoseSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <defs>
      <radialGradient id="rG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd1dc" />
        <stop offset="40%" stopColor="hsl(345 82% 56%)" />
        <stop offset="100%" stopColor="hsl(345 78% 28%)" />
      </radialGradient>
      <radialGradient id="rC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(345 90% 72%)" />
        <stop offset="100%" stopColor="hsl(345 80% 36%)" />
      </radialGradient>
    </defs>
    <g fill="url(#rG)">
      <ellipse cx="32" cy="13" rx="11" ry="14" />
      <ellipse cx="14" cy="28" rx="14" ry="11" transform="rotate(-30 14 28)" />
      <ellipse cx="50" cy="28" rx="14" ry="11" transform="rotate(30 50 28)" />
      <ellipse cx="22" cy="49" rx="13" ry="11" transform="rotate(-50 22 49)" />
      <ellipse cx="42" cy="49" rx="13" ry="11" transform="rotate(50 42 49)" />
    </g>
    <g fill="url(#rC)" opacity="0.95">
      <ellipse cx="32" cy="22" rx="7" ry="9" />
      <ellipse cx="22" cy="32" rx="9" ry="7" transform="rotate(-30 22 32)" />
      <ellipse cx="42" cy="32" rx="9" ry="7" transform="rotate(30 42 32)" />
      <ellipse cx="32" cy="42" rx="9" ry="7" />
    </g>
    <circle cx="32" cy="32" r="6" fill="hsl(345 85% 28%)" />
    <circle cx="31" cy="31" r="2.5" fill="hsl(345 85% 62%)" opacity="0.8" />
  </svg>
);

const RosePetalSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="pG" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(345 88% 77%)" />
        <stop offset="100%" stopColor="hsl(345 80% 46%)" />
      </linearGradient>
    </defs>
    <path d="M12 2 C 18 4, 22 10, 18 18 C 15 22, 9 22, 6 18 C 2 10, 6 4, 12 2 Z" fill="url(#pG)" />
  </svg>
);

/* ==================== Beating Heart ==================== */
const BeatingHeart = ({ size = 240 }: { size?: number }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/10 heart-pulse-ring" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/10 heart-pulse-ring delay-1" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/10 heart-pulse-ring delay-2" />
    <span
      className="absolute inset-0 rounded-full"
      style={{ background: "radial-gradient(circle, hsl(345 78% 55% / 0.4) 0%, transparent 65%)", filter: "blur(24px)" }}
    />
    <svg viewBox="0 0 100 100" className="heart-beat relative z-10" style={{ width: "70%", height: "70%" }}>
      <defs>
        <linearGradient id="hB" x1="0.5" x2="0.5" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff8faa" />
          <stop offset="45%" stopColor="hsl(348 78% 52%)" />
          <stop offset="100%" stopColor="hsl(348 82% 24%)" />
        </linearGradient>
        <radialGradient id="hS" cx="32%" cy="22%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.46)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="hD" cx="65%" cy="80%" r="55%">
          <stop offset="0%" stopColor="rgba(55,0,14,0.35)" />
          <stop offset="100%" stopColor="rgba(55,0,14,0)" />
        </radialGradient>
      </defs>
      <path d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z" fill="url(#hB)" />
      <path d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z" fill="url(#hS)" />
      <path d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z" fill="url(#hD)" />
    </svg>
  </div>
);

/* ==================== Floating Elements ==================== */
const FloatingPetals = ({ count = 16 }: { count?: number }) => {
  const items = useMemo(() =>
    Array.from({ length: count }).map((_, i) => {
      const kind = Math.random();
      return {
        left: Math.random() * 100,
        size: 10 + Math.random() * 22,
        duration: 18 + Math.random() * 20,
        delay: Math.random() * 16,
        opacity: 0.3 + Math.random() * 0.4,
        kind: kind < 0.45 ? "heart" : kind < 0.82 ? "petal" : "rose",
        key: i,
      };
    }), [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((it) => (
        <span
          key={it.key}
          className="absolute float-up"
          style={{
            left: `${it.left}%`, bottom: "-50px",
            width: it.size, height: it.size,
            opacity: it.opacity,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            color: "hsl(var(--rose))",
            filter: "drop-shadow(0 0 7px hsl(var(--rose) / 0.45))",
          }}
        >
          {it.kind === "heart" ? <HeartSVG className="w-full h-full" />
            : it.kind === "petal" ? <RosePetalSVG className="w-full h-full" />
            : <RoseSVG className="w-full h-full" />}
        </span>
      ))}
    </div>
  );
};

const Sparkles = ({ count = 22 }: { count?: number }) => {
  const items = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      top: Math.random() * 100, left: Math.random() * 100,
      size: 4 + Math.random() * 9,
      delay: Math.random() * 5,
      duration: 2.4 + Math.random() * 4,
      key: i,
    })), [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((s) => (
        <span
          key={s.key}
          className="absolute twinkle text-[hsl(var(--primary))]"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            filter: "drop-shadow(0 0 5px currentColor)",
          }}
        >
          <SparkleSVG className="w-full h-full" />
        </span>
      ))}
    </div>
  );
};

/* ==================== Scroll Indicator ==================== */
const ScrollHint = ({ label = "اسحبي" }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ delay: 3, duration: 1.4 }}
    className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-[hsl(var(--rose))]/75 pointer-events-none"
    style={{ filter: "drop-shadow(0 0 7px hsl(var(--rose) / 0.45))" }}
  >
    <span className="text-[10px] tracking-[0.5em] font-sans">{label}</span>
    <motion.div
      animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 -mb-2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 opacity-50">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </motion.div>
  </motion.div>
);

/* ==================== Subtitle ==================== */
const Line = ({
  text, delay = 0, className = "", variant = "up",
}: {
  text: string; delay?: number; className?: string; variant?: "up" | "left" | "right" | "blur";
}) => {
  const initial =
    variant === "left"  ? { opacity: 0, x: -40, filter: "blur(4px)" }
    : variant === "right" ? { opacity: 0, x: 40, filter: "blur(4px)" }
    : variant === "blur"  ? { opacity: 0, filter: "blur(14px)", scale: 0.96 }
    : { opacity: 0, y: 22, filter: "blur(6px)" };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: false, amount: 0.35 }}
      transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

/* ==================== Name reveal ==================== */
const NameReveal = ({ name, className = "" }: { name: string; className?: string }) => (
  <span className={className}>
    {Array.from(name).map((ch, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 35, rotate: -10 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ delay: 0.14 * i, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ))}
  </span>
);

/* ==================== Decorative divider ==================== */
const Divider = () => (
  <div className="flex items-center justify-center gap-4 my-5 text-[hsl(var(--rose))]/65">
    <span className="block w-16 h-px bg-gradient-to-l from-transparent to-[hsl(var(--rose))]/55" />
    <RoseSVG className="w-5 h-5" />
    <span className="block w-16 h-px bg-gradient-to-r from-transparent to-[hsl(var(--rose))]/55" />
  </div>
);

/* ==================== "حورانية يا خال" badge ==================== */
const GhadBadge = () => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0.6, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
    viewport={{ once: false, amount: 0.5 }}
    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center gap-1"
  >
    <div className="badge-stamp text-[hsl(var(--primary))]/90">
      <span className="text-[hsl(var(--rose))]/70" style={{ fontSize: 10 }}>✦</span>
      <span className="font-['Aref_Ruqaa'] text-xl md:text-2xl tracking-widest glow-text">حورانية يا خال</span>
      <span className="text-[hsl(var(--rose))]/70" style={{ fontSize: 10 }}>✦</span>
    </div>
    <div className="w-1 h-1 rounded-full bg-[hsl(var(--rose))]/50" />
  </motion.div>
);

/* ==================== Like Button ==================== */
const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const [ripples, setRipples] = useState<number[]>([]);

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    const ids = [0, 1, 2].map((_, i) => Date.now() + i);
    setRipples(ids);
    setTimeout(() => setRipples([]), 900);
  };

  return (
    <div className="flex flex-col items-center gap-5 mt-4">
      <button
        onClick={handleLike}
        disabled={liked}
        className="relative flex flex-col items-center gap-3 group"
        style={{ cursor: liked ? "default" : "pointer" }}
      >
        <div className="relative flex items-center justify-center">
          {ripples.map((id, i) => (
            <span
              key={id}
              className="like-ring absolute inset-0 rounded-full border-2 border-[hsl(var(--rose))]"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
          <motion.div
            animate={liked ? { scale: [1, 1.4, 0.85, 1.15, 1] } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              liked
                ? "bg-[hsl(var(--rose))]"
                : "bg-[hsl(var(--rose))]/15 border border-[hsl(var(--rose))]/35 group-hover:bg-[hsl(var(--rose))]/25 group-hover:border-[hsl(var(--rose))]/60"
            } transition-all duration-300`}
            style={{
              boxShadow: liked
                ? "0 0 40px hsl(var(--rose) / 0.7), 0 0 80px hsl(var(--rose) / 0.35)"
                : "0 0 20px hsl(var(--rose) / 0.15)",
            }}
          >
            <HeartSVG className={`w-10 h-10 ${liked ? "text-white" : "text-[hsl(var(--rose))]"}`} />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {liked ? (
            <motion.p
              key="liked"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="font-['Marhey'] text-xl shimmer-text tracking-wider"
            >
              يسعدني أنّها أعجبتكِ
            </motion.p>
          ) : (
            <motion.p
              key="prompt"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-sans text-sm text-[hsl(var(--primary))]/70 tracking-wider"
            >
              هل أعجبتكِ الهدية ؟
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

/* ==================== App ==================== */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const fn = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    const a = audioRef.current;
    if (a) {
      a.volume = 0.85;
      a.muted = false;
      const p = a.play();
      if (p?.then) p.then(() => setIsPlaying(true)).catch(() => {});
      else setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) { a.pause(); setIsPlaying(false); }
    else {
      a.muted = false; a.volume = 0.85;
      const p = a.play();
      if (p?.then) p.then(() => setIsPlaying(true)).catch(() => {});
      else setIsPlaying(true);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setBursts((b) => [...b, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 1600);
  };

  return (
    <>
      <div className="custom-cursor hidden md:block" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
      <div className="film-grain" />
      <div className="vignette" />
      <audio ref={audioRef} src={songUrl} loop preload="auto" playsInline />

      <AnimatePresence>
        {!entered ? (
          /* ===== ENTRY GATE ===== */
          <motion.div
            key="gate"
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            style={{ background: "radial-gradient(ellipse at center, hsl(345 45% 7%) 0%, #000 70%)" }}
            onClick={handleEnter}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Sparkles count={30} />
            <FloatingPetals count={12} />

            {/* outer glowing ring */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-72 h-72 rounded-full border border-[hsl(var(--rose))]/20"
              style={{ boxShadow: "0 0 60px hsl(var(--rose) / 0.14) inset, 0 0 30px hsl(var(--rose) / 0.07)" }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-52 h-52 rounded-full border border-[hsl(var(--primary))]/12"
            />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 relative z-10"
            >
              <BeatingHeart size={180} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2 }}
              className="relative z-10 flex flex-col items-center gap-3"
            >
              <p className="font-['Marhey'] text-3xl shimmer-text tracking-[0.3em]">ادخلي عالمكِ</p>
              <p className="font-sans text-[hsl(var(--primary))]/60 text-[11px] tracking-[0.6em]">GHADOUSH</p>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 text-[hsl(var(--rose))]/80"
              >
                <PlayIcon />
              </motion.div>
            </motion.div>
          </motion.div>

        ) : (
          /* ===== FILM ===== */
          <motion.div
            key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2 }}
            className="relative"
          >
            {/* Cinematic letterbox bars */}
            <motion.div
              initial={{ y: "-100%" }} animate={{ y: 0 }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="letterbox letterbox-top"
            />
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }}
              transition={{ duration: 1.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="letterbox letterbox-bottom"
            />

            {/* Music toggle */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="fixed bottom-10 left-5 z-[80] text-[hsl(var(--rose))]/80 hover:text-[hsl(var(--rose))] transition-colors cursor-pointer"
              onClick={toggleMute}
              style={{ filter: "drop-shadow(0 0 8px hsl(var(--rose) / 0.5))" }}
            >
              <div className="w-6 h-6">{isPlaying ? <PauseIcon /> : <PlayIcon />}</div>
            </motion.div>

            <div className="film-container">

              {/* ══════════════════════════════════════════════
                  SCENE 1 — Title
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-rose text-center">
                <Sparkles count={30} />
                <FloatingPetals count={16} />

                {/* spinning halos */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rotate-slow w-[480px] h-[480px] rounded-full border border-[hsl(var(--rose))]/12" />
                  <div className="absolute rotate-slow-rev w-[640px] h-[640px] rounded-full border border-[hsl(var(--primary))]/8" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 2 }}
                  className="relative z-10 flex flex-col items-center gap-5"
                  onClick={handleHeartClick}
                >
                  {bursts.map((b) => (
                    <span key={b.id} className="absolute pointer-events-none" style={{ left: b.x, top: b.y }}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className="absolute text-[hsl(var(--rose))]"
                          initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                          animate={{
                            opacity: 0,
                            x: Math.cos((i / 8) * Math.PI * 2) * 90,
                            y: Math.sin((i / 8) * Math.PI * 2) * 90,
                            scale: 1.3,
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
                        >
                          <HeartSVG className="w-4 h-4" />
                        </motion.span>
                      ))}
                    </span>
                  ))}

                  <motion.p
                    initial={{ opacity: 0, letterSpacing: "0.2em" }}
                    whileInView={{ opacity: 0.65, letterSpacing: "0.45em" }}
                    transition={{ duration: 2 }}
                    className="font-sans text-[hsl(var(--primary))] text-xs"
                  >
                    إهداء إلى
                  </motion.p>

                  <BeatingHeart size={160} />

                  <h1 className="font-['Marhey'] text-7xl md:text-9xl font-light tracking-wider glow-text mt-2">
                    <NameReveal name="غدّوش" className="shimmer-text" />
                  </h1>

                  <GhadBadge />

                  <Divider />

                  <p className="font-sans text-[hsl(var(--primary))]/50 text-[11px] tracking-[0.5em]">٣٠ نيسان ٢٠٢٦</p>
                </motion.div>

                <ScrollHint label="اسحبي للأسفل" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 2 — Hero Photo (full bleed)
              ══════════════════════════════════════════════ */}
              <section className="film-scene bg-black">
                {/* Ken Burns photo */}
                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.22 }}
                  viewport={{ once: false }}
                  transition={{ duration: 38, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImage}
                    alt="غدّوش"
                    className="w-full h-full object-cover object-top"
                    style={{ opacity: 0.78 }}
                  />
                  {/* cinematic colour grade */}
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, hsl(340 60% 4%) 0%, transparent 45%, hsl(340 40% 4% / 0.55) 100%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "radial-gradient(circle at center, transparent 35%, hsl(340 50% 4% / 0.75) 90%)",
                  }} />
                  {/* warm rose tint overlay */}
                  <div className="absolute inset-0" style={{ background: "hsl(345 60% 15% / 0.18)", mixBlendMode: "multiply" }} />
                </motion.div>

                <Sparkles count={14} />
                <FloatingPetals count={6} />

                {/* Corner roses */}
                {[
                  { top: "12%", left: "8%", size: 40, delay: 0 },
                  { top: "18%", left: "86%", size: 32, delay: 0.5 },
                  { top: "64%", left: "5%", size: 36, delay: 1.0 },
                  { top: "68%", left: "88%", size: 44, delay: 1.5 },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-30 drift"
                    style={{ top: r.top, left: r.left, width: r.size, height: r.size }}
                    initial={{ opacity: 0, scale: 0.3, rotate: -20 }}
                    whileInView={{ opacity: 0.9, scale: 1, rotate: 0 }}
                    transition={{ delay: r.delay, duration: 1.6 }}
                  >
                    <RoseSVG className="w-full h-full" />
                  </motion.div>
                ))}

                {/* Text overlay at bottom */}
                <div className="absolute bottom-[12vh] left-0 w-full z-30 text-center px-8 space-y-4">
                  <Line text="يا فرحاً يمشي على الأرض" delay={0.5}
                    className="font-['Marhey'] text-2xl md:text-4xl text-white glow-text font-light" variant="blur" />
                  <Line text="ويا روحاً تشبه القمر في أجمل لياليه" delay={2.2}
                    className="font-sans text-base md:text-xl text-foreground/85 font-light" />
                  <Line text="غدّوش" delay={4.0}
                    className="font-['Aref_Ruqaa'] text-4xl md:text-5xl shimmer-text" />
                </div>

                <ScrollHint label="تابعي" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 3 — About غدغد (identity cards)
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-deep px-6">
                <Sparkles count={16} />
                <FloatingPetals count={8} />

                <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-lg w-full">
                  <Line text="من هي غدّوش ؟" delay={0}
                    className="font-['Marhey'] text-3xl text-[hsl(var(--rose))]/90 glow-text tracking-wider" />

                  {[
                    { label: "غدّوش", sub: "اسمٌ لا يُشبه غيره" },
                    { label: "غدغد", sub: "اللقب الذي أُحبُّه فيها" },
                    { label: "صانعةُ المحتوى", sub: "تحكي ببراعة من تجربة حقيقية" },
                    { label: "روحٌ حرّة", sub: "تختار طريقها وتكتب قصّتها" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50, filter: "blur(6px)" }}
                      whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      viewport={{ once: false, amount: 0.5 }}
                      transition={{ duration: 1.3, delay: i * 0.5 }}
                      className="glass-card px-7 py-4 w-full flex items-center justify-between gap-4"
                    >
                      <RoseSVG className="w-7 h-7 flex-shrink-0" />
                      <div className="flex-1 text-center">
                        <p className="font-['Marhey'] text-2xl md:text-3xl text-[hsl(var(--primary))] glow-text">{item.label}</p>
                        <p className="font-sans text-xs text-foreground/50 tracking-wider mt-1">{item.sub}</p>
                      </div>
                      <RoseSVG className="w-7 h-7 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>

                <ScrollHint label="عن جمالكِ" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 4 — Beauty Pt 1 (eyes / smile / voice)
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-warm px-6 text-center">
                <FloatingPetals count={12} />
                <Sparkles count={18} />

                <div className="relative z-10 max-w-xl space-y-5">
                  <Line text="عن جمالكِ ..." delay={0}
                    className="font-['Marhey'] text-2xl text-[hsl(var(--rose))]/88 glow-text tracking-wider mb-2" />

                  <div className="space-y-4 py-2">
                    {[
                      ["في عينيكِ بحرٌ من حكايات لم تُروَ بعد", 1.0],
                      ["وفي ابتسامتكِ ربيعٌ لا يعرف الذبول", 2.6],
                      ["وفي صوتكِ موسيقى لا تشبه إلا قلبكِ", 4.2],
                      ["وفي ضحكتكِ يفتحُ الورد أبوابه", 5.8],
                      ["وفي خطواتكِ تمشي القصائد بهدوء", 7.4],
                      ["أنتِ كما الورد ، نادرةٌ وكاملة", 9.0],
                    ].map(([txt, d], i) => (
                      <Line key={i} text={txt as string} delay={d as number}
                        variant={i % 2 === 0 ? "left" : "right"}
                        className={`font-sans text-lg md:text-xl font-light leading-relaxed ${
                          i === 5 ? "shimmer-text text-xl md:text-2xl pt-2" : "text-foreground/90 prose-line"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <ScrollHint label="المزيد" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 5 — Photo #2 (same photo, grayscale treatment)
              ══════════════════════════════════════════════ */}
              <section className="film-scene bg-black">
                <motion.div
                  initial={{ scale: 1.06 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 25, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImage}
                    alt="غدّوش"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: "center 25%",
                      opacity: 0.65,
                      filter: "grayscale(60%) contrast(1.1) brightness(0.9)",
                    }}
                  />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(135deg, hsl(345 70% 12% / 0.65) 0%, transparent 60%, hsl(345 60% 8% / 0.8) 100%)",
                  }} />
                  <div className="absolute inset-0" style={{
                    background: "linear-gradient(to top, #000 0%, transparent 50%)",
                  }} />
                </motion.div>

                <Sparkles count={10} />

                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-8 gap-5">
                  <GhadBadge />

                  <Line text="جمالكِ ليس صورةً تُرى ..." delay={1.0}
                    className="font-sans text-lg md:text-2xl text-foreground/90 font-light" variant="blur" />
                  <Line text="جمالكِ روحٌ تختار طريقها بثقة" delay={2.6}
                    className="font-sans text-lg md:text-2xl text-foreground/90 font-light" variant="blur" />
                  <Line text="جمالكِ هدوءٌ يخفي كبرياء عميقاً" delay={4.2}
                    className="font-sans text-lg md:text-2xl text-foreground/90 font-light" variant="blur" />
                  <Line text="جمالكِ في صدقكِ مع نفسكِ أوّلاً" delay={5.8}
                    className="font-sans text-lg md:text-2xl text-foreground/90 font-light" variant="blur" />
                  <Line text="جمالكِ أنّكِ ... أنتِ" delay={7.4}
                    className="font-['Marhey'] text-3xl md:text-5xl shimmer-text glow-text" variant="blur" />
                </div>

                <ScrollHint label="قوّتكِ" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 6 — Strength
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-gold px-6 text-center">
                <FloatingPetals count={10} />
                <Sparkles count={14} />

                <div className="relative z-10 max-w-xl space-y-5">
                  <Line text="عن قوّتكِ ..." delay={0}
                    className="font-['Marhey'] text-2xl text-[hsl(var(--rose))]/88 glow-text tracking-wider mb-2" />

                  {[
                    ["في قلبكِ شجاعة تصنع المعجزات", 1.0, "left"],
                    ["وفي روحكِ هدوءُ الجبال ، وعزّتها", 2.6, "right"],
                    ["تختارين الحُبَّ لنفسكِ ، فيختارُكِ القمر", 4.2, "left"],
                    ["تمضين بهدوءٍ ، فتصير الطُرق خلفكِ ضوءاً", 5.8, "right"],
                    ["أنتِ القويّة ... وأنتِ الناعمة في آنٍ واحد", 7.4, "left"],
                  ].map(([txt, d, v], i) => (
                    <Line key={i} text={txt as string} delay={d as number} variant={v as "left" | "right"}
                      className={`font-sans text-lg md:text-xl font-light leading-relaxed ${
                        i === 4 ? "shimmer-text text-xl md:text-2xl pt-2" : "text-foreground/90 prose-line"
                      }`}
                    />
                  ))}
                </div>

                <ScrollHint label="كلماتها" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 7 — Her Quote
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-deep px-6 text-center">
                <FloatingPetals count={8} />
                <Sparkles count={16} />

                <div className="relative z-10 max-w-xl mx-auto space-y-8">
                  <Line text="قالت يومًا ..." delay={0}
                    className="font-sans text-sm text-[hsl(var(--primary))]/70 tracking-[0.4em]" />

                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.7, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, scaleY: 1, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card px-8 py-10 space-y-6"
                  >
                    <p className="font-['Aref_Ruqaa'] text-3xl md:text-4xl text-foreground/95 leading-loose">
                      وفي النهاية ...
                    </p>
                    <p className="font-['Aref_Ruqaa'] text-3xl md:text-4xl text-foreground/95 leading-loose">
                      اخترتُ نفسي ...
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="font-['Aref_Ruqaa'] text-3xl md:text-4xl shimmer-text">والنفوس عزيزة</span>
                      <HeartSVG className="w-7 h-7 text-[hsl(var(--rose))] heart-beat" />
                    </div>
                  </motion.div>

                  <Divider />

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 5, duration: 2 }}
                    className="font-sans text-xs tracking-[0.5em] text-[hsl(var(--primary))]/55"
                  >
                    — غدّوش
                  </motion.p>
                </div>

                <ScrollHint label="القصيدة" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 8 — Poem
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-rose px-6 text-center">
                <FloatingPetals count={16} />
                <Sparkles count={22} />

                {/* orbit rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rotate-slow w-[500px] h-[500px] rounded-full border border-[hsl(var(--rose))]/14" />
                  <div className="absolute rotate-slow-rev w-[660px] h-[660px] rounded-full border border-[hsl(var(--primary))]/9" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 1.8 }}
                  className="relative z-10 mb-5"
                >
                  <BeatingHeart size={160} />
                </motion.div>

                <div className="relative z-10 max-w-xl space-y-3 text-center">
                  {[
                    ["يا قمراً لا يغيبُ عن سمائي", 0.4],
                    ["يا فراشةً تختارُ الليلَ مسرحاً", 1.7],
                    ["وملكةً توّجت نفسها بلا عرش", 3.0],
                    ["من ترابٍ أسمر نسجتِ كبرياءكِ", 4.3],
                    ["ومن وردِ نيسان غزلتِ ابتسامتكِ", 5.6],
                    ["ومن أغاني الأعراس صنعتِ هويّتكِ", 6.9],
                    ["ومن صمتِ الليل حملتِ ضوءكِ", 8.2],
                    ["في اختياركِ لنفسكِ ألفُ انتصار", 9.5],
                  ].map(([txt, d], i) => (
                    <Line key={i} text={txt as string} delay={d as number}
                      variant={i % 2 === 0 ? "left" : "right"}
                      className={`font-sans text-base md:text-xl font-light leading-relaxed ${
                        i === 7 ? "shimmer-text text-lg md:text-2xl pt-3" : "text-foreground/92"
                      }`}
                    />
                  ))}
                </div>

                <ScrollHint label="أمنياتي لكِ" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 9 — Wishes
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-warm px-6 text-center">
                <FloatingPetals count={18} />
                <Sparkles count={18} />

                <div className="relative z-10 space-y-6">
                  {[
                    ["دامَ لكِ التاج", 0.3, "primary"],
                    ["ودامتِ الفراشاتُ حولكِ", 1.6, "primary"],
                    ["ودامَ الوردُ في طريقكِ", 2.9, "rose"],
                    ["ودامَ صوتُكِ يا صوتَ الفرح", 4.2, "rose"],
                    ["ودامتِ الضحكةُ في عينيكِ", 5.5, "primary"],
                    ["ودامَ ربيعُكِ ولا خريفَ يطالكِ", 6.8, "rose"],
                    ["ودامَ القلبُ الذي اخترتِه", 8.1, "shimmer"],
                  ].map(([txt, d, color], i) => (
                    <Line key={i} text={txt as string} delay={d as number}
                      variant={i % 2 === 0 ? "left" : "right"}
                      className={`font-['Marhey'] text-2xl md:text-4xl font-light ${
                        color === "shimmer" ? "shimmer-text"
                        : color === "rose" ? "text-[hsl(var(--rose))]/90 glow-text"
                        : "text-[hsl(var(--primary))]/90 glow-text"
                      }`}
                    />
                  ))}

                  <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 9.2, duration: 1.4 }}
                    className="flex justify-center gap-5 items-center pt-2"
                  >
                    <RoseSVG className="w-9 h-9 drift" />
                    <HeartSVG className="w-12 h-12 text-[hsl(var(--rose))] heart-beat" />
                    <RoseSVG className="w-9 h-9 drift" />
                  </motion.div>
                </div>

                <ScrollHint label="باقة وردٍ" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 10 — Roses bouquet
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-deep px-6 text-center">
                <FloatingPetals count={22} />
                <Sparkles count={14} />

                <div className="relative z-10 max-w-xl space-y-7">
                  <Line text="باقةُ وردٍ من قلبٍ يحبّكِ" delay={0}
                    className="font-['Marhey'] text-2xl md:text-4xl shimmer-text glow-text" variant="blur" />

                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 1.6, delay: 0.8 }}
                    className="flex justify-center items-end gap-3 md:gap-5"
                  >
                    {[40, 52, 68, 52, 40].map((s, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -7, 0] }}
                        transition={{ duration: 3.6, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: s, height: s }}
                      >
                        <RoseSVG className="w-full h-full" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="space-y-4 mt-3">
                    {[
                      ["لكلِّ يومٍ من أيّامكِ ، وردة", 2.0],
                      ["ولكلِّ ابتسامةٍ من ضحكاتكِ ، نجمة", 3.4],
                      ["ولكلِّ كلمةٍ من حروفكِ ، فراشة", 4.8],
                      ["ولكلِّ نظرةٍ من عينيكِ ، أغنية", 6.2],
                      ["ولكلِّ خطوةٍ تختارينها ، طريقٌ من نور", 7.6],
                    ].map(([txt, d], i) => (
                      <Line key={i} text={txt as string} delay={d as number}
                        variant={i % 2 === 0 ? "left" : "right"}
                        className={`font-sans text-lg md:text-xl font-light leading-relaxed ${
                          i === 4 ? "text-[hsl(var(--rose))]/95" : "text-foreground/88"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <ScrollHint label="من القلب" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 11 — From the heart
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-rose px-6 text-center">
                <FloatingPetals count={12} />
                <Sparkles count={16} />

                <div className="relative z-10 max-w-xl space-y-5">
                  <Line text="من القلب ..." delay={0}
                    className="font-['Marhey'] text-2xl text-[hsl(var(--rose))]/88 glow-text tracking-wider mb-2" />

                  <div className="glass-card px-7 py-7 space-y-5">
                    {[
                      ["غدّوش ، يا قلبًا لا يُشبه قلباً", 1.0, "left"],
                      ["يا روحًا اختارت الجمال طريقاً", 2.5, "right"],
                      ["يا حُلمًا يمشي على الأرض", 4.0, "left"],
                      ["يا قصيدةً لم يُكتب لها مثيل", 5.5, "right"],
                      ["يا فرحًا متجدّداً كلَّ صباح", 7.0, "left"],
                      ["ابقي كما أنتِ ... فأنتِ كما الحُلمُ تماماً", 8.5, "blur"],
                    ].map(([txt, d, v], i) => (
                      <Line key={i} text={txt as string} delay={d as number} variant={v as "left" | "right" | "blur"}
                        className={`font-sans text-lg md:text-xl font-light leading-relaxed ${
                          i === 5 ? "shimmer-text text-xl md:text-2xl" : "text-foreground/90"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <ScrollHint label="بحبّكِ" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 12 — Blessing / Dua
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-gold px-6 text-center">
                <FloatingPetals count={14} />
                <Sparkles count={20} />

                <div className="relative z-10 max-w-xl space-y-5">
                  <Line text="غدّوش ..." delay={0}
                    className="font-['Marhey'] text-3xl md:text-5xl shimmer-text glow-text mb-3" variant="blur" />

                  <div className="space-y-4">
                    {[
                      ["ربّي يحرسكِ من كلِّ حزنٍ يطرق الباب", 1.2, "left"],
                      ["ويملأ أيامكِ بكلِّ ما تتمنّاه روحكِ", 2.8, "right"],
                      ["ويرسلُ في طريقكِ من يحبّكِ كما تستحقّين", 4.4, "left"],
                      ["ويُبقي على وجهكِ تلك الابتسامة الجميلة", 6.0, "right"],
                      ["ويجعل كلَّ يومٍ أجمل من الذي قبله", 7.6, "left"],
                      ["فأنتِ تستحقّين كلَّ الحُبِّ ، وكلَّ الورد", 9.2, "blur"],
                    ].map(([txt, d, v], i) => (
                      <Line key={i} text={txt as string} delay={d as number} variant={v as "left" | "right" | "blur"}
                        className={`font-sans text-lg md:text-xl font-light leading-relaxed ${
                          i === 5 ? "shimmer-text text-xl md:text-2xl" : "text-foreground/90"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <ScrollHint label="التوقيع" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 13 — Signature
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-deep text-center">
                <Sparkles count={24} />
                <FloatingPetals count={12} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 2.2 }}
                  className="relative z-10 flex flex-col items-center gap-5"
                >
                  <BeatingHeart size={130} />
                  <p className="font-sans text-sm text-[hsl(var(--primary))]/70 tracking-[0.5em] mt-2">بكلِّ الحُب</p>
                  <p
                    className="font-['Aref_Ruqaa'] text-7xl md:text-9xl shimmer-text"
                    style={{ transform: "rotate(-4deg)", lineHeight: 1.2 }}
                  >
                    غدّوش
                  </p>

                  <div className="flex items-center gap-3 text-[hsl(var(--rose))]/75">
                    <RoseSVG className="w-5 h-5" />
                    <RoseSVG className="w-7 h-7" />
                    <RoseSVG className="w-5 h-5" />
                  </div>

                  <GhadBadge />

                  <p className="font-sans text-[10px] text-[hsl(var(--primary))]/30 tracking-[0.4em] mt-8">
                    هدية رقمية · ٢٠٢٦
                  </p>
                </motion.div>

                <ScrollHint label="إلى اللقاء" />
              </section>

              {/* ══════════════════════════════════════════════
                  SCENE 14 — Farewell + Like + Facebook
              ══════════════════════════════════════════════ */}
              <section className="film-scene scene-bg-rose text-center">
                <FloatingPetals count={18} />
                <Sparkles count={24} />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 2 }}
                  onViewportEnter={() => {
                    const a = audioRef.current;
                    if (a && !a.paused) {
                      let vol = a.volume;
                      const fade = setInterval(() => {
                        vol -= 0.04;
                        if (vol <= 0.15) { vol = 0.15; clearInterval(fade); }
                        a.volume = Math.max(0.15, vol);
                      }, 220);
                    }
                  }}
                  onViewportLeave={() => {
                    const a = audioRef.current;
                    if (a) a.volume = 0.85;
                  }}
                  className="relative z-10 flex flex-col items-center gap-6 px-8"
                >
                  {/* Glowing rose */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 2 }}
                    className="drift"
                    style={{ filter: "drop-shadow(0 0 20px hsl(var(--rose) / 0.7))" }}
                  >
                    <RoseSVG className="w-20 h-20" />
                  </motion.div>

                  <Line text="إلى اللقاء ..." delay={0.8}
                    className="font-['Marhey'] text-4xl md:text-6xl shimmer-text glow-text" variant="blur" />

                  <Line text="طابَ يومُكِ" delay={2.4}
                    className="font-['Marhey'] text-5xl md:text-8xl text-[hsl(var(--rose))] glow-text" variant="blur" />

                  <Line text="يا غدغد" delay={4.0}
                    className="font-['Aref_Ruqaa'] text-3xl md:text-5xl text-[hsl(var(--primary))]/85" variant="blur" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 5.5, duration: 1.5 }}
                    className="flex items-center gap-3 text-[hsl(var(--rose))]/70"
                  >
                    <RoseSVG className="w-5 h-5" />
                    <HeartSVG className="w-6 h-6 heart-beat" />
                    <RoseSVG className="w-5 h-5" />
                  </motion.div>

                  {/* Like button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 6.5, duration: 1.4 }}
                  >
                    <LikeButton />
                  </motion.div>

                  {/* Facebook link */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 7.5, duration: 1.2 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <a
                      href="https://www.facebook.com/share/18f8hnHcqx/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fb-btn"
                    >
                      <FacebookIcon />
                      <span>صفحة غدّوش</span>
                    </a>
                    <p className="font-sans text-[10px] text-[hsl(var(--primary))]/40 tracking-wider">
                      تابعيها على فيسبوك
                    </p>
                  </motion.div>

                  {/* Restart */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 8.5, duration: 1 }}
                    onClick={() => {
                      document.querySelector(".film-container")?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-[hsl(var(--rose))]/55 hover:text-[hsl(var(--rose))] transition-colors font-sans text-[11px] tracking-widest flex flex-col items-center gap-2 mt-2"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    إعادة من البداية
                  </motion.button>
                </motion.div>
              </section>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
