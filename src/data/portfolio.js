// src/data/portfolio.js
// ============================================================
//  EDIT FILE INI dengan data dirimu sendiri.
// ============================================================

export const site = {
  name: 'Rifki Ardiyansah',
  monogram: 'RA',
  role: 'Web Developer & Teknisi Jaringan',
  tagline: 'Membangun website profesional & jaringan WiFi/Fiber Optic yang andal.',
  location: 'Tangerang, Indonesia',
  email: 'officekantor107@gmail.com',
  phone: '+62 812 1107 1832',
  whatsapp: '6281211071832',
  pronouns: 'he/him',
  status: 'Tersedia untuk proyek',
  // Kosongkan jika belum ada foto — otomatis pakai inisial.
  avatar: '/images.png',
  // Daftar foto yang berputar otomatis di foto profil.
  avatars: ['/images.png', '/profile.png'],
};

export const socials = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/rifkihideng' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/rifki-ardiyansah-00aa7426a' },
];

export const about = [
  'Web Developer yang berfokus membangun aplikasi web yang rapi, cepat, responsif, dan mudah digunakan.',
  'Berpengalaman mengubah kebutuhan menjadi produk digital yang terukur, terpelihara, dan siap dipakai di lingkungan produksi.',
  'Terbiasa berkolaborasi dalam tim, menerapkan praktik terbaik pengembangan, serta terus mengikuti perkembangan teknologi terkini.',
];

export const aboutStory = [
  'Saya memulai karier sebagai teknisi jaringan WiFi & fiber optic — menangani instalasi, konfigurasi, dan pemeliharaan jaringan untuk rumah dan bisnis.',
  'Pengalaman di lapangan mengajarkan saya pentingnya sistem yang andal, rapi, dan mudah dipelihara. Rasa ingin tahu terhadap teknologi kemudian membawa saya beralih ke dunia pengembangan web — dari memperbaiki koneksi menjadi membangun aplikasi.',
  'Kini saya fokus membangun aplikasi web yang cepat dan responsif, memadukan latar belakang jaringan dan pengembangan untuk menghasilkan solusi digital yang lengkap.',
];

export const favoriteTools = ['React', 'Vite', 'Tailwind CSS', 'MikroTik', 'TP-Link Omada'];

export const experience = [
  {
    role: 'Teknisi WiFi Fiber Optic',
    company: 'Freelance',
    period: '2024 — Sekarang',
    description: 'Instalasi, konfigurasi, dan perbaikan jaringan WiFi serta fiber optic untuk rumah dan bisnis.',
    points: [
      'Instalasi jaringan WiFi dan kabel fiber optic (FTTH)',
      'Konfigurasi router, access point, dan perangkat jaringan (MikroTik/TP-Link)',
      'Penanganan gangguan dan pemeliharaan infrastruktur jaringan',
    ],
    tech: ['MikroTik', 'Fiber Optic', 'WiFi', 'Networking'],
  },
  {
    role: 'Crew Store',
    company: 'Indomaret',
    logo: '/indomaret.svg',
    period: '2023 — 2024',
    description: 'Mendukung operasional harian toko dan pelayanan pelanggan.',
    points: [
      'Melayani transaksi kasir dan membantu kebutuhan pelanggan',
      'Menjaga ketersediaan, kerapian, dan penataan stok barang',
      'Membantu penerimaan barang dan stock opname',
      'Melakukan pengecekan dan pelabelan harga produk',
      'Menjaga kebersihan dan kenyamanan area toko',
    ],
  },
];

export const projects = [
  {
    name: 'APEX RISE',
    description:
      'Landing page komunitas game (aliansi APEX RISE) — menampilkan profil tim, strategi, dan informasi wilayah. Dibangun dengan Next.js dan di-deploy di Vercel.',
    tech: ['Next.js', 'React', 'Vercel'],
    link: 'https://narco-empire-apx.vercel.app/',
    year: '2026',
  },
  {
    name: 'Catatan Keuangan',
    description:
      'Aplikasi pencatat keuangan pribadi — mencatat pemasukan & pengeluaran dengan grafik interaktif. Dibangun dengan React + Express + SQLite dan di-deploy di Vercel.',
    tech: ['React', 'Express', 'SQLite', 'Vercel'],
    link: 'https://finance-catatanku.vercel.app/',
    year: '2026',
  },
];

export const awards = [
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
];

export const tools = [
  'React',
  'Vite',
  'Tailwind CSS',
  'JavaScript',
  'Node.js',
  'Express',
  'Git',
  'VS Code',
  'MikroTik',
];

export const skillGroups = [
  {
    title: 'Infrastruktur Jaringan',
    skills: [
      { name: 'Fiber Optic', level: 90 },
      { name: 'Jaringan WiFi', level: 88 },
      { name: 'MikroTik', level: 85 },
    ],
  },
  {
    title: 'Pemrograman Web',
    skills: [
      { name: 'HTML & CSS', level: 85 },
      { name: 'JavaScript', level: 75 },
      { name: 'TypeScript', level: 70 },
      { name: 'Python', level: 90 },
      { name: 'React', level: 85 },
      { name: 'Tailwind CSS', level: 80 },
    ],
  },
];

