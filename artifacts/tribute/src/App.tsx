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

/* ==================== Big Beating Heart ==================== */
const BeatingHeart = ({ size = 240 }: { size?: number }) => (
  <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
    {/* expanding rings */}
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/15 heart-pulse-ring" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/15 heart-pulse-ring delay-1" />
    <span className="absolute inset-0 rounded-full bg-[hsl(var(--rose))]/15 heart-pulse-ring delay-2" />

    {/* halo */}
    <span
      className="absolute inset-0 rounded-full"
      style={{
        background:
          "radial-gradient(circle, hsl(345 75% 60% / 0.55) 0%, transparent 65%)",
        filter: "blur(20px)",
      }}
    />

    {/* the heart */}
    <svg
      viewBox="0 0 100 100"
      className="heart-beat relative z-10"
      style={{ width: "70%", height: "70%" }}
    >
      <defs>
        <radialGradient id="heartGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffd1dc" />
          <stop offset="35%" stopColor="hsl(345 80% 65%)" />
          <stop offset="100%" stopColor="hsl(345 70% 38%)" />
        </radialGradient>
        <linearGradient id="heartStroke" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="hsl(35 80% 70%)" />
          <stop offset="100%" stopColor="hsl(345 70% 50%)" />
        </linearGradient>
      </defs>
      <path
        d="M50 86 C 18 62, 6 44, 6 28 C 6 14, 18 6, 30 6 C 40 6, 47 12, 50 20 C 53 12, 60 6, 70 6 C 82 6, 94 14, 94 28 C 94 44, 82 62, 50 86 Z"
        fill="url(#heartGrad)"
        stroke="url(#heartStroke)"
        strokeWidth="1.5"
      />
      {/* highlight */}
      <ellipse cx="34" cy="26" rx="9" ry="6" fill="#fff" opacity="0.45" />
    </svg>
  </div>
);

/* ==================== Floating Hearts Layer ==================== */
const FloatingHearts = ({ count = 14 }: { count?: number }) => {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 22,
        duration: 14 + Math.random() * 16,
        delay: Math.random() * 12,
        opacity: 0.25 + Math.random() * 0.45,
        hue: Math.random() > 0.5 ? "hsl(var(--rose))" : "hsl(var(--primary))",
        key: i,
      })),
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
            bottom: "-40px",
            width: it.size,
            height: it.size,
            color: it.hue,
            opacity: it.opacity,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            filter: "drop-shadow(0 0 8px currentColor)",
          }}
        >
          <HeartSVG className="w-full h-full" />
        </span>
      ))}
    </div>
  );
};

/* ==================== Sparkles Layer ==================== */
const Sparkles = ({ count = 30 }: { count?: number }) => {
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

/* ==================== Animated Subtitle ==================== */
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
    viewport={{ once: false, amount: 0.5 }}
    transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {text}
  </motion.div>
);

