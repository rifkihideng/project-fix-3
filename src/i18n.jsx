import { createContext, useContext, useEffect, useState } from 'react';
import {
  site,
  socials,
  about,
  aboutStory,
  favoriteTools,
  experience,
  projects,
  awards,
  tools,
  skillGroups,
  packages,
  testimonials,
  faqs,
} from './data/portfolio.js';

const uiId = {
  nav: {
    about: 'About',
    experience: 'Experience',
    projects: 'Projects',
    awards: 'Awards',
    tools: 'Tools',
    skills: 'Skills',
    packages: 'Paket',
    testimonials: 'Testimoni',
    faq: 'FAQ',
  },
  sections: {
    about: 'Tentang Saya',
    experience: 'Experience',
    projects: 'Projects',
    awards: 'Awards & Certifications',
    tools: 'Tech & Tools',
    skills: 'Skills',
    packages: 'Paket Layanan',
    testimonials: 'Testimoni',
    faq: 'FAQ',
  },
  overview: 'Overview',
  role: 'Peran',
  location: 'Lokasi',
  time: 'Waktu',
  email: 'Email',
  phone: 'Telepon',
  pronouns: 'Pronomina',
  about: 'Tentang',
  aboutTools: 'Tools favorit',
  copy: 'Salin',
  copied: 'Disalin:',
  github: 'GitHub',
  githubRepos: 'Repositori',
  githubFollowers: 'Followers',
  githubFollowing: 'Following',
  githubVisit: 'kunjungi profil GitHub',
  orderPackage: 'Pesan Paket',
  packagesNote: 'Domain gratis untuk tahun pertama; biaya perpanjangan di tahun berikutnya ditanggung klien.',
  backToTop: 'Kembali ke atas',
  toggleTheme: 'Ganti mode terang/gelap',
  openPalette: 'Buka command palette',
  copySection: 'Salin tautan bagian',
  linkCopied: 'Tautan bagian disalin.',
  close: 'Tutup',
  whatsappMessage: 'Halo Rifki, saya ingin bertanya tentang layanan kamu.',
  footerBuilt: 'Dibangun dengan React, Vite & Tailwind CSS',
  langLabel: 'English',
  palette: {
    home: 'Beranda',
    themeToLight: 'Ganti ke mode terang',
    themeToDark: 'Ganti ke mode gelap',
    copyEmail: 'Salin email',
    openGithub: 'Buka GitHub',
    githubProfile: 'Profil',
    placeholder: 'Cari atau jalankan perintah...',
    noResult: 'Tidak ada hasil.',
  },
};

