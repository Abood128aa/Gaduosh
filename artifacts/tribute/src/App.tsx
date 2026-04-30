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

/* ==================== Rose (top-down stylized) ==================== */
const RoseSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <defs>
      <radialGradient id="roseGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd1dc" />
        <stop offset="35%" stopColor="hsl(345 80% 55%)" />
        <stop offset="100%" stopColor="hsl(345 75% 28%)" />
      </radialGradient>
      <radialGradient id="roseCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(345 90% 70%)" />
        <stop offset="100%" stopColor="hsl(345 80% 35%)" />
      </radialGradient>
    </defs>
    {/* outer petals */}
    <g fill="url(#roseGrad)">
      <ellipse cx="32" cy="13" rx="11" ry="14" />
      <ellipse cx="14" cy="28" rx="14" ry="11" transform="rotate(-30 14 28)" />
      <ellipse cx="50" cy="28" rx="14" ry="11" transform="rotate(30 50 28)" />
      <ellipse cx="22" cy="49" rx="13" ry="11" transform="rotate(-50 22 49)" />
      <ellipse cx="42" cy="49" rx="13" ry="11" transform="rotate(50 42 49)" />
    </g>
    {/* mid petals */}
    <g fill="url(#roseCore)" opacity="0.95">
      <ellipse cx="32" cy="22" rx="7" ry="9" />
      <ellipse cx="22" cy="32" rx="9" ry="7" transform="rotate(-30 22 32)" />
      <ellipse cx="42" cy="32" rx="9" ry="7" transform="rotate(30 42 32)" />
      <ellipse cx="32" cy="42" rx="9" ry="7" />
    </g>
    {/* core */}
    <circle cx="32" cy="32" r="6" fill="hsl(345 85% 28%)" />
    <circle cx="31" cy="31" r="2.5" fill="hsl(345 85% 60%)" opacity="0.8" />
  </svg>
);

const RosePetalSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="petalGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="hsl(345 85% 75%)" />
        <stop offset="100%" stopColor="hsl(345 80% 45%)" />
      </linearGradient>
    </defs>
    <path
      d="M12 2 C 18 4, 22 10, 18 18 C 15 22, 9 22, 6 18 C 2 10, 6 4, 12 2 Z"
      fill="url(#petalGrad)"
    />
  </svg>
);

/* ==================== Natural Beating Heart ==================== */
const BeatingHeart = ({ size = 240 }: { size?: number }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    {/* expanding rings */}
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/12 heart-pulse-ring" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/12 heart-pulse-ring delay-1" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/12 heart-pulse-ring delay-2" />

    {/* warm halo */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(345 75% 55% / 0.45) 0%, transparent 65%)",
        filter: "blur(22px)",
      }}
    />

    {/* the heart */}
    <svg
      viewBox="0 0 100 100"
      className="heart-beat relative z-10"
      style={{ width: "70%", height: "70%" }}
    >
      <defs>
        <linearGradient id="heartBody" x1="0.5" x2="0.5" y1="0" y2="1">
          <stop offset="0%"  stopColor="#ff8aa0" />
          <stop offset="45%" stopColor="hsl(348 75% 52%)" />
          <stop offset="100%" stopColor="hsl(348 80% 25%)" />
        </linearGradient>
        <radialGradient id="heartShine" cx="32%" cy="22%" r="55%">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.45)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id="heartShade" cx="65%" cy="80%" r="55%">
          <stop offset="0%"  stopColor="rgba(60,0,15,0.35)" />
          <stop offset="100%" stopColor="rgba(60,0,15,0)" />
        </radialGradient>
      </defs>
      {/* base shape */}
      <path
        d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z"
        fill="url(#heartBody)"
      />
      {/* soft top-left shine */}
      <path
        d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z"
        fill="url(#heartShine)"
      />
      {/* soft bottom-right shade */}
      <path
        d="M50 88 C 16 64, 6 44, 6 28 C 6 14, 17 6, 28 6 C 38 6, 46 12, 50 22 C 54 12, 62 6, 72 6 C 83 6, 94 14, 94 28 C 94 44, 84 64, 50 88 Z"
        fill="url(#heartShade)"
      />
    </svg>
  </div>
);

