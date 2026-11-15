import { lazy, Suspense, useEffect, useState } from 'react';
import Banner from './components/Banner.jsx';
import Hero from './components/Hero.jsx';
import AboutMe from './components/AboutMe.jsx';
import Section from './components/Section.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Tools from './components/Tools.jsx';
import Skills from './components/Skills.jsx';
import Packages from './components/Packages.jsx';
import Testimonials from './components/Testimonials.jsx';
import Faq from './components/Faq.jsx';
import BackToTop from './components/BackToTop.jsx';
import Mascot from './components/Mascot.jsx';
import WhatsAppChat from './components/WhatsAppChat.jsx';
import Preloader from './components/Preloader.jsx';
import Toast from './components/Toast.jsx';
import HeroVideoBackground from './components/HeroVideoBackground.jsx';
import { useLang } from './i18n.jsx';

// Komponen berat yang tidak terlihat di layar pertama dimuat on-demand.
const Awards = lazy(() => import('./components/Awards.jsx'));
const Footer = lazy(() => import('./components/Footer.jsx'));
const ChatBot = lazy(() => import('./components/ChatBot.jsx'));
const CommandPalette = lazy(() => import('./components/CommandPalette.jsx'));

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

export default function App() {
  const { t } = useLang();
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    return localStorage.getItem('portfolio-theme') ?? 'dark';
  });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setShowVideo(!motionQuery.matches);
    update();
    motionQuery.addEventListener('change', update);
    return () => motionQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      /* abaikan */
    }
  }, [theme]);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <div className="min-h-screen bg-background text-foreground antialiased transition-colors duration-300">
      {showVideo && <HeroVideoBackground src={VIDEO_SRC} />}

      <div className="relative z-10">
        <Preloader />
        <a href="#main-content" className="skip-link">
          {t.ui.skipToContent}
        </a>
        <Banner
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenPalette={() => setPaletteOpen(true)}
        />

        <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-5 pb-20">
          <Hero />
          <div className="mt-24 space-y-24">
            <Section id="about" title={t.ui.sections.about}>
              <AboutMe />
            </Section>
            <Section id="experience" title={t.ui.sections.experience} count={t.experience.length}>
              <Experience />
            </Section>
            <Section id="projects" title={t.ui.sections.projects} count={t.projects.length}>
              <Projects />
            </Section>
            <Section id="awards" title={t.ui.sections.awards} count={t.awards.length}>
              <Suspense fallback={<div className="flex h-80 items-center justify-center text-muted">…</div>}>
                <Awards />
              </Suspense>
            </Section>
            <Section id="tools" title={t.ui.sections.tools}>
              <Tools />
            </Section>
            <Section
              id="skills"
              title={t.ui.sections.skills}
              count={t.skillGroups.reduce((n, group) => n + group.skills.length, 0)}
            >
              <Skills />
            </Section>
            <Section id="packages" title={t.ui.sections.packages} count={t.packages.length}>
              <Packages />
            </Section>
            <Section id="testimonials" title={t.ui.sections.testimonials} count={t.testimonials.length}>
              <Testimonials />
            </Section>
            <Section id="faq" title={t.ui.sections.faq} count={t.faqs.length}>
              <Faq />
            </Section>
          </div>
        </main>

        <Suspense fallback={<footer className="min-h-[50vh]" />}>
          <Footer />
        </Suspense>

        <BackToTop />
        <Mascot />
        <WhatsAppChat />
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
        <Toast />

        {paletteOpen && (
          <Suspense fallback={null}>
            <CommandPalette
              onClose={() => setPaletteOpen(false)}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
