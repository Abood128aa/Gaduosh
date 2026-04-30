import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

// Import the specific hero image
import heroImage from "@assets/FB_IMG_1777583498554_1777583587493.jpg";

const queryClient = new QueryClient();

// SVG Components
const ButterflySVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    <path d="M50 45 C45 35 30 20 15 25 C5 28 10 45 25 55 C35 62 45 65 50 70 C55 65 65 62 75 55 C90 45 95 28 85 25 C70 20 55 35 50 45 Z" />
    <path d="M50 70 C45 80 35 90 25 85 C15 80 25 65 35 60 C40 58 45 58 50 55 C55 58 60 58 65 60 C75 65 85 80 75 85 C65 90 55 80 50 70 Z" opacity="0.8" />
    <path d="M48 20 C48 30 49 40 50 50 C51 40 52 30 52 20 C52 15 48 15 48 20 Z" fill="#b89b5c" />
    <circle cx="50" cy="15" r="2" fill="#b89b5c" />
  </svg>
);

const CrownSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 60" fill="currentColor" className={className}>
    <path d="M10 50 L90 50 L95 20 L75 35 L50 10 L25 35 L5 20 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="50" cy="5" r="3" />
    <circle cx="5" cy="15" r="2" />
    <circle cx="95" cy="15" r="2" />
    <circle cx="25" cy="30" r="2" />
    <circle cx="75" cy="30" r="2" />
  </svg>
);

