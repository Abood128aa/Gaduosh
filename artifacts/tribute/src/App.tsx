import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import heroImage from "@assets/FB_IMG_1777583498554_1777583587493.jpg";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Icons / SVGs
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

const HeartSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CrownSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="none" className={className}>
    <path d="M10 50 L90 50 L95 20 L75 35 L50 10 L25 35 L5 20 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="50" cy="5" r="4" fill="currentColor" />
    <circle cx="5" cy="15" r="3" fill="currentColor" />
    <circle cx="95" cy="15" r="3" fill="currentColor" />
    <circle cx="25" cy="30" r="2.5" fill="currentColor" />
    <circle cx="75" cy="30" r="2.5" fill="currentColor" />
  </svg>
);

const ButterflySVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 45 C45 35 30 20 15 25 C5 28 10 45 25 55 C35 62 45 65 50 70 C55 65 65 62 75 55 C90 45 95 28 85 25 C70 20 55 35 50 45 Z" />
    <path d="M50 70 C45 80 35 90 25 85 C15 80 25 65 35 60 C40 58 45 58 50 55 C55 58 60 58 65 60 C75 65 85 80 75 85 C65 90 55 80 50 70 Z" opacity="0.7" />
  </svg>
);

// Animated Subtitle Component
const Subtitle = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {text}
    </motion.div>
  );
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Custom Cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // YouTube Setup
  useEffect(() => {
    if (!window.YT) return;
    
    if (!window.onYouTubeIframeAPIReady) {
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: "B6o7FtVXpcA",
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: "B6o7FtVXpcA",
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            mute: 1
          },
          events: {
            onReady: () => setPlayerReady(true),
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                // If it unmuted, it means we are really playing with sound
                if (!playerRef.current.isMuted()) setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            }
          }
        });
      };
    } else if (window.YT && window.YT.Player && !playerRef.current) {
      // If API was already ready
      window.onYouTubeIframeAPIReady();
    }
  }, []);

  const handleEnter = () => {
    setEntered(true);
    if (playerRef.current && playerReady) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <>
      <div 
        className="custom-cursor hidden md:block" 
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} 
      />
      
      <div className="film-grain" />
      <div className="vignette" />
      
      {/* Hidden YouTube Player */}
      <div id="youtube-player" className="fixed -top-10 -left-10 w-1 h-1 opacity-0 pointer-events-none" />

      <AnimatePresence>
        {!entered ? (
          <motion.div 
            key="gate"
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer"
            onClick={handleEnter}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 rounded-full bg-primary mb-8"
            />
            <h1 className="text-primary font-[Marhey] tracking-widest text-xl mb-4">ادخلي عالمكِ</h1>
            <div className="w-8 h-8 text-primary/70">
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
            <div className="fixed bottom-12 left-6 z-50 text-primary/60 hover:text-primary transition-colors cursor-pointer mix-blend-difference" onClick={toggleMute}>
              {isPlaying ? (
                <div className="w-5 h-5"><PauseIcon /></div>
              ) : (
                <div className="w-5 h-5"><PlayIcon /></div>
              )}
            </div>

            <div className="film-container">
              {/* Scene 1: Title Card */}
              <section className="film-scene flex flex-col items-center justify-center bg-black text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col items-center space-y-6"
                >
                  <p className="text-primary/70 font-sans tracking-[0.3em] text-sm uppercase">إهداء</p>
                  <h1 className="font-[Marhey] text-5xl md:text-7xl lg:text-9xl text-primary font-light tracking-wide">
                    إلى حُور
                  </h1>
                  <div className="w-12 h-[1px] bg-primary/40 mt-8" />
                  <p className="text-primary/40 font-sans text-xs tracking-widest mt-4">٣٠ نيسان ٢٠٢٦</p>
                </motion.div>
              </section>

              {/* Scene 2: Opening Image with Ken Burns */}
              <section className="film-scene bg-black relative overflow-hidden">
                <motion.div 
                  initial={{ scale: 1 }}
                  whileInView={{ scale: 1.15 }}
                  viewport={{ once: false }}
                  transition={{ duration: 15, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <img src={heroImage} alt="حور" className="w-full h-full object-cover object-center opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-20 opacity-80" />
                </motion.div>
                <div className="absolute bottom-24 left-0 w-full text-center z-30 px-6">
                  <Subtitle text="في حوران، حيث يولد التاج من ظلال البنات" className="font-sans text-lg md:text-xl text-primary/90 drop-shadow-md font-light" />
                </div>
              </section>

              {/* Scene 3: Her Quote */}
              <section className="film-scene flex flex-col items-center justify-center bg-black px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-12">
                  <Subtitle text="وفي النهاية ..." delay={0} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <Subtitle text="اخترتُ نفسي ..." delay={1.5} className="font-serif text-3xl md:text-5xl text-foreground" />
                  <Subtitle text="والنفوس عزيزة" delay={3} className="font-serif text-3xl md:text-5xl text-primary flex items-center justify-center gap-4">
                    <span>والنفوس عزيزة</span>
                    <HeartSVG className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  </Subtitle>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 5, duration: 2 }}
                    className="font-sans text-xs tracking-[0.2em] text-primary/50 mt-12"
                  >
                    — حُور
                  </motion.p>
                </div>
              </section>

              {/* Scene 4: Her Story / Identity */}
              <section className="film-scene bg-black relative flex items-center justify-center">
                <div className="absolute inset-0">
                  <img src={heroImage} className="w-full h-full object-cover opacity-10 blur-sm grayscale" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />
                </div>
                <div className="relative z-10 flex flex-col space-y-16 items-center text-center">
                  {[
                    { ar: "ابنةُ حوران", en: "Daughter of Hauran" },
                    { ar: "من جزعة، درعا", en: "From Jizzah, Dar'A" },
                    { ar: "وُلدت في ١٥ أيار", en: "Born May 15" },
                    { ar: "صانعة المحتوى", en: "Storyteller" }
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.8 }}
                      transition={{ duration: 1.5, delay: i * 0.5 }}
                      className="space-y-2"
                    >
                      <h2 className="font-['Marhey'] text-3xl md:text-5xl text-primary font-light">{line.ar}</h2>
                      <p className="font-serif text-sm md:text-base italic text-foreground/40 tracking-widest">{line.en}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Scene 5: The Poem */}
              <section className="film-scene bg-black flex flex-col items-center justify-center px-6 relative">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 0.15, y: 0 }}
                  transition={{ duration: 3 }}
                  className="absolute top-1/4"
                >
                  <ButterflySVG className="w-24 h-24 text-primary" />
                </motion.div>
                
                <div className="max-w-2xl mx-auto space-y-12 text-center relative z-10 mt-12">
                  <Subtitle text="يا فراشةً اختارت الليل مسرحاً" delay={0.2} className="font-sans text-xl md:text-3xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="وملكةً توجت نفسها بلا عرش" delay={0.6} className="font-sans text-xl md:text-3xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="من تراب حوران الأسمر نسجتِ كبرياءك" delay={1.0} className="font-sans text-xl md:text-3xl text-foreground/90 font-light leading-relaxed" />
                  <Subtitle text="في صمتك حكاية، وفي اختيارك لنفسك ألف انتصار" delay={1.4} className="font-sans text-xl md:text-3xl text-primary font-light leading-relaxed" />
                </div>
              </section>

              {/* Scene 6: Wishes */}
              <section className="film-scene bg-black flex flex-col items-center justify-center px-6">
                <div className="space-y-20 text-center">
                  <Subtitle text="دامَ لكِ التاج" delay={0.2} className="font-['Marhey'] text-4xl md:text-6xl text-primary/80" />
                  <Subtitle text="ودامتِ الفراشات حولكِ" delay={0.8} className="font-['Marhey'] text-4xl md:text-6xl text-primary/80" />
                  <Subtitle text="ودامَ القلبُ الذي اخترتِه" delay={1.4} className="font-['Marhey'] text-4xl md:text-6xl text-primary" />
                </div>
              </section>

              {/* Scene 7: Closing */}
              <section className="film-scene bg-black flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col items-center space-y-8"
                >
                  <CrownSVG className="w-12 h-12 text-primary" />
                  <p className="font-sans text-lg text-primary/60 tracking-widest">بكل الحب</p>
                  <p className="font-['Aref_Ruqaa'] text-5xl md:text-7xl text-foreground mt-4" style={{ transform: "rotate(-5deg)" }}>حُور</p>
                  <div className="mt-24">
                    <p className="font-sans text-[10px] text-primary/30 tracking-[0.3em]">هدية رقمية · ٢٠٢٦</p>
                  </div>
                </motion.div>
              </section>

              {/* Scene 8: End Card */}
              <section className="film-scene bg-black flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.8 }}
                  transition={{ duration: 2 }}
                  onViewportEnter={() => {
                    // Fade out music slightly
                    if (playerRef.current && isPlaying) {
                      let vol = 100;
                      const fade = setInterval(() => {
                        vol -= 5;
                        if (vol <= 20) clearInterval(fade);
                        playerRef.current.setVolume(vol);
                      }, 200);
                    }
                  }}
                  onViewportLeave={() => {
                    if (playerRef.current && isPlaying) {
                      playerRef.current.setVolume(100);
                    }
                  }}
                >
                  <h2 className="font-['Marhey'] text-2xl text-primary/40 tracking-[1em] mr-[-1em]">نهاية</h2>
                  
                  <button 
                    onClick={() => {
                      document.querySelector('.film-container')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-12 text-primary/50 hover:text-primary transition-colors font-sans text-xs tracking-widest uppercase flex flex-col items-center gap-2"
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