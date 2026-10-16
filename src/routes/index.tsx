import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

// Self-hosted, compressed clips in public/videos — work on any host (Lovable, Vercel, Netlify).
const v1 = { url: "/videos/v1.mp4" };
const v2 = { url: "/videos/v2.mp4" };
const v3 = { url: "/videos/v3.mp4" };
const v12 = { url: "/videos/v1-2.mp4" };
const v22 = { url: "/videos/v2-2.mp4" };
const v32 = { url: "/videos/v3-2.mp4" };

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cinematic — Product Films Never Filmed" },
      { name: "description", content: "A cinematic agency crafting product ads frame by frame — made to stop people mid-scroll." },
      { property: "og:title", content: "Cinematic — Product Films Never Filmed" },
      { property: "og:description", content: "Cinematic product advertisements for brands and product businesses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Vid({ src, className = "" }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!el.src) el.src = src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function Ticker() {
  const items = Array.from({ length: 8 }, () => "CINEMATIC PRODUCT ADS ✦ BRAND FILMS ✦ ");
  return (
    <div className="relative flex h-11 items-center overflow-hidden bg-accent text-accent-foreground">
      <div className="ticker-track flex whitespace-nowrap font-display text-sm tracking-[0.15em]">
        <span className="pr-2">{items.join("")}</span>
        <span className="pr-2">{items.join("")}</span>
      </div>
    </div>
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }, { default: SplitType }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
        import("split-type"),
      ]);
      gsap.registerPlugin(ScrollTrigger);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const lenis = new Lenis({ autoRaf: true });
      lenis.on("scroll", ScrollTrigger.update);
      const onUnload = () => lenis.destroy();
      window.addEventListener("beforeunload", onUnload);

      // Nav
      const n = nav.current!;
      gsap.set(n, { autoAlpha: 0, y: 0 });
      const navST = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          if (y < 80) gsap.to(n, { autoAlpha: 0, duration: 0.3 });
          else if (self.direction === 1) gsap.to(n, { autoAlpha: 1, yPercent: -120, duration: 0.4, ease: "power2.out" });
          else gsap.to(n, { autoAlpha: 1, yPercent: 0, duration: 0.4, ease: "power2.out" });
        },
      });

      const ctx = gsap.context(() => {
        if (reduce) return;
        // Hero
        const split = new SplitType(".hero-line", { types: "chars" });
        const tl = gsap.timeline();
        tl.from(".hero-eyebrow", { opacity: 0, y: 10, duration: 0.6 })
          .from(split.chars, { y: 80, opacity: 0, stagger: 0.025, ease: "power4.out", duration: 1 }, "-=0.4")
          .from(".hero-sub", { opacity: 0, duration: 0.8 }, "+=0.4");
        gsap.from(".hero-card", { y: 40, opacity: 0, stagger: 0.15, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el, i) =>
          gsap.to(el, { y: -12, duration: 4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: i * 0.6 }),
        );

        gsap.from(".never-word", {
          x: -60, opacity: 0, stagger: 0.12, ease: "power3.out", duration: 1,
          scrollTrigger: { trigger: ".never", start: "top 60%" },
        });
        gsap.from(".iconic-card", {
          y: 60, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".iconic", start: "top 60%" },
        });
        gsap.from(".lit-card", {
          y: 80, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".lit", start: "top 60%" },
        });
        const cta = new SplitType(".cta-head", { types: "words" });
        gsap.from(cta.words, {
          y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".cta", start: "top 65%" },
        });
      }, root);

      cleanup = () => {
        ctx.revert();
        navST.kill();
        lenis.destroy();
        window.removeEventListener("beforeunload", onUnload);
      };
    })();
    return () => cleanup();
  }, []);


  return (
    <div ref={root} className="overflow-x-hidden bg-background text-foreground">
      {/* Nav */}
      <nav
        ref={nav}
        className="invisible fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-background/60 px-6 py-4 backdrop-blur-md md:px-10"
      >
        <span className="font-display text-2xl tracking-[0.04em]">CINEMATIC</span>
      </nav>

      {/* Hero */}
      <section className="hero-bg relative flex min-h-[100dvh] flex-col items-center justify-end px-6 pb-[10vh] text-center">
        <div className="pointer-events-none absolute inset-y-0 right-[4vw] hidden w-[30vw] items-center lg:flex">
          {[{ s: v2.url, r: "-4deg", c: "top-[14%] left-0" }, { s: v22.url, r: "2deg", c: "top-[24%] left-[34%]" }, { s: v1.url, r: "6deg", c: "top-[10%] left-[66%]" }].map((c, i) => (
            <div key={i} className={`hero-card absolute ${c.c}`}>
              <div className="hero-float">
                <div style={{ rotate: c.r }} className="aspect-[9/16] w-[10vw] overflow-hidden rounded-card border border-border opacity-80">
                  <Vid src={c.s} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="hero-eyebrow mb-8 border border-border px-3.5 py-1 text-[10px] uppercase tracking-[0.22em]">
            [ Cinematic Agency ]
          </span>
          <h1 className="display">
            <span className="hero-line block">CINEMA</span>
            <span className="hero-line block">
              <span className="opacity-25">WITHOUT</span> LIMITS.
            </span>
          </h1>
          <p className="hero-sub mt-8 text-muted-foreground">
            Product films, crafted frame by frame — made to stop people mid-scroll.
          </p>
        </div>
      </section>

      <Ticker />

      {/* Never filmed */}
      <section className="never relative min-h-[100dvh] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4">
          {[v12.url, v3.url, v22.url, v32.url].map((s, i) => (
            <div key={i} className={`relative overflow-hidden border-r border-border ${i > 1 ? "hidden md:block" : ""}`}>
              <Vid src={s} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <h2 className="display absolute bottom-[8vh] left-6 md:left-10">
          <span className="never-word block">FILMS</span>
          <span className="never-word block">THAT WERE</span>
          <span className="never-word block text-red">NEVER FILMED</span>
        </h2>
      </section>

      {/* Iconic */}
      <section className="iconic relative flex min-h-[100dvh] items-center bg-surface-3 px-6 py-24 md:px-10">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <h2 className="font-medium leading-[1.05] text-[clamp(2.2rem,4.5vw,4.5rem)]">
            Make the product
            <br />
            <em className="text-muted-foreground">feel iconic.</em>
          </h2>
          <div className="grid grid-cols-[1.2fr_1fr] gap-4">
            <div className="iconic-card aspect-[9/16] overflow-hidden rounded-card border border-border">
              <Vid src={v22.url} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="iconic-card aspect-[4/3] overflow-hidden rounded-card border border-border">
                <Vid src={v3.url} />
              </div>
              <div className="iconic-card aspect-[4/3] overflow-hidden rounded-card border border-border">
                <Vid src={v32.url} />
              </div>
              <div className="iconic-card aspect-[4/3] overflow-hidden rounded-card border border-border">
                <Vid src={v1.url} />
              </div>
            </div>
          </div>
        </div>
        <span className="absolute bottom-8 right-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:right-10">
          Cinematic studio. One product world.
        </span>
      </section>

      {/* Lit like cinema */}
      <section className="lit min-h-[100dvh] bg-background">
        <Ticker />
        <div className="grid items-center gap-14 px-6 py-24 md:px-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="display">
              PRODUCTS,
              <br />
              LIT LIKE
              <br />
              CINEMA
            </h2>
            <p className="mt-8 max-w-md text-muted-foreground">
              Fragrance and beauty spots, luxury food, fashion and goods — cinematically shot and crafted.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[{ s: v2.url, l: "Product Film" }, { s: v12.url, l: "Bottle Macro" }, { s: v22.url, l: "Name Engraving" }].map((c) => (
              <figure key={c.l} className="lit-card">
                <div className="aspect-[9/16] overflow-hidden rounded-card border border-border">
                  <Vid src={c.s} />
                </div>
                <figcaption className="mono-label mt-3 text-muted-foreground">{c.l}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What we create */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center bg-surface px-6 py-24">
        <div className="w-full max-w-3xl">
          <p className="mono-label mb-6 text-right text-accent">What we create</p>
          <h2 className="text-center font-medium leading-[1.08] text-[clamp(2rem,4vw,4rem)]">
            One format.
            <br />
            One cinematic standard.
          </h2>
          <div className="svc-card mx-auto mt-14 max-w-sm rounded-card border border-border bg-surface-2 p-10">
            <svg viewBox="0 0 48 48" className="h-12 w-12 text-accent" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="6" y="6" width="36" height="36" />
              <path className="diamond" d="M24 10 L38 24 L24 38 L10 24 Z" />
            </svg>
            <h3 className="mt-6 text-xl font-medium">Product Ads</h3>
            <p className="mt-2 text-muted-foreground">Cinematically produced visuals built around the object.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="cta flex min-h-[60vh] flex-col items-center justify-center bg-accent px-6 py-24 text-center text-accent-foreground">
        <p className="mb-6 text-[10px] uppercase tracking-[0.2em] text-ink-faint">Your business · The next film</p>
        <h2 className="cta-head font-medium leading-[1.02] text-[clamp(2.4rem,5vw,5.5rem)]">
          Let's make
          <br />
          something <em>unskippable.</em>
        </h2>
        <p className="mt-6 text-base text-ink-soft">Tell us what you sell and show the world.</p>
      </section>
    </div>
  );
}