const en = {
  site: {
    ...site,
    role: 'Web Developer & Network Technician',
    tagline: 'Building professional websites & reliable WiFi/Fiber Optic networks.',
    status: 'Available for projects',
  },
  socials,
  about: [
    'Web developer focused on building clean, fast, responsive, and user-friendly web applications.',
    'Experienced in turning requirements into scalable, maintainable digital products ready for production.',
    'Accustomed to collaborating in teams, applying best development practices, and keeping up with the latest technologies.',
  ],
  aboutStory: [
    'I started my career as a WiFi & fiber optic network technician — installing, configuring, and maintaining networks for homes and businesses.',
    'Field experience taught me the importance of reliable, tidy, and maintainable systems. My curiosity about technology then led me to web development — from fixing connections to building applications.',
    'Today I focus on building fast, responsive web applications, combining my networking and development background to deliver complete digital solutions.',
  ],
  favoriteTools: ['React', 'Vite', 'Tailwind CSS', 'MikroTik', 'TP-Link Omada'],
  experience: [
    {
      role: 'WiFi Fiber Optic Technician',
      company: 'Freelance',
      period: '2024 — Present',
      description: 'Installation, configuration, and repair of WiFi and fiber optic networks for homes and businesses.',
      points: [
        'Installation of WiFi networks and fiber optic cables (FTTH)',
        'Configuration of routers, access points, and network devices (MikroTik/TP-Link)',
        'Handling network issues and infrastructure maintenance',
      ],
      tech: ['MikroTik', 'Fiber Optic', 'WiFi', 'Networking'],
    },
    {
      role: 'Store Crew',
      company: 'Indomaret',
      logo: '/indomaret.svg',
      period: '2023 — 2024',
      description: 'Supporting daily store operations and customer service.',
      points: [
        'Handling cashier transactions and assisting customers',
        'Maintaining stock availability, tidiness, and product arrangement',
        'Assisting with goods receiving and stocktaking',
        'Checking and labeling product prices',
        'Keeping the store area clean and comfortable',
      ],
    },
  ],
  projects: [
    {
      name: 'APEX RISE',
      description:
        'Landing page for a gaming community (APEX RISE alliance) — showcasing team profile, strategy, and territory information. Built with Next.js and deployed on Vercel.',
      tech: ['Next.js', 'React', 'Vercel'],
      link: 'https://narco-empire-apx.vercel.app/',
      year: '2026',
    },
    {
      name: 'Catatan Keuangan',
      description:
        'A personal finance tracker — record income & expenses with interactive charts. Built with React + Express + SQLite and deployed on Vercel.',
      tech: ['React', 'Express', 'SQLite', 'Vercel'],
      link: 'https://finance-catatanku.vercel.app/',
      year: '2026',
    },
    {
      name: 'Network Monitor',
      description:
        'A network monitoring dashboard — Internet Speed Test, Device Monitor, Wi-Fi Quality, and Internet History with interactive charts. Built with Next.js + TypeScript + Turso and deployed on Vercel.',
      tech: ['Next.js', 'TypeScript', 'Recharts', 'Vercel'],
      link: 'https://network-monitor-wine.vercel.app/',
      year: '2026',
    },
    {
      name: 'Semua Berhak Bisa',
      description:
        'Official website of the #SemuaBerhakBisa community — a free information technology learning community for everyone. Showcasing academy programs (Programming, Graphic Design, Computer Networking, Microsoft Office), mentor profiles, registration flow, and educational blog & articles. Built with React + Vite + Express + Turso and deployed on Vercel.',
      tech: ['React', 'Vite', 'Tailwind CSS', 'Express', 'Turso'],
      link: 'https://semua-berhak-bisa.vercel.app/',
      year: '2026',
    },
  ],
  awards: [
    {
      title: 'OCNA Routing & Switching',
      issuer: 'TP-Link Omada',
      year: '2026',
      link: '/ocna-routing-switching-rifki-ardiyansah.pdf',
    },
    {
      title: 'MongoDB Certificate',
      issuer: 'MongoDB',
      year: '2026',
      link: '/mongodb-certificate-rifki-ardiyansah.pdf',
    }, 
  ],
  tools,
  skillGroups: [
    {
      title: 'Network Infrastructure',
      skills: [
        { name: 'Fiber Optic' },
        { name: 'WiFi Network' },
        { name: 'MikroTik' },
      ],
    },
    {
      title: 'Web Programming',
      skills: [
        { name: 'HTML & CSS' },
        { name: 'JavaScript' },
        { name: 'TypeScript' },
        { name: 'Python' },
        { name: 'React' },
        { name: 'Tailwind CSS' },
      ],
    },
  ],
  packages: [
    {
      name: 'Personal Website',
      price: 'Rp 250.000',
      description: 'A ready-to-use personal website for portfolio, online CV, and personal branding. Present yourself professionally online without hassle.',
      features: [
        '1 landing page',
        'Responsive design',
        'Contact form / social links',
        'Deploy + free .my.id domain',
        '2x revisions',
      ],
    },
    {
      name: 'Wedding Invitation',
      price: 'Rp 80.000',
      description: 'An elegant digital wedding invitation that is easy to share. Includes countdown, photo gallery, RSVP, and map location. Customizable theme and couple names.',
      features: [
        'Wedding theme design',
        'Countdown & event info (ceremony/reception)',
        'Pre-wedding photo gallery',
        'RSVP / attendance confirmation',
        'Map location (Google Maps)',
        'Digital envelope & background music',
        'Free subdomain',
      ],
    },
    {
      name: 'UMKM Website',
      price: 'Rp 750.000',
      description: 'A website for small and medium businesses so your products are easier to find. Includes product catalog, WhatsApp integration, and basic SEO to attract more customers.',
      features: [
        'Up to 5 pages',
        'Product gallery / catalog',
        'Basic SEO optimization',
        'WhatsApp integration',
        'Deploy + free .com domain',
        '3x revisions',
      ],
    },
    {
      name: 'Company Profile',
      price: 'Rp 1.500.000',
      description: 'A professional company profile to build business credibility. Premium design, complete pages, blog/news, plus SEO and analytics for corporate needs.',
      features: [
        'Complete pages (up to 10)',
        'Premium custom design',
        'Blog / news',
        'SEO optimization',
        'Analytics integration',
        'Free .co.id domain',
        '5x revisions',
      ],
    },
    {
      name: 'Online Store & Payment',
      price: 'Rp 2.500.000',
      description: 'A website with complete online transaction and payment features. Perfect for online stores needing product catalog, cart, payment gateway, and admin dashboard.',
      features: [
        'Product catalog & cart',
        'Payment gateway integration',
        'Admin dashboard',
        'Order management',
        'Basic security (SSL)',
        'Free .store domain',
        '5x revisions',
      ],
    },
  ],
  testimonials: [
    {
      name: 'Budi Santoso',
      role: 'UMKM Owner',
      text: 'Fast and neat work. My store website became more attractive and easier to find on Google.',
    },
    {
      name: 'Siti Rahayu',
      role: 'Kost Owner',
      text: 'The WiFi installation at my kost was done in a day and the signal is stable on every floor. Highly recommended.',
    },
    {
      name: 'Andi Pratama',
      role: 'Project Client',
      text: 'Communicative and the result matches the request. The process is transparent from start to finish.',
    },
    {
      name: 'Rizki Fadillah',
      role: 'APEX RISE Community Lead',
      text: 'Our community landing page became more attractive and recognizable. Team profile, strategy, and territory info are neatly organized — fast delivery and as requested.',
    },
    {
      name: 'Dewi Lestari',
      role: 'Catatan Keuangan User',
      text: 'The finance tracker is lightweight and easy to use. Its charts help me monitor my monthly income and expenses clearly.',
    },
  ],
  faqs: [
    {
      question: 'What services do you offer?',
      answer:
        'I work on website development (landing pages, company profiles, portfolios) as well as WiFi and fiber optic network installation & repair.',
    },
    {
      question: 'What technologies do you usually use?',
      answer:
        'For websites I use React, Vite, and Tailwind CSS. For networks I am familiar with MikroTik and TP-Link Omada.',
    },
    {
      question: 'What is your website development workflow?',
      answer:
        'Starting from requirement discussion, design, development, testing, to deployment. I provide progress updates regularly.',
    },
    {
      question: 'How can I contact you?',
      answer:
        'You can reach me via email officekantor107@gmail.com or phone +62 812 1107 1832.',
    },
  ],
  ui: {
    nav: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      awards: 'Awards',
      tools: 'Tools',
      skills: 'Skills',
      packages: 'Packages',
      testimonials: 'Testimonials',
      faq: 'FAQ',
    },
    sections: {
      about: 'About Me',
      experience: 'Experience',
      projects: 'Projects',
      awards: 'Awards & Certifications',
      tools: 'Tech & Tools',
      skills: 'Skills',
      packages: 'Service Packages',
      testimonials: 'Testimonials',
      faq: 'FAQ',
    },
    overview: 'Overview',
    role: 'Role',
    location: 'Location',
    time: 'Time',
    email: 'Email',
    phone: 'Phone',
    pronouns: 'Pronouns',
    about: 'About',
    aboutTools: 'Favorite tools',
    copy: 'Copy',
    copied: 'Copied:',
    github: 'GitHub',
    githubRepos: 'Repositories',
    githubFollowers: 'Followers',
    githubFollowing: 'Following',
    githubVisit: 'visit GitHub profile',
    orderPackage: 'Order Package',
    packagesNote: 'Free domain for the first year; renewal fees are paid by the client.',
    backToTop: 'Back to top',
    toggleTheme: 'Toggle light/dark mode',
    openPalette: 'Open command palette',
    copySection: 'Copy section link',
    linkCopied: 'Section link copied.',
    close: 'Close',
    whatsappMessage: 'Hi Rifki, I would like to ask about your services.',
    footerBuilt: 'Built with React, Vite & Tailwind CSS',
    langLabel: 'Bahasa Indonesia',
    palette: {
      home: 'Home',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      copyEmail: 'Copy email',
      openGithub: 'Open GitHub',
      githubProfile: 'Profile',
      placeholder: 'Search or run a command...',
      noResult: 'No results.',
    },
  },
};

const id = { site, socials, about, aboutStory, favoriteTools, experience, projects, awards, tools, skillGroups, packages, testimonials, faqs, ui: uiId };

const translations = { id, en };

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof localStorage === 'undefined') return 'id';
    return localStorage.getItem('portfolio-lang') ?? 'id';
  });

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-lang', lang);
    } catch {
      /* abaikan */
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const toggleLang = () => setLang((l) => (l === 'id' ? 'en' : 'id'));

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
