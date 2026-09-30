import { useEffect, useState } from 'react';
import Banner from './components/Banner.jsx';
import Hero from './components/Hero.jsx';
import AboutMe from './components/AboutMe.jsx';
import Section from './components/Section.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Awards from './components/Awards.jsx';
import Tools from './components/Tools.jsx';
import Skills from './components/Skills.jsx';
import Packages from './components/Packages.jsx';
import Testimonials from './components/Testimonials.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import BackToTop from './components/BackToTop.jsx';
import Mascot from './components/Mascot.jsx';
import WhatsAppChat from './components/WhatsAppChat.jsx';
import ChatBot from './components/ChatBot.jsx';
import Preloader from './components/Preloader.jsx';
import Toast from './components/Toast.jsx';
import { useLang } from './i18n.jsx';

export default function App() {
  const { t } = useLang();
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === 'undefined') return 'dark';
    return localStorage.getItem('portfolio-theme') ?? 'dark';
  });
  const [paletteOpen, setPaletteOpen] = useState(false);

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
      <Preloader />
      <Banner
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      <main className="mx-auto max-w-5xl px-5 pb-20">
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
            <Awards />
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

      <Footer />

      <BackToTop />
      <Mascot />
      <WhatsAppChat />
      <ChatBot />
      <Toast />

      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}