// Floating Butterfly Component
const FloatingButterfly = ({ delay, duration, startX, endX, startY, endY, scale = 1 }: any) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-20 text-primary opacity-30"
      initial={{ x: startX, y: startY, scale, rotate: 0, opacity: 0 }}
      animate={{
        x: endX,
        y: endY,
        rotate: [0, 10, -10, 5, 0],
        opacity: [0, 0.4, 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <ButterflySVG className="w-8 h-8" />
    </motion.div>
  );
};

// Scroll Reveal Component
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

function Home() {
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);

  // Ambient particles
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number; duration: number }>>([]);
  
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Ambient background particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-primary/20 blur-[1px]"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-center pt-20 pb-10 px-4 z-10">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none"
        >
          <div className="relative w-full max-w-4xl aspect-[3/4] md:aspect-square overflow-hidden rounded-full mix-blend-screen opacity-60 blur-sm">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-10" />
             <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
             <img 
               src={heroImage} 
               alt="Silhouette" 
               className="w-full h-full object-cover object-center"
             />
          </div>
        </motion.div>

        <div className="relative z-10 text-center flex flex-col items-center max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative"
          >
            <CrownSVG className="w-16 h-10 mx-auto text-primary mb-6 drop-shadow-[0_0_15px_rgba(201,154,60,0.5)]" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8 rounded-full overflow-hidden border border-primary/20 p-2 backdrop-blur-sm">
              <div className="w-full h-full rounded-full overflow-hidden relative shadow-[0_0_40px_rgba(201,154,60,0.15)]">
                 <img 
                   src={heroImage} 
                   alt="حُور" 
                   className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-primary/90 to-primary/40 drop-shadow-lg tracking-wider">
              حُور
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl font-serif text-foreground/80 max-w-lg mt-6 leading-relaxed"
          >
            ملكة بلا عرش، تاجها من نور، وابنة حوران التي يفوح منها عطر درعا.
          </motion.p>
        </div>

        {/* Floating Butterflies in Hero */}
        <FloatingButterfly delay={0} duration={15} startX="-20vw" endX="120vw" startY="20vh" endY="-10vh" scale={1.5} />
        <FloatingButterfly delay={5} duration={20} startX="120vw" endX="-20vw" startY="60vh" endY="10vh" scale={1} />
        <FloatingButterfly delay={2} duration={18} startX="50vw" endX="-20vw" startY="80vh" endY="30vh" scale={0.8} />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* The Quote Section */}
      <section className="relative py-24 md:py-32 px-4 z-10 bg-gradient-to-b from-background via-primary/5 to-background">
        <FadeIn className="max-w-4xl mx-auto text-center relative">
          <div className="absolute -top-10 -left-10 md:-left-20 text-9xl text-primary/10 font-serif leading-none font-bold select-none">"</div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight md:leading-tight text-white drop-shadow-md">
            وفي النهاية اخترت نفسي <br/>
            والنفوس عزيزة
            <Heart className="inline-block w-8 h-8 md:w-12 md:h-12 ml-4 text-primary fill-primary drop-shadow-[0_0_10px_rgba(201,154,60,0.5)]" strokeWidth={1} />
          </h2>
          <div className="absolute -bottom-20 -right-10 md:-right-20 text-9xl text-primary/10 font-serif leading-none font-bold select-none">"</div>
        </FadeIn>
      </section>

      {/* Poetry / Dedication Section */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-24">
          <FadeIn delay={0.2}>
            <div className="text-center space-y-6">
              <CrownSVG className="w-8 h-6 mx-auto text-primary/60" />
              <p className="text-2xl md:text-4xl font-serif leading-relaxed text-foreground/90">
                يا من نسجتِ من العتمة خيوطاً من ذهب، ومن الصمتِ حكايةً لا تُنسى. أنتِ كما اخترتِ نفسكِ، نحن اخترناكِ أيضاً لتكوني النبض والروح.
              </p>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <div className="text-center space-y-6">
              <ButterflySVG className="w-8 h-8 mx-auto text-primary/60" />
              <p className="text-2xl md:text-4xl font-serif leading-relaxed text-foreground/90">
                في كل فراشةٍ ترفرف، نرى طيفكِ الحالم. وفي كل تاجٍ، نلمحُ كبرياءكِ الهادئ. ابنة الجيزة الأصيلة، التي جعلت من البساطة عمقاً، ومن الرقة قوة.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24 px-4 relative z-10 bg-card/30 backdrop-blur-sm border-y border-border/50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h3 className="text-3xl md:text-4xl font-serif text-center mb-16 text-primary">نبض الحكاية</h3>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "الجذور", value: "درعا، الجيزة، سوريا", icon: "🌿" },
              { label: "الميلاد", value: "15 أيار 1996", icon: "✨" },
              { label: "الشغف", value: "منشئ محتوى رقمي", icon: "📱" },
              { label: "اللون الملكي", value: "الأسود الأنيق", icon: "🖤" }
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div className="group relative p-8 rounded-2xl bg-background/50 border border-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    {/* Using simple decorative text/symbols instead of standard emojis to match the vibe, except for the last one where we replace it with an SVG */}
                    {item.icon === "🖤" ? (
                      <Heart className="w-8 h-8 text-primary fill-background stroke-primary" />
                    ) : item.icon === "🌿" ? (
                      <div className="text-primary/70 text-2xl font-serif">~</div>
                    ) : item.icon === "✨" ? (
                      <div className="text-primary/70 text-2xl font-serif">*</div>
                    ) : (
                      <div className="text-primary/70 text-2xl font-serif">❖</div>
                    )}
                    
                    <h4 className="text-sm uppercase tracking-widest text-primary/80 font-bold">{item.label}</h4>
                    <p className="text-xl font-serif text-foreground">{item.value}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Wishes Section */}
      <section className="py-24 px-4 relative z-10">
        <FadeIn className="max-w-2xl mx-auto text-center bg-gradient-to-b from-primary/10 to-transparent p-12 rounded-3xl border border-primary/20 shadow-[0_0_50px_rgba(201,154,60,0.05)]">
          <CrownSVG className="w-10 h-8 mx-auto text-primary mb-8" />
          <h3 className="text-3xl font-serif text-white mb-8">دعاء وأمنيات</h3>
          <p className="text-xl md:text-2xl font-serif text-foreground/80 leading-relaxed space-y-4">
            لتبقَ روحكِ حرة كالفراشات، وعالية كالتيجان. 
            <br/><br/>
            نتمنى لكِ أياماً تليق بقلبكِ، ومستقبلاً يشرق كوجهكِ، وأن تظلي دائماً وأبداً.. تختارين نفسكِ، لأنكِ تستحقين كل الحب.
          </p>
        </FadeIn>
      </section>

      {/* Signature Section */}
      <section className="py-20 px-4 relative z-10 flex flex-col items-center justify-center">
        <FadeIn className="text-center space-y-6">
          <div className="w-16 h-[1px] bg-primary/40 mx-auto" />
          <CrownSVG className="w-6 h-5 mx-auto text-primary/80" />
          <div className="font-serif">
            <p className="text-primary/80 text-lg">بكل الحب · هدية خاصة لكِ</p>
            <p className="text-muted-foreground text-sm mt-2 font-sans tracking-widest">30 نيسان 2026</p>
          </div>
        </FadeIn>
      </section>

    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
