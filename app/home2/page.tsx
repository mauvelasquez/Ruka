"use client";

import { useEffect, useRef } from "react";
import { Playfair_Display, Montserrat } from "next/font/google";
import s from "./home2.module.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

// ─── Inline SVG leaf shapes ──────────────────────────────────
function Leaf({ width = 80, color = "#99B080", opacity = 0.7 }: { width?: number; color?: string; opacity?: number }) {
  return (
    <svg width={width} height={width * 1.6} viewBox="0 0 80 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M40 4C40 4 72 28 72 64C72 100 40 124 40 124C40 124 8 100 8 64C8 28 40 4 40 4Z"
        fill={color}
        fillOpacity={opacity * 0.35}
        stroke={color}
        strokeOpacity={opacity * 0.6}
        strokeWidth="1"
      />
      <path
        d="M40 12L40 116"
        stroke={color}
        strokeOpacity={opacity * 0.4}
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path d="M40 30L56 48" stroke={color} strokeOpacity={opacity * 0.25} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M40 30L24 48" stroke={color} strokeOpacity={opacity * 0.25} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M40 50L62 68" stroke={color} strokeOpacity={opacity * 0.25} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M40 50L18 68" stroke={color} strokeOpacity={opacity * 0.25} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M40 72L58 88" stroke={color} strokeOpacity={opacity * 0.2} strokeWidth="0.5" strokeLinecap="round" />
      <path d="M40 72L22 88" stroke={color} strokeOpacity={opacity * 0.2} strokeWidth="0.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight({ size = 16, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTarget({ color = "#99B080" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <line x1="12" y1="3" x2="12" y2="1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="23" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="12" x2="1" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="23" y1="12" x2="21" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconArch({ color = "#1A2E1D" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20V12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 20H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function IconBalance({ color = "#2D4B32" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="20" x2="18" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4L4 10L12 10" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M12 4L20 10L12 10" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="4" cy="13" r="2.5" stroke={color} strokeWidth="1.5" />
      <circle cx="20" cy="13" r="2.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function IconEarth({ color = "#8B5E3C" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <path d="M3 12C3 12 7 9 12 12C17 15 21 12 21 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3C12 3 9 7 9 12C9 17 12 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3C12 3 15 7 15 12C15 17 12 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const VALUES = [
  {
    icon: <IconTarget color="#2D4B32" />,
    iconBg: s.iconSage,
    title: "Gratuito siempre",
    desc: "Sin tarifas de plataforma ni comisiones ocultas. Rukka funciona con confianza, no con dinero.",
  },
  {
    icon: <IconArch color="#1A2E1D" />,
    iconBg: s.iconMoss,
    title: "Hogares verificados",
    desc: "Cada hogar pasa por un proceso de verificación real: identidad, fotos y reputación.",
  },
  {
    icon: <IconBalance color="#2D4B32" />,
    iconBg: s.iconForest,
    title: "Intercambio justo",
    desc: "El sistema de Yankis equilibra intercambios asimétricos sin necesidad de viaje simultáneo.",
  },
  {
    icon: <IconEarth color="#8B5E3C" />,
    iconBg: s.iconEarth,
    title: "Raíces locales",
    desc: "Viajas a hogares reales, no hoteles. La experiencia de vivir donde vive la gente.",
  },
];

const HOMES = [
  {
    city: "Valparaíso",
    country: "Chile",
    label: "Hogar frente al mar",
    texture: s.cardTexture1,
  },
  {
    city: "Buenos Aires",
    country: "Argentina",
    label: "Palermo, planta alta",
    texture: s.cardTexture2,
  },
  {
    city: "Ciudad de México",
    country: "México",
    label: "Condesa, jardín propio",
    texture: s.cardTexture3,
  },
  {
    city: "Barcelona",
    country: "España",
    label: "Gràcia, luminoso",
    texture: s.cardTexture1,
  },
];

const TESTIMONIALS = [
  {
    quote: "Pasé dos semanas en el departamento de Daniela en Valparaíso. Era exactamente lo que necesitaba: auténtico, sin complicaciones, sin costo.",
    name: "Andrea M.",
    location: "Santiago, Chile",
    avatarClass: s.avatar1,
  },
  {
    quote: "Por fin un intercambio donde la reciprocidad tiene sentido. Los Yankis me permiten viajar en mis propios tiempos, no en los de otra persona.",
    name: "Tomás R.",
    location: "Buenos Aires, Argentina",
    avatarClass: s.avatar2,
  },
  {
    quote: "Rukka me hizo entender que mis huéspedes son personas reales viajando con propósito. Eso cambia todo.",
    name: "María F.",
    location: "Ciudad de México",
    avatarClass: s.avatar3,
  },
];

const HOW_STEPS = [
  {
    n: "01",
    title: "Publicá tu hogar",
    desc: "Describe tu espacio con fotos reales y los períodos en que está disponible. Sin mínimos, sin compromisos.",
  },
  {
    n: "02",
    title: "Conectá con viajeros",
    desc: "Rukka te muestra intercambios compatibles. Conversá, conocé a la persona y decidí con tranquilidad.",
  },
  {
    n: "03",
    title: "Viajá y recibí",
    desc: "Los Yankis equilibran la asimetría del tiempo. Podés viajar cuando quieras, no cuando otros también puedan.",
  },
];

// ─── Main component ─────────────────────────────────────────
export default function Home2() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.visible);
          }
        });
      },
      { threshold: 0.12 }
    );

    fadeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addFadeRef = (i: number) => (el: HTMLElement | null) => {
    fadeRefs.current[i] = el;
  };

  // parallax on scroll (hero leaves)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const leaves = document.querySelectorAll<HTMLElement>("[data-parallax]");
      leaves.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.1");
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let fi = 0; // fade index counter

  return (
    <div className={`${playfair.variable} ${montserrat.variable} ${s.page}`}>
      {/* ── Nav ── */}
      <nav className={s.nav}>
        <span className={s.navLogo}>Rukka</span>
        <ul className={s.navLinks}>
          <li><a href="#">Cómo funciona</a></li>
          <li><a href="#">Hogares</a></li>
          <li><a href="#">Yankis</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
        <button className={s.navCta}>Publicar hogar</button>
      </nav>

      {/* ── Hero ── */}
      <section className={s.hero}>
        <div className={s.heroLeft}>
          <div className={s.heroEyebrow}>
            <span className={s.heroEyebrowLine} />
            <span className={s.heroEyebrowText}>Intercambio de hogares · Latinoamérica</span>
          </div>

          <h1 className={s.heroTitle}>
            Intercambia tu hogar,<br />
            <em>descubre el mundo.</em>
          </h1>

          <p className={s.heroDesc}>
            Rukka conecta hogares auténticos entre personas que viajan con propósito.
            Sin costos. Con confianza.
          </p>

          <div className={s.heroCtas}>
            <button className={s.btnPrimary}>
              <span>Explorar hogares</span>
              <svg className={s.btnArrow} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className={s.btnSecondary}>
              Ver cómo funciona
              <ArrowRight size={14} />
            </button>
          </div>

          <div className={s.heroStats}>
            <div className={s.heroStat}>
              <span className={s.heroStatNum}>2.4k</span>
              <span className={s.heroStatLabel}>Hogares publicados</span>
            </div>
            <div className={s.heroStat}>
              <span className={s.heroStatNum}>18</span>
              <span className={s.heroStatLabel}>Países activos</span>
            </div>
            <div className={s.heroStat}>
              <span className={s.heroStatNum}>100%</span>
              <span className={s.heroStatLabel}>Gratuito</span>
            </div>
          </div>
        </div>

        {/* Right column — animated leaves */}
        <div className={s.heroRight}>
          <div className={s.heroRightBg} />
          <div className={s.heroBlob} style={{ position: "absolute", width: 300, height: 300, background: "rgba(45,75,50,0.4)", top: -50, right: -50, filter: "blur(60px)", borderRadius: "50%", animation: "blobPulse 7s ease-in-out infinite" }} />
          <div className={s.heroBlob} style={{ position: "absolute", width: 200, height: 200, background: "rgba(153,176,128,0.15)", bottom: 60, left: 40, filter: "blur(60px)", borderRadius: "50%", animation: "blobPulse 9s 2s ease-in-out infinite" }} />

          <div className={s.leavesWrapper}>
            <div className={s.leaf} style={{ top: "12%", left: "18%" }} data-parallax="0.08">
              <Leaf width={90} color="#99B080" opacity={0.9} />
            </div>
            <div className={s.leaf} style={{ top: "30%", left: "52%" }} data-parallax="-0.05">
              <Leaf width={55} color="#2D4B32" opacity={1} />
            </div>
            <div className={s.leaf} style={{ top: "55%", left: "22%" }} data-parallax="0.12">
              <Leaf width={70} color="#99B080" opacity={0.6} />
            </div>
            <div className={s.leaf} style={{ top: "18%", left: "62%" }} data-parallax="-0.07">
              <Leaf width={45} color="#C8A96E" opacity={0.7} />
            </div>
            <div className={s.leaf} style={{ top: "68%", left: "58%" }} data-parallax="0.06">
              <Leaf width={80} color="#2D4B32" opacity={0.8} />
            </div>
            <div className={s.leaf} style={{ top: "42%", left: "8%" }} data-parallax="-0.09">
              <Leaf width={40} color="#99B080" opacity={0.5} />
            </div>
          </div>

          {/* Overlapping decorative arcs */}
          <svg
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.04 }}
            width="400" height="400" viewBox="0 0 400 400" fill="none"
          >
            <circle cx="200" cy="200" r="180" stroke="#99B080" strokeWidth="1" />
            <circle cx="200" cy="200" r="140" stroke="#99B080" strokeWidth="1" />
            <circle cx="200" cy="200" r="100" stroke="#99B080" strokeWidth="1" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#99B080" strokeWidth="0.5" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="#99B080" strokeWidth="0.5" />
          </svg>
        </div>

        <div className={s.scrollCue} style={{ left: "30%", gridColumn: "1" }}>
          <span className={s.scrollCueText}>Scroll</span>
          <span className={s.scrollLine} />
        </div>
      </section>

      {/* ── Values ── */}
      <section className={`${s.section} ${s.valuesSection}`}>
        <div className={s.container}>
          <div
            className={`${s.sectionHeader} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
          >
            <div className={s.sectionEyebrow}>
              <span className={s.eyebrowDot} />
              <span className={s.eyebrowLabel}>Por qué Rukka</span>
            </div>
            <h2 className={s.sectionTitle}>Diseñado para la<br />conexión real</h2>
            <p className={s.sectionSubtitle}>
              No somos una plataforma de alquiler. Somos una red de personas que creen que
              los hogares son para vivir, no solo para monetizar.
            </p>
          </div>

          <div className={s.valuesGrid}>
            {VALUES.map((v, i) => (
              <div
                key={v.title}
                className={`${s.valueCard} ${s.fadeUp} ${[s.fadeDelay1, s.fadeDelay2, s.fadeDelay3, s.fadeDelay4][i]}`}
                ref={addFadeRef(fi++)}
              >
                <div className={`${s.valueIconWrap} ${v.iconBg}`}>
                  {v.icon}
                </div>
                <h3 className={s.valueTitle}>{v.title}</h3>
                <p className={s.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured homes ── */}
      <section className={`${s.section} ${s.featuredSection}`}>
        <div className={s.container}>
          <div
            className={`${s.sectionHeader} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
          >
            <div className={s.sectionEyebrow}>
              <span className={s.eyebrowDot} />
              <span className={s.eyebrowLabel}>Explorar</span>
            </div>
            <h2 className={s.sectionTitle}>Hogares que esperan</h2>
            <p className={s.sectionSubtitle}>
              Desde costas del Pacífico hasta barrios porteños. Deslizá para descubrir.
            </p>
          </div>
        </div>

        <div className={s.scrollTrack} style={{ paddingLeft: "max(2rem, calc((100vw - 1280px) / 2 + 2rem))" }}>
          {HOMES.map((h, i) => (
            <article
              key={h.city}
              className={`${s.homeCard} ${h.texture} ${s.fadeUp} ${[s.fadeDelay1, s.fadeDelay2, s.fadeDelay3, s.fadeDelay4][i]}`}
              ref={addFadeRef(fi++)}
            >
              <div className={s.cardFloatShape} style={{ width: 120, height: 120, background: "rgba(153,176,128,0.15)", top: 20, right: 20, borderRadius: "50%", filter: "blur(30px)", position: "absolute" }} />
              <div className={s.cardFloatShape} style={{ width: 80, height: 80, background: "rgba(45,75,50,0.25)", top: 80, left: 30, borderRadius: "50%", filter: "blur(20px)", position: "absolute" }} />

              {/* decorative leaf on card */}
              <div style={{ position: "absolute", top: 24, right: 24, opacity: 0.35 }}>
                <Leaf width={50} color="#99B080" opacity={1} />
              </div>

              <div className={s.cardContent}>
                <p className={s.cardCategory}>{h.country}</p>
                <h3 className={s.cardTitle}>{h.city}</h3>
                <div className={s.cardMeta}>
                  <span className={s.cardBadge}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                    {h.label}
                  </span>
                  <div className={s.cardArrow}>
                    <ArrowRight size={14} color="#F9F7F2" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className={`${s.section} ${s.gallerySection}`}>
        <div className={s.container}>
          <div
            className={`${s.sectionHeader} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
          >
            <div className={s.sectionEyebrow}>
              <span className={s.eyebrowDot} />
              <span className={s.eyebrowLabel}>Vivir el intercambio</span>
            </div>
            <h2 className={s.sectionTitle}>El mundo desde adentro</h2>
            <p className={s.sectionSubtitle}>
              No hoteles. Cocinas reales, vistas personales, barrios con historia.
            </p>
          </div>

          <div
            className={`${s.galleryGrid} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
          >
            {/* span tall */}
            <div className={`${s.galleryCell} ${s.galleryImg1}`}>
              <svg className={s.galleryDecor} style={{ top: 30, right: 30 }} width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" stroke="#F9F7F2" strokeWidth="0.5" fill="none" />
                <circle cx="60" cy="60" r="35" stroke="#F9F7F2" strokeWidth="0.5" fill="none" />
                <line x1="10" y1="60" x2="110" y2="60" stroke="#F9F7F2" strokeWidth="0.3" />
                <line x1="60" y1="10" x2="60" y2="110" stroke="#F9F7F2" strokeWidth="0.3" />
              </svg>
              <span className={s.galleryLabel}>Valparaíso, Chile</span>
            </div>

            <div className={`${s.galleryCell} ${s.galleryImg2}`}>
              <span className={s.galleryLabel}>Interior cabaña</span>
            </div>

            <div className={`${s.galleryCell} ${s.galleryImg3}`}>
              <span className={s.galleryLabel}>Chimenea, BsAs</span>
            </div>

            <div className={`${s.galleryCell} ${s.galleryImg4}`}>
              <span className={s.galleryLabel}>Terraza DF</span>
            </div>

            <div className={`${s.galleryCell} ${s.galleryImg5}`}>
              <span className={s.galleryLabel}>Jardín Bariloche</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={`${s.section} ${s.howSection}`}>
        <div className={s.container}>
          <div className={s.howGrid}>
            <div
              className={`${s.fadeUp}`}
              ref={addFadeRef(fi++)}
            >
              <div className={s.sectionEyebrow} style={{ marginBottom: "1.5rem" }}>
                <span className={s.eyebrowDot} />
                <span className={s.eyebrowLabel}>El proceso</span>
              </div>
              <h2 className={s.sectionTitle} style={{ textAlign: "left", marginBottom: "3rem" }}>
                Tres pasos para<br />el próximo viaje
              </h2>

              <div className={s.howSteps}>
                {HOW_STEPS.map((step) => (
                  <div key={step.n} className={s.howStep}>
                    <span className={s.howStepNum}>{step.n}</span>
                    <div className={s.howStepContent}>
                      <h3 className={s.howStepTitle}>{step.title}</h3>
                      <p className={s.howStepDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`${s.howVisual} ${s.fadeUp} ${s.fadeDelay2}`}
              ref={addFadeRef(fi++)}
            >
              <div className={s.howVisualInner}>
                <div className={s.howVisualOrb3} />
                <div className={s.howVisualOrb2} />
                <div className={s.howVisualOrb}>
                  <span className={s.howVisualIcon}>R</span>
                </div>
              </div>

              {/* floating leaf decorations */}
              <div style={{ position: "absolute", top: 40, right: 40, opacity: 0.5 }}>
                <Leaf width={60} color="#99B080" opacity={1} />
              </div>
              <div style={{ position: "absolute", bottom: 60, left: 30, opacity: 0.35 }}>
                <Leaf width={45} color="#C8A96E" opacity={1} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={s.testimonialSection}>
        <div className={s.container}>
          <div
            className={`${s.sectionHeader} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
            style={{ marginBottom: "3.5rem" }}
          >
            <div className={s.sectionEyebrow}>
              <span className={s.eyebrowDot} />
              <span className={s.eyebrowLabel}>Personas reales</span>
            </div>
            <h2 className={s.sectionTitle} style={{ color: "var(--off-white)" }}>Lo que dice la comunidad</h2>
          </div>

          <div className={s.testimonialInner}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className={`${s.testimonialCard} ${s.fadeUp} ${[s.fadeDelay1, s.fadeDelay2, s.fadeDelay3][i]}`}
                ref={addFadeRef(fi++)}
              >
                <blockquote className={s.testimonialQuote}>"{t.quote}"</blockquote>
                <div className={s.testimonialAuthor}>
                  <div className={`${s.testimonialAvatar} ${t.avatarClass}`} />
                  <div>
                    <p className={s.testimonialName}>{t.name}</p>
                    <p className={s.testimonialLocation}>{t.location}</p>
                  </div>
                  <span className={s.testimonialStars}>★★★★★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={s.ctaSection}>
        <div className={s.container}>
          <div
            className={`${s.ctaBanner} ${s.fadeUp}`}
            ref={addFadeRef(fi++)}
          >
            <h2 className={s.ctaTitle}>
              Tu hogar es tu<br />pasaporte al mundo.
            </h2>
            <p className={s.ctaDesc}>
              Unite a una comunidad que viaja de otra manera. Sin costos, con propósito,
              con personas reales.
            </p>
            <div className={s.ctaButtons}>
              <button className={s.ctaBtnPrimary}>Publicar mi hogar</button>
              <button className={s.ctaBtnSecondary}>Explorar hogares</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={s.footer}>
        <div className={s.container}>
          <div className={s.footerInner}>
            <div>
              <div className={s.footerBrand}>Rukka</div>
              <p className={s.footerTagline}>Diseñado para un mundo más lento</p>
            </div>
            <ul className={s.footerLinks}>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Cómo funciona</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Sobre nosotros</a></li>
            </ul>
          </div>
          <div className={s.footerBottom}>
            <span className={s.footerCopyright}>© 2025 Rukka · Todos los derechos reservados</span>
            <div className={s.footerDots}>
              <span className={s.footerDot} />
              <span className={s.footerDot} />
              <span className={s.footerDot} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