/* ==================== Floating Hearts + Roses ==================== */
const FloatingPetals = ({ count = 18 }: { count?: number }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const kind = Math.random();
        return {
          left: Math.random() * 100,
          size: 12 + Math.random() * 24,
          duration: 16 + Math.random() * 18,
          delay: Math.random() * 14,
          opacity: 0.35 + Math.random() * 0.45,
          kind: kind < 0.45 ? "heart" : kind < 0.85 ? "petal" : "rose",
          key: i,
        };
      }),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((it) => (
        <span
          key={it.key}
          className="absolute float-up"
          style={{
            left: `${it.left}%`,
            bottom: "-50px",
            width: it.size,
            height: it.size,
            opacity: it.opacity,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            color: "hsl(var(--rose))",
            filter: "drop-shadow(0 0 8px hsl(var(--rose) / 0.5))",
          }}
        >
          {it.kind === "heart" ? (
            <HeartSVG className="w-full h-full" />
          ) : it.kind === "petal" ? (
            <RosePetalSVG className="w-full h-full" />
          ) : (
            <RoseSVG className="w-full h-full" />
          )}
        </span>
      ))}
    </div>
  );
};

/* ==================== Sparkles ==================== */
const Sparkles = ({ count = 24 }: { count?: number }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10,
        delay: Math.random() * 5,
        duration: 2.5 + Math.random() * 4,
        key: i,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {items.map((s) => (
        <span
          key={s.key}
          className="absolute twinkle text-[hsl(var(--primary))]"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            filter: "drop-shadow(0 0 6px currentColor)",
          }}
        >
          <SparkleSVG className="w-full h-full" />
        </span>
      ))}
    </div>
  );
};

/* ==================== Scroll Down Indicator ==================== */
const ScrollHint = ({ label = "اسحبي للأسفل" }: { label?: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ delay: 2.5, duration: 1.2 }}
    className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-[hsl(var(--rose))]/80 pointer-events-none"
    style={{ filter: "drop-shadow(0 0 8px hsl(var(--rose) / 0.5))" }}
  >
    <span className="text-[11px] tracking-[0.5em] font-sans">{label}</span>
    <motion.div
      animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 -mb-2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 opacity-60">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </motion.div>
  </motion.div>
);

/* ==================== Subtitle helpers ==================== */
const Subtitle = ({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: false, amount: 0.4 }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {text}
  </motion.div>
);

const NameReveal = ({ name, className = "" }: { name: string; className?: string }) => {
  const letters = Array.from(name);
  return (
    <span className={className}>
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, rotate: -8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ delay: 0.15 * i, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
};

const Divider = () => (
  <div className="flex items-center justify-center gap-4 my-4 text-[hsl(var(--rose))]/70">
    <span className="block w-12 h-[1px] bg-gradient-to-l from-transparent to-[hsl(var(--rose))]/60" />
    <RoseSVG className="w-5 h-5" />
    <span className="block w-12 h-[1px] bg-gradient-to-r from-transparent to-[hsl(var(--rose))]/60" />
  </div>
);

/* ==================== App ==================== */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    const a = audioRef.current;
    if (a) {
      a.volume = 0.85;
      a.muted = false;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
    } else {
      a.muted = false;
      a.volume = 0.85;
      const p = a.play();
      if (p && typeof p.then === "function") {
        p.then(() => setIsPlaying(true)).catch(() => {});
      } else setIsPlaying(true);
    }
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setBursts((b) => [...b, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((it) => it.id !== id)), 1600);
  };

  return (
    <>
      <div
        className="custom-cursor hidden md:block"
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      <div className="film-grain" />
      <div className="vignette" />

      <audio ref={audioRef} src={songUrl} loop preload="auto" playsInline />

      <AnimatePresence>
        {!entered ? (
          <motion.div
            key="gate"
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer overflow-hidden"
            onClick={handleEnter}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Sparkles count={22} />
            <FloatingPetals count={10} />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <BeatingHeart size={180} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="font-[Marhey] tracking-[0.4em] text-2xl mb-3 shimmer-text"
            >
              ادخلي عالمكِ
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1.2, duration: 1.5 }}
              className="text-[hsl(var(--primary))]/70 text-xs tracking-[0.5em] mb-8"
            >
              GHADOUSH
            </motion.p>
            <div className="w-7 h-7 text-[hsl(var(--rose))] animate-pulse">
              <PlayIcon />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="relative"
          >
            {/* Letterbox bars */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="letterbox letterbox-top"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="letterbox letterbox-bottom"
            />

            {/* Music Control */}
            <div
              className="fixed bottom-12 left-6 z-50 text-[hsl(var(--rose))]/85 hover:text-[hsl(var(--rose))] transition-colors cursor-pointer"
              onClick={toggleMute}
              style={{ filter: "drop-shadow(0 0 10px hsl(var(--rose) / 0.6))" }}
            >
              {isPlaying ? (
                <div className="w-6 h-6"><PauseIcon /></div>
              ) : (
                <div className="w-6 h-6"><PlayIcon /></div>
              )}
            </div>

            <div className="film-container">

              {/* ===== Scene 1: Title ===== */}
              <section className="film-scene flex flex-col items-center justify-center bg-transparent text-center">
                <Sparkles count={28} />
                <FloatingPetals count={14} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 1.8 }}
                  className="relative z-10 flex flex-col items-center space-y-6"
                  onClick={handleHeartClick}
                >
                  {bursts.map((b) => (
                    <span
                      key={b.id}
                      className="absolute pointer-events-none"
                      style={{ left: b.x, top: b.y }}
                    >
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className="absolute text-[hsl(var(--rose))]"
                          initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                          animate={{
                            opacity: 0,
                            x: Math.cos((i / 8) * Math.PI * 2) * 80,
                            y: Math.sin((i / 8) * Math.PI * 2) * 80,
                            scale: 1.2,
                          }}
                          transition={{ duration: 1.4, ease: "easeOut" }}
                          style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
                        >
                          <HeartSVG className="w-4 h-4" />
                        </motion.span>
                      ))}
                    </span>
                  ))}

                  <p className="text-[hsl(var(--primary))]/70 font-sans tracking-[0.4em] text-xs uppercase">إهداء</p>

                  <BeatingHeart size={170} />

                  <h1 className="font-[Marhey] text-6xl md:text-8xl lg:text-[10rem] font-light tracking-wide glow-text">
                    <NameReveal name="غدّوش" className="shimmer-text" />
                  </h1>

                  <Divider />
                  <p className="text-[hsl(var(--primary))]/55 font-sans text-xs tracking-[0.4em]">٣٠ نيسان ٢٠٢٦</p>
                </motion.div>

                <ScrollHint label="اسحبي للأسفل" />
              </section>

              {/* ===== Scene 2: Hero image ===== */}
              <section className="film-scene bg-black relative overflow-hidden">
                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.18 }}
                  viewport={{ once: false }}
                  transition={{ duration: 18, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-black/45 z-10" />
                  <img src={heroImage} alt="غدّوش" className="w-full h-full object-cover object-center opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-20 opacity-90" />
                  <div className="absolute inset-0 z-20" style={{
                    background: "radial-gradient(circle at center, transparent 30%, hsl(345 50% 5% / 0.7) 90%)",
                  }} />
                </motion.div>

                <Sparkles count={18} />

                {/* Roses around the photo */}
                {[
                  { top: "14%", left: "10%", size: 36, delay: 0 },
                  { top: "24%", left: "84%", size: 28, delay: 0.4 },
                  { top: "60%", left: "6%",  size: 32, delay: 0.8 },
                  { top: "70%", left: "86%", size: 40, delay: 1.2 },
                  { top: "40%", left: "92%", size: 22, delay: 1.6 },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-30 drift"
                    style={{ top: r.top, left: r.left, width: r.size, height: r.size }}
                    initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
                    whileInView={{ opacity: 0.95, scale: 1, rotate: 0 }}
                    transition={{ delay: r.delay, duration: 1.4 }}
                  >
                    <RoseSVG className="w-full h-full" />
                  </motion.div>
                ))}

                <div className="absolute bottom-[16vh] left-0 w-full text-center z-30 px-6 space-y-4">
                  <Subtitle
                    text="في حوران تولد البنات تيجاناً"
                    delay={0.2}
                    className="font-sans text-xl md:text-3xl text-foreground drop-shadow-md font-light glow-text"
                  />
                  <Subtitle
                    text="ومن تراب الجيزة، نبتت زهرةٌ اسمها غدّوش"
                    delay={1.2}
                    className="font-sans text-base md:text-xl text-[hsl(var(--rose))]/90 font-light"
                  />
                </div>
                <ScrollHint label="تابعي الحكاية" />
              </section>

              {/* ===== Scene 3: Quote ===== */}
              <section className="film-scene flex flex-col items-center justify-center bg-transparent px-6 text-center relative">
                <FloatingPetals count={8} />
                <Sparkles count={14} />

                <div className="max-w-2xl mx-auto space-y-9 relative z-10">
                  <Subtitle
                    text="قالت يومًا، بصوتٍ أعرفه"
                    delay={0}
                    className="font-sans text-base md:text-lg text-[hsl(var(--primary))]/70 tracking-wider"
                  />
                  <Subtitle text="وفي النهاية ..." delay={0.8} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <Subtitle text="اخترتُ نفسي ..." delay={1.6} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <motion.div
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.4, delay: 2.6, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-3xl md:text-5xl shimmer-text flex items-center justify-center gap-4"
                  >
                    <span>والنفوس عزيزة</span>
                    <HeartSVG className="w-7 h-7 md:w-9 md:h-9 text-[hsl(var(--rose))] heart-beat" />
                  </motion.div>
                  <Divider />
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 2 }}
                    className="font-sans text-xs tracking-[0.4em] text-[hsl(var(--primary))]/60"
                  >
                    — غدّوش
                  </motion.p>
                </div>
                <ScrollHint label="هناك المزيد" />
              </section>

              {/* ===== Scene 4: Identity ===== */}
              <section className="film-scene bg-transparent relative flex items-center justify-center">
                <div className="absolute inset-0">
                  <img src={heroImage} className="w-full h-full object-cover opacity-15 blur-md grayscale" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
                </div>
                <Sparkles count={14} />
                <FloatingPetals count={6} />

                <div className="relative z-10 flex flex-col space-y-10 items-center text-center">
                  <Subtitle
                    text="من هي غدّوش ؟"
                    delay={0}
                    className="font-['Marhey'] text-2xl md:text-3xl text-[hsl(var(--rose))]/85 mb-4 tracking-wider glow-text"
                  />
                  {[
                    { ar: "ابنةُ حوران الأبيّة", en: "Daughter of Hauran" },
                    { ar: "من الجيزة، درعا", en: "From Al-Jizah · Dar'A" },
                    { ar: "وُلدت في ربيع أيار", en: "Born in May's Spring" },
                    { ar: "صانعةُ الحكاية والكلمة", en: "Storyteller of Words" },
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14, x: i % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: false, amount: 0.6 }}
                      transition={{ duration: 1.2, delay: i * 0.4 }}
                      className="flex items-center gap-4"
                    >
                      <RoseSVG className="w-5 h-5" />
                      <div>
                        <h2 className="font-['Marhey'] text-3xl md:text-5xl text-[hsl(var(--primary))] font-light glow-text">{line.ar}</h2>
                        <p className="font-serif text-sm md:text-base italic text-foreground/45 tracking-widest mt-1">{line.en}</p>
                      </div>
                      <RoseSVG className="w-5 h-5" />
                    </motion.div>
                  ))}
                </div>
                <ScrollHint label="القصيدة" />
              </section>

              {/* ===== Scene 5: Poem with central heart ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center px-6 relative">
                <FloatingPetals count={14} />
                <Sparkles count={20} />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rotate-slow w-[520px] h-[520px] rounded-full border border-[hsl(var(--rose))]/15" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="rotate-slow-rev w-[680px] h-[680px] rounded-full border border-[hsl(var(--primary))]/10" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 1.6 }}
                  className="relative z-10 mb-8"
                >
                  <BeatingHeart size={200} />
                </motion.div>

                <div className="max-w-2xl mx-auto space-y-5 text-center relative z-10">
                  <Subtitle text="يا قمرَ الجيزة الذي ما غاب" delay={0.1} className="font-sans text-xl md:text-2xl text-foreground/95 font-light leading-relaxed" />
                  <Subtitle text="يا فراشةً اختارت الليل مسرحاً" delay={0.5} className="font-sans text-xl md:text-2xl text-foreground/95 font-light leading-relaxed" />
                  <Subtitle text="وملكةً توّجت نفسها بلا عرش" delay={0.9} className="font-sans text-xl md:text-2xl text-foreground/95 font-light leading-relaxed" />
                  <Subtitle text="من تراب حوران الأسمر نسجتِ كبرياءكِ" delay={1.3} className="font-sans text-xl md:text-2xl text-foreground/95 font-light leading-relaxed" />
                  <Subtitle text="ومن وردِ نيسان غزلتِ ابتسامتكِ" delay={1.7} className="font-sans text-xl md:text-2xl text-foreground/95 font-light leading-relaxed" />
                  <Subtitle text="في صمتكِ حكاية ، وفي اختياركِ لنفسكِ ألف انتصار" delay={2.1} className="font-sans text-xl md:text-2xl shimmer-text font-light leading-relaxed" />
                </div>
                <ScrollHint label="أمنياتي لكِ" />
              </section>

              {/* ===== Scene 6: Wishes ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center px-6 relative">
                <FloatingPetals count={16} />
                <Sparkles count={16} />

                <div className="space-y-12 text-center relative z-10">
                  <Subtitle text="دامَ لكِ التاج" delay={0.2} className="font-['Marhey'] text-4xl md:text-6xl text-[hsl(var(--primary))]/90 glow-text" />
                  <Subtitle text="ودامتِ الفراشاتُ حولكِ" delay={0.8} className="font-['Marhey'] text-4xl md:text-6xl text-[hsl(var(--primary))]/90 glow-text" />
                  <Subtitle text="ودامَ الوردُ في طريقكِ" delay={1.4} className="font-['Marhey'] text-4xl md:text-6xl text-[hsl(var(--rose))]/90 glow-text" />
                  <Subtitle text="ودامَ القلبُ الذي اخترتِه" delay={2.0} className="font-['Marhey'] text-4xl md:text-6xl shimmer-text" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ delay: 2.6, duration: 1.2 }}
                    className="flex justify-center gap-6 items-center"
                  >
                    <RoseSVG className="w-10 h-10 drift" />
                    <HeartSVG className="w-14 h-14 text-[hsl(var(--rose))] heart-beat" />
                    <RoseSVG className="w-10 h-10 drift" />
                  </motion.div>
                </div>
                <ScrollHint label="باقة وردٍ لكِ" />
              </section>

              {/* ===== Scene 7: Roses bouquet ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center text-center relative px-6">
                <FloatingPetals count={20} />
                <Sparkles count={12} />

                <div className="relative z-10 max-w-2xl space-y-10">
                  <Subtitle
                    text="باقةُ وردٍ من قلبٍ يحبّكِ"
                    delay={0}
                    className="font-['Marhey'] text-3xl md:text-5xl shimmer-text glow-text"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.4 }}
                    transition={{ duration: 1.4, delay: 0.6 }}
                    className="flex justify-center items-end gap-3 md:gap-5"
                  >
                    {[44, 56, 72, 56, 44].map((s, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: s, height: s }}
                      >
                        <RoseSVG className="w-full h-full" />
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="space-y-5 mt-6">
                    <Subtitle
                      text="لكلِّ يومٍ من أيامكِ ، وردة"
                      delay={1.2}
                      className="font-sans text-lg md:text-2xl text-foreground/90 font-light"
                    />
                    <Subtitle
                      text="ولكلِّ ابتسامةٍ من ضحكاتكِ ، نجمة"
                      delay={1.8}
                      className="font-sans text-lg md:text-2xl text-foreground/90 font-light"
                    />
                    <Subtitle
                      text="ولكلِّ خطوةٍ تختارينها ، طريقٌ من نور"
                      delay={2.4}
                      className="font-sans text-lg md:text-2xl text-[hsl(var(--rose))]/95 font-light"
                    />
                  </div>
                </div>
                <ScrollHint label="التوقيع" />
              </section>

              {/* ===== Scene 8: Signature ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center text-center relative">
                <Sparkles count={20} />
                <FloatingPetals count={10} />

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col items-center space-y-6 relative z-10"
                >
                  <BeatingHeart size={130} />
                  <p className="font-sans text-base text-[hsl(var(--primary))]/75 tracking-[0.4em] mt-6">بكلّ الحُب</p>
                  <p
                    className="font-['Aref_Ruqaa'] text-6xl md:text-8xl shimmer-text mt-1"
                    style={{ transform: "rotate(-4deg)" }}
                  >
                    غدّوش
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-[hsl(var(--rose))]/80">
                    <RoseSVG className="w-5 h-5" />
                    <RoseSVG className="w-7 h-7" />
                    <RoseSVG className="w-5 h-5" />
                  </div>

                  <div className="mt-16">
                    <p className="font-sans text-[10px] text-[hsl(var(--primary))]/35 tracking-[0.4em]">
                      هدية رقمية · ٢٠٢٦
                    </p>
                  </div>
                </motion.div>
                <ScrollHint label="النهاية" />
              </section>

              {/* ===== Scene 9: End ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center text-center relative">
                <FloatingPetals count={6} />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.8 }}
                  transition={{ duration: 2 }}
                  onViewportEnter={() => {
                    const a = audioRef.current;
                    if (a && !a.paused) {
                      let vol = a.volume;
                      const fade = setInterval(() => {
                        vol -= 0.05;
                        if (vol <= 0.2) {
                          vol = 0.2;
                          clearInterval(fade);
                        }
                        a.volume = Math.max(0.2, vol);
                      }, 200);
                    }
                  }}
                  onViewportLeave={() => {
                    const a = audioRef.current;
                    if (a) a.volume = 0.85;
                  }}
                  className="relative z-10"
                >
                  <h2 className="font-['Marhey'] text-2xl text-[hsl(var(--primary))]/45 tracking-[1em] mr-[-1em]">نهاية</h2>

                  <button
                    onClick={() => {
                      document.querySelector(".film-container")?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-12 text-[hsl(var(--rose))]/70 hover:text-[hsl(var(--rose))] transition-colors font-sans text-xs tracking-widest uppercase flex flex-col items-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    إعادة
                  </button>
                </motion.div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