export const packages = [
  {
    name: 'Personal Website',
    price: 'Rp 750.000',
    description: 'Website pribadi siap pakai untuk portofolio, CV online, dan personal branding. Cocok untuk kamu yang ingin tampil profesional di dunia digital tanpa ribet.',
    features: [
      '1 halaman landing page',
      'Desain responsif',
      'Form kontak / link sosial media',
      'Deploy + gratis domain .my.id',
      'Revisi 2x',
    ],
  },
  {
    name: 'Undangan Nikah',
    price: 'Rp 350.000',
    description: 'Undangan pernikahan digital yang elegan dan mudah dibagikan. Dilengkapi countdown, galeri foto, RSVP, dan lokasi peta. Bisa disesuaikan dengan tema dan nama pasangan.',
    features: [
      'Desain tema pernikahan',
      'Countdown & info acara (akad/resepsi)',
      'Galeri foto prewedding',
      'RSVP / konfirmasi kehadiran',
      'Lokasi peta (Google Maps)',
      'Amplop digital & musik latar',
      'Gratis subdomain',
    ],
  },
  {
    name: 'UMKM Website',
    price: 'Rp 1.500.000',
    description: 'Website untuk usaha kecil dan menengah agar produk lebih mudah ditemukan. Dilengkapi katalog produk, integrasi WhatsApp, dan optimasi SEO dasar untuk menarik pelanggan.',
    features: [
      'Sampai 5 halaman',
      'Galeri / katalog produk',
      'Optimasi dasar SEO',
      'Integrasi WhatsApp',
      'Deploy + gratis domain .com',
      'Revisi 3x',
    ],
  },
  {
    name: 'Company Profile',
    price: 'Rp 3.000.000',
    description: 'Profil perusahaan profesional untuk membangun kredibilitas bisnis. Desain premium, halaman lengkap, blog/berita, serta optimasi SEO dan analitik untuk kebutuhan korporat.',
    features: [
      'Halaman lengkap (sampai 10)',
      'Desain premium custom',
      'Blog / berita',
      'Optimasi SEO',
      'Integrasi analitik',
      'Gratis domain .co.id',
      'Revisi 5x',
    ],
  },
  {
    name: 'Web Pembayaran',
    price: 'Rp 5.000.000',
    description: 'Website dengan fitur transaksi dan pembayaran online lengkap. Cocok untuk toko online yang butuh katalog produk, keranjang, payment gateway, dan dashboard admin.',
    features: [
      'Katalog produk & keranjang',
      'Integrasi payment gateway',
      'Dashboard admin',
      'Manajemen pesanan',
      'Keamanan dasar (SSL)',
      'Gratis domain .store',
      'Revisi 5x',
    ],
  },
];

export const testimonials = [
  {
    name: 'Budi Santoso',
    role: 'Pemilik UMKM',
    text: 'Kerja cepat dan rapi. Website toko saya jadi lebih menarik dan mudah ditemukan di Google.',
  },
  {
    name: 'Siti Rahayu',
    role: 'Pemilik Kost',
    text: 'Instalasi WiFi di kost saya selesai sehari dan sinyalnya stabil di semua lantai. Sangat direkomendasikan.',
  },
  {
    name: 'Andi Pratama',
    role: 'Klien Proyek',
    text: 'Komunikatif dan hasilnya sesuai permintaan. Proses pengerjaan transparan dari awal sampai selesai.',
  },
  {
    name: 'Rizki Fadillah',
    role: 'Ketua Komunitas APEX RISE',
    text: 'Landing page komunitas kami jadi lebih menarik dan mudah dikenali. Profil tim, strategi, dan info wilayah tertata rapi — pengerjaan cepat dan sesuai permintaan.',
  },
  {
    name: 'Dewi Lestari',
    role: 'Pengguna Catatan Keuangan',
    text: 'Aplikasi pencatat keuangannya ringan dan mudah dipakai. Grafiknya membantu saya memantau pemasukan dan pengeluaran setiap bulan dengan jelas.',
  },
];

export const faqs = [
  {
    question: 'Layanan apa saja yang kamu tawarkan?',
    answer:
      'Saya mengerjakan pembuatan website (landing page, company profile, portofolio) serta instalasi & perbaikan jaringan WiFi dan fiber optic.',
  },
  {
    question: 'Teknologi apa yang biasa kamu gunakan?',
    answer:
      'Untuk website saya menggunakan React, Vite, dan Tailwind CSS. Untuk jaringan saya terbiasa dengan MikroTik dan TP-Link Omada.',
  },
  {
    question: 'Bagaimana alur kerja pembuatan website?',
    answer:
      'Mulai dari diskusi kebutuhan, desain, pengembangan, uji coba, hingga deployment. Saya update progres secara berkala.',
  },
  {
    question: 'Bagaimana cara menghubungimu?',
    answer:
      'Kamu bisa menghubungi saya melalui email officekantor107@gmail.com atau telepon +62 812 1107 1832.',
  },
];