/* ==================== Reveal name letter-by-letter ==================== */
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

  // Spawn a burst of hearts at click position (extra delight)
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
            <FloatingHearts count={8} />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="mb-10"
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
              className="fixed bottom-12 left-6 z-50 text-[hsl(var(--rose))]/80 hover:text-[hsl(var(--rose))] transition-colors cursor-pointer"
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

              {/* ===== Scene 1: Title with giant beating heart ===== */}
              <section className="film-scene flex flex-col items-center justify-center bg-transparent text-center">
                <Sparkles count={28} />
                <FloatingHearts count={12} />

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.4 }}
                  transition={{ duration: 1.8 }}
                  className="relative z-10 flex flex-col items-center space-y-7"
                  onClick={handleHeartClick}
                >
                  {/* Bursts */}
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

                  <div className="flex items-center gap-3 text-[hsl(var(--rose))]/70">
                    <span className="block w-10 h-[1px] bg-[hsl(var(--rose))]/50" />
                    <HeartSVG className="w-3 h-3" />
                    <span className="block w-10 h-[1px] bg-[hsl(var(--rose))]/50" />
                  </div>
                  <p className="text-[hsl(var(--primary))]/50 font-sans text-xs tracking-[0.4em]">٣٠ نيسان ٢٠٢٦</p>
                </motion.div>
              </section>

              {/* ===== Scene 2: Hero image with Ken Burns + sparkles ===== */}
              <section className="film-scene bg-black relative overflow-hidden">
                <motion.div
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.18 }}
                  viewport={{ once: false }}
                  transition={{ duration: 18, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img src={heroImage} alt="غدوش" className="w-full h-full object-cover object-center opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-20 opacity-90" />
                  <div className="absolute inset-0 z-20" style={{
                    background: "radial-gradient(circle at center, transparent 30%, hsl(345 50% 5% / 0.6) 90%)",
                  }} />
                </motion.div>

                <Sparkles count={18} />

                {/* Floating mini hearts around the photo */}
                {[
                  { top: "18%", left: "12%", delay: 0 },
                  { top: "30%", left: "82%", delay: 0.6 },
                  { top: "62%", left: "8%",  delay: 1.2 },
                  { top: "70%", left: "85%", delay: 1.8 },
                ].map((h, i) => (
                  <motion.div
                    key={i}
                    className="absolute z-30 text-[hsl(var(--rose))] drift"
                    style={{ top: h.top, left: h.left, filter: "drop-shadow(0 0 10px currentColor)" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 0.85, scale: 1 }}
                    transition={{ delay: h.delay, duration: 1.4 }}
                  >
                    <HeartSVG className="w-7 h-7 heart-beat" />
                  </motion.div>
                ))}

                <div className="absolute bottom-24 left-0 w-full text-center z-30 px-6">
                  <Subtitle
                    text="في حوران، تولد البنات تيجاناً"
                    className="font-sans text-xl md:text-2xl text-[hsl(var(--foreground))] drop-shadow-md font-light glow-text"
                  />
                </div>
              </section>

              {/* ===== Scene 3: Quote ===== */}
              <section className="film-scene flex flex-col items-center justify-center bg-transparent px-6 text-center relative">
                <FloatingHearts count={6} />
                <Sparkles count={14} />
                <div className="max-w-2xl mx-auto space-y-10 relative z-10">
                  <Subtitle text="وفي النهاية ..." delay={0} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <Subtitle text="اخترتُ نفسي ..." delay={1.2} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <motion.div
                    initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 1.4, delay: 2.4, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-3xl md:text-5xl shimmer-text flex items-center justify-center gap-4"
                  >
                    <span>والنفوس عزيزة</span>
                    <HeartSVG className="w-7 h-7 md:w-9 md:h-9 text-[hsl(var(--rose))] heart-beat" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 2 }}
                    className="font-sans text-xs tracking-[0.4em] text-[hsl(var(--primary))]/60 mt-12"
                  >
                    — غدّوش
                  </motion.p>
                </div>
              </section>

              {/* ===== Scene 4: Identity (bilingual) ===== */}
              <section className="film-scene bg-transparent relative flex items-center justify-center">
                <div className="absolute inset-0">
                  <img src={heroImage} className="w-full h-full object-cover opacity-15 blur-md grayscale" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
                </div>
                <Sparkles count={12} />

                <div className="relative z-10 flex flex-col space-y-12 items-center text-center">
                  {[
                    { ar: "ابنةُ حوران", en: "Daughter of Hauran" },
                    { ar: "من جزعة، درعا", en: "From Jizzah · Dar'A" },
                    { ar: "وُلدت في ١٥ أيار", en: "Born May 15" },
                    { ar: "صانعة الحكاية", en: "Storyteller" },
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14, x: i % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, y: 0, x: 0 }}
                      viewport={{ once: false, amount: 0.7 }}
                      transition={{ duration: 1.2, delay: i * 0.4 }}
                      className="flex items-center gap-4"
                    >
                      <HeartSVG className="w-3 h-3 text-[hsl(var(--rose))]" />
                      <div>
                        <h2 className="font-['Marhey'] text-3xl md:text-5xl text-[hsl(var(--primary))] font-light glow-text">{line.ar}</h2>
                        <p className="font-serif text-sm md:text-base italic text-foreground/40 tracking-widest mt-1">{line.en}</p>
                      </div>
                      <HeartSVG className="w-3 h-3 text-[hsl(var(--rose))]" />
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* ===== Scene 5: Heart-Centered Poem ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center px-6 relative">
                <FloatingHearts count={10} />
                <Sparkles count={20} />

                {/* Halo behind the heart */}
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
                  className="relative z-10 mb-10"
                >
                  <BeatingHeart size={200} />
                </motion.div>

                <div className="max-w-2xl mx-auto space-y-7 text-center relative z-10">
                  <Subtitle text="يا فراشةً اختارت الليل مسرحاً" delay={0.1} className="font-sans text-xl md:text-2xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="وملكةً توّجت نفسها بلا عرش" delay={0.5} className="font-sans text-xl md:text-2xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="من تراب حوران الأسمر نسجتِ كبرياءكِ" delay={0.9} className="font-sans text-xl md:text-2xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="في صمتكِ حكاية، وفي اختياركِ لنفسك ألف انتصار" delay={1.3} className="font-sans text-xl md:text-2xl shimmer-text font-light leading-relaxed" />
                </div>
              </section>

              {/* ===== Scene 6: Wishes ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center px-6 relative">
                <FloatingHearts count={14} />
                <Sparkles count={16} />

                <div className="space-y-16 text-center relative z-10">
                  <Subtitle text="دامَ لكِ التاج" delay={0.2} className="font-['Marhey'] text-4xl md:text-6xl text-[hsl(var(--primary))]/85 glow-text" />
                  <Subtitle text="ودامتِ الفراشاتُ حولكِ" delay={0.8} className="font-['Marhey'] text-4xl md:text-6xl text-[hsl(var(--primary))]/85 glow-text" />
                  <Subtitle text="ودامَ القلبُ الذي اخترتِه" delay={1.4} className="font-['Marhey'] text-4xl md:text-6xl shimmer-text" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ delay: 2, duration: 1.2 }}
                    className="flex justify-center"
                  >
                    <HeartSVG className="w-14 h-14 text-[hsl(var(--rose))] heart-beat" />
                  </motion.div>
                </div>
              </section>

              {/* ===== Scene 7: Signature ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center text-center relative">
                <Sparkles count={18} />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col items-center space-y-6 relative z-10"
                >
                  <BeatingHeart size={120} />
                  <p className="font-sans text-base text-[hsl(var(--primary))]/70 tracking-[0.4em] mt-6">بكلّ الحُب</p>
                  <p
                    className="font-['Aref_Ruqaa'] text-6xl md:text-8xl shimmer-text mt-2"
                    style={{ transform: "rotate(-4deg)" }}
                  >
                    غدّوش
                  </p>
                  <div className="mt-20">
                    <p className="font-sans text-[10px] text-[hsl(var(--primary))]/30 tracking-[0.4em]">
                      هدية رقمية · ٢٠٢٦
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* ===== Scene 8: End ===== */}
              <section className="film-scene bg-transparent flex flex-col items-center justify-center text-center relative">
                <FloatingHearts count={6} />
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
                  <h2 className="font-['Marhey'] text-2xl text-[hsl(var(--primary))]/40 tracking-[1em] mr-[-1em]">نهاية</h2>

                  <button
                    onClick={() => {
                      document.querySelector(".film-container")?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="mt-12 text-[hsl(var(--rose))]/60 hover:text-[hsl(var(--rose))] transition-colors font-sans text-xs tracking-widest uppercase flex flex-col items-center gap-2"
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
