/**
 * Herbarium Senja — editorial botanical wedding invitation.
 * This page uses an asymmetric journal layout, tactile paper tones, terracotta thread accents,
 * and swipe-first chapter navigation. Keep content warm, specific, and never generic.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  ExternalLink,
  Heart,
  Leaf,
  MapPin,
  Mail,
  Music2,
  Pause,
  Play,
  Send,
  Sparkles,
  X,
  ZoomIn,
} from "lucide-react";

const invitationConfig = {
  couple: {
    shortNames: "Alya & Raka",
    firstName: "Alya",
    secondName: "Raka",
    parents: "Bapak & Ibu dari kedua mempelai",
    emblem: "AR",
  },
  event: {
    dateLabel: "Sabtu, 19 Juni 2027",
    dateShort: "19.06.27",
    akadTime: "09.00 WIB",
    receptionTime: "11.00–14.00 WIB",
    venue: "Rumah Kebun Arunika",
    address: "Jl. Kemuning Raya No. 18, Bogor, Jawa Barat",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rumah%20Kebun%20Arunika%20Bogor",
    calendarStart: "20270619T020000Z",
    calendarEnd: "20270619T070000Z",
    calendarTimezone: "Asia/Jakarta",
  },
  payments: {
    ewalletProvider: "DANA",
    ewalletNumber: "0812 3456 7890",
    ewalletRecipient: "Alya Pradipta",
    ewalletLink: "https://link.dana.id/minta/placeholder-alya-raka",
    bank: "BCA",
    accountNumber: "1234567890",
    accountName: "Raka Mahendra",
  },
  musicUrl: "",
} as const;

const gallery = [
  {
    src: "/manus-storage/garden-kiss_c5d76ca7.jpg",
    alt: "Pasangan berdiri berdekatan di taman dengan buket bunga bernuansa terracotta",
    caption: "Di bawah teduh yang sama",
    size: "gallery-tall",
  },
  {
    src: "/manus-storage/garden-portrait_4a5c7bd6.jpg",
    alt: "Pasangan berjalan di antara rangkaian bunga putih dan dedaunan hijau",
    caption: "Sore yang kami simpan",
    size: "gallery-large",
  },
  {
    src: "/manus-storage/quiet-arch_0619457f.jpg",
    alt: "Pasangan berdiri di dekat gerbang batu dalam cahaya taman yang lembut",
    caption: "Menuju halaman berikutnya",
    size: "gallery-square",
  },
  {
    src: "/manus-storage/spring-light_45452985.jpg",
    alt: "Pasangan di taman bunga dengan cahaya musim semi yang terang",
    caption: "Bunga-bunga yang ikut tahu",
    size: "gallery-tall",
  },
  {
    src: "/manus-storage/bouquet-detail_8cf6e807.jpg",
    alt: "Detail buket pengantin dengan bunga putih dan bunga terracotta",
    caption: "Detail kecil, makna besar",
    size: "gallery-detail",
  },
  {
    src: "/manus-storage/tabletop-botanical_904306fd.jpg",
    alt: "Buket dan perlengkapan pernikahan di atas meja hijau bernuansa botanical",
    caption: "Disiapkan dengan penuh niat",
    size: "gallery-wide",
  },
] as const;

type RSVPEntry = {
  id: string;
  name: string;
  status: string;
  message: string;
  createdAt: string;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const chapterIds = ["story", "details", "gallery", "rsvp", "gift"] as const;
const chapterLabels = ["Cerita", "Acara", "Galeri", "RSVP", "Kasih"] as const;

function getGuestName() {
  const params = new URLSearchParams(window.location.search);
  const rawGuest = params.get("to")?.replace(/\s+/g, " ").trim();
  return rawGuest ? rawGuest.slice(0, 42) : "Tamu undangan";
}

function getCountdown(target: string): Countdown {
  const distance = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

function buildCalendarUrl() {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${invitationConfig.couple.shortNames}`,
    dates: `${invitationConfig.event.calendarStart}/${invitationConfig.event.calendarEnd}`,
    details: `Akad dan resepsi ${invitationConfig.couple.shortNames}. Mohon hadir dengan penuh sukacita.`,
    location: `${invitationConfig.event.venue}, ${invitationConfig.event.address}`,
    ctz: invitationConfig.event.calendarTimezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

function Emblem({ small = false }: { small?: boolean }) {
  return (
    <span className={`emblem ${small ? "emblem-small" : ""}`} aria-label="Emblem Alya dan Raka">
      <span className="emblem-ring" />
      <span className="emblem-leaf emblem-leaf-left" />
      <span className="emblem-leaf emblem-leaf-right" />
      <span className="emblem-letter">{invitationConfig.couple.emblem}</span>
    </span>
  );
}

function ChapterLabel({ number, children }: { number: string; children: string }) {
  return (
    <div className="chapter-label">
      <span className="chapter-number">{number}</span>
      <span className="chapter-rule" />
      <span>{children}</span>
    </div>
  );
}

export default function Home() {
  const [guestName] = useState(getGuestName);
  const [coverOpen, setCoverOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState<(typeof chapterIds)[number]>("story");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Saya akan hadir");
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [rsvpError, setRsvpError] = useState("");
  const [rsvpSent, setRsvpSent] = useState(false);
  const [guestbook, setGuestbook] = useState<RSVPEntry[]>([]);
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown("2027-06-19T09:00:00+07:00"));
  const [startX, setStartX] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const calendarUrl = useMemo(buildCalendarUrl, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("herbarium-senja-rsvp");
      if (saved) setGuestbook(JSON.parse(saved) as RSVPEntry[]);
    } catch {
      setGuestbook([]);
    }
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown("2027-06-19T09:00:00+07:00")), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [coverOpen, guestbook.length]);

  useEffect(() => {
    const observers = chapterIds.map((chapterId) => {
      const node = document.getElementById(chapterId);
      if (!node) return null;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) setActiveChapter(chapterId);
        },
        { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
      );
      observer.observe(node);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowLeft") setLightboxIndex((current) => (current === null ? null : (current - 1 + gallery.length) % gallery.length));
      if (event.key === "ArrowRight") setLightboxIndex((current) => (current === null ? null : (current + 1) % gallery.length));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeyboardChapter = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const currentIndex = chapterIds.indexOf(activeChapter);
      const nextIndex = event.key === "ArrowRight" ? Math.min(chapterIds.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
      document.getElementById(chapterIds[nextIndex])?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("keydown", handleKeyboardChapter);
    return () => window.removeEventListener("keydown", handleKeyboardChapter);
  }, [activeChapter]);

  const scrollToChapter = (chapterId: string) => {
    document.getElementById(chapterId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    setStartX(event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX === null || event.pointerType === "mouse") return;
    const delta = event.clientX - startX;
    setStartX(null);
    if (Math.abs(delta) < 64) return;
    const currentIndex = chapterIds.indexOf(activeChapter);
    const nextIndex = delta < 0 ? Math.min(chapterIds.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
    scrollToChapter(chapterIds[nextIndex]);
  };

  const openInvitation = () => {
    setCoverOpen(true);
    if (invitationConfig.musicUrl && audioRef.current) {
      audioRef.current.volume = 0.24;
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
    window.setTimeout(() => document.getElementById("story")?.focus(), 780);
  };

  const toggleMusic = () => {
    if (!audioRef.current || !invitationConfig.musicUrl) return;
    if (musicPlaying) {
      audioRef.current.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
    }
  };

  const copyToClipboard = async (field: string, value: string) => {
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(value);
      else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      setCopiedField(field);
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
  };

  const submitRSVP = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = rsvpName.trim();
    const message = rsvpMessage.trim();
    if (!name || !message) {
      setRsvpError("Tolong isi nama dan pesan singkatmu terlebih dahulu.");
      setRsvpSent(false);
      return;
    }
    const entry: RSVPEntry = {
      id: `${Date.now()}`,
      name: name.slice(0, 60),
      status: rsvpStatus,
      message: message.slice(0, 240),
      createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
    const nextGuestbook = [entry, ...guestbook];
    setGuestbook(nextGuestbook);
    try {
      window.localStorage.setItem("herbarium-senja-rsvp", JSON.stringify(nextGuestbook));
    } catch {
      // Local-only fallback remains visible in the current session.
    }
    setRsvpName("");
    setRsvpMessage("");
    setRsvpError("");
    setRsvpSent(true);
  };

  return (
    <div className={`invitation-shell ${coverOpen ? "invitation-ready" : ""}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => setStartX(null)}>
      <audio ref={audioRef} src={invitationConfig.musicUrl || undefined} loop preload="none" aria-hidden="true" />

      <div className={`cover ${coverOpen ? "cover-open" : ""}`} aria-hidden={coverOpen}>
        <div className="cover-image" />
        <div className="cover-wash" />
        <div className="cover-content">
          <div className="cover-topline"><span>Undangan pernikahan</span><span>{invitationConfig.event.dateShort}</span></div>
          <Emblem />
          <p className="cover-kicker">Satu musim yang ingin kami rayakan bersama</p>
          <h1>{invitationConfig.couple.shortNames.split(" & ").map((name) => <span key={name}>{name}</span>)}</h1>
          <div className="cover-meta"><span>{invitationConfig.event.dateLabel}</span><span className="cover-dot">·</span><span>Rumah Kebun Arunika</span></div>
          <div className="guest-note"><span>Untuk</span><strong>{guestName}</strong></div>
          <button className="button button-light cover-button" onClick={openInvitation} type="button">
            Buka undangan <ArrowDownRight size={16} strokeWidth={1.6} />
          </button>
          <p className="cover-footnote">Swipe kanan / kiri untuk berpindah bab · Bogor, Jawa Barat</p>
        </div>
      </div>

      <header className="site-header" aria-label="Navigasi utama">
        <button className="brand-lockup" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} type="button" aria-label="Kembali ke awal undangan">
          <Emblem small /><span>{invitationConfig.couple.shortNames}</span>
        </button>
        <nav className="desktop-nav">
          {chapterIds.map((chapterId, index) => <button key={chapterId} className={activeChapter === chapterId ? "active" : ""} onClick={() => scrollToChapter(chapterId)} type="button">{chapterLabels[index]}</button>)}
        </nav>
        <div className="header-date">{invitationConfig.event.dateShort}<span className="header-line" /></div>
      </header>

      <main className="main-content" tabIndex={-1}>
        <section className="hero-section" id="home" aria-labelledby="hero-heading">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="hero-copy reveal">
            <ChapterLabel number="00" children="Catatan pertama" />
            <p className="hero-eyebrow">Kami mengundangmu</p>
            <h2 id="hero-heading">Alya <em>&</em><br />Raka</h2>
            <p className="hero-intro">Mari duduk sebentar, membuka satu halaman yang kami tulis dengan penuh syukur.</p>
            <button className="text-link light-link" onClick={() => scrollToChapter("story")} type="button">Baca cerita kami <ArrowRight size={16} /></button>
          </div>
          <div className="hero-stamp"><Emblem small /><span>herbarium / vol. 01</span></div>
          <div className="hero-mark"><span>AR</span><span>19—06—27</span></div>
        </section>

        <section className="section story-section paper-section" id="story" tabIndex={-1} aria-labelledby="story-heading">
          <div className="section-inner split-layout">
            <div className="section-heading reveal">
              <ChapterLabel number="01" children="Cerita" />
              <p className="eyebrow">Tumbuh perlahan</p>
              <h2 id="story-heading">Ada hal-hal baik yang datang tanpa banyak suara.</h2>
            </div>
            <div className="story-copy reveal reveal-delay-1">
              <p className="dropcap">A</p>
              <p>lya dan Raka pertama kali bertemu di sebuah sore yang biasa saja—kopi yang terlalu pahit, percakapan yang tak terasa panjang, dan janji kecil untuk bertemu lagi.</p>
              <p>Dari sana, perjalanan mereka tumbuh seperti tanaman yang dirawat sabar: tidak selalu terlihat setiap hari, tetapi akarnya menemukan tempat. Hari ini, mereka ingin merayakan halaman baru bersama keluarga dan sahabat.</p>
              <div className="signature-line"><span>Dengan hangat,</span><strong>Alya & Raka</strong></div>
            </div>
          </div>
          <div className="story-image-wrap reveal"><img src={gallery[2].src} alt="Alya dan Raka berbagi momen tenang di taman" /><span className="image-note">Bogor · 2026</span></div>
        </section>

        <section className="section details-section moss-section" id="details" tabIndex={-1} aria-labelledby="details-heading">
          <div className="section-inner">
            <div className="details-top reveal"><div><ChapterLabel number="02" children="Detail acara" /><p className="eyebrow">Tandai kalender</p><h2 id="details-heading">Simpan tanggalnya,<br /><em>hadirkan doanya.</em></h2></div><div className="countdown-block"><span className="countdown-label">Menuju hari bahagia</span><div className="countdown"><div><strong>{formatNumber(countdown.days)}</strong><span>hari</span></div><b>:</b><div><strong>{formatNumber(countdown.hours)}</strong><span>jam</span></div><b>:</b><div><strong>{formatNumber(countdown.minutes)}</strong><span>menit</span></div><b>:</b><div><strong>{formatNumber(countdown.seconds)}</strong><span>detik</span></div></div></div></div>
            <div className="event-grid reveal reveal-delay-1">
              <article className="event-block"><div className="event-icon"><Sparkles size={18} /></div><span className="event-index">01 / Akad</span><h3>Akad nikah</h3><p>{invitationConfig.event.dateLabel}<br />Pukul {invitationConfig.event.akadTime}</p><span className="event-venue">{invitationConfig.event.venue}</span></article>
              <div className="event-connector"><span /><span /><span /></div>
              <article className="event-block event-block-highlight"><div className="event-icon"><Heart size={18} /></div><span className="event-index">02 / Resepsi</span><h3>Resepsi</h3><p>{invitationConfig.event.dateLabel}<br />Pukul {invitationConfig.event.receptionTime}</p><span className="event-venue">{invitationConfig.event.venue}</span></article>
              <aside className="location-note"><MapPin size={17} /><span>{invitationConfig.event.address}</span><div className="location-actions"><a className="text-link moss-link" href={invitationConfig.event.mapsUrl} target="_blank" rel="noreferrer">Lihat lokasi <ExternalLink size={14} /></a><a className="text-link moss-link" href={calendarUrl} target="_blank" rel="noreferrer">Simpan ke kalender <CalendarPlus size={14} /></a></div></aside>
            </div>
          </div>
        </section>

        <section className="section gallery-section paper-section" id="gallery" tabIndex={-1} aria-labelledby="gallery-heading">
          <div className="section-inner gallery-heading reveal"><div><ChapterLabel number="03" children="Galeri" /><p className="eyebrow">Fragmen yang kami simpan</p><h2 id="gallery-heading">Enam potongan<br /><em>dari perjalanan kami.</em></h2></div><p className="gallery-instruction"><ArrowLeft size={16} /> Klik foto untuk melihat lebih dekat</p></div>
          <div className="gallery-grid section-inner reveal reveal-delay-1">{gallery.map((image, index) => <button className={`gallery-item ${image.size}`} key={image.src} onClick={() => setLightboxIndex(index)} type="button" aria-label={`Lihat foto ${index + 1}: ${image.caption}`}><img src={image.src} alt={image.alt} loading="lazy" /><span className="gallery-overlay"><span>{String(index + 1).padStart(2, "0")}</span><ZoomIn size={17} /></span><span className="gallery-caption">{image.caption}</span></button>)}</div>
        </section>

        <section className="section rsvp-section terracotta-section" id="rsvp" tabIndex={-1} aria-labelledby="rsvp-heading">
          <div className="section-inner rsvp-layout">
            <div className="rsvp-heading reveal"><ChapterLabel number="04" children="RSVP" /><p className="eyebrow">Tolong kabari kami</p><h2 id="rsvp-heading">Satu pesanmu<br /><em>berarti banyak.</em></h2><p>Konfirmasi kehadiranmu akan membantu kami menyiapkan ruang yang hangat untuk semua.</p><div className="rsvp-local-note"><Clipboard size={16} /> RSVP tersimpan sementara di perangkatmu.</div></div>
            <form className="rsvp-form reveal reveal-delay-1" onSubmit={submitRSVP} noValidate>
              <label htmlFor="rsvp-name">Namamu</label><input id="rsvp-name" value={rsvpName} onChange={(event) => setRsvpName(event.target.value)} placeholder="Tulis namamu" autoComplete="name" />
              <fieldset><legend>Kehadiranmu</legend><div className="radio-row">{["Saya akan hadir", "Belum bisa memastikan", "Tidak dapat hadir"].map((status) => <label className={`radio-option ${rsvpStatus === status ? "selected" : ""}`} key={status}><input type="radio" name="attendance" value={status} checked={rsvpStatus === status} onChange={(event) => setRsvpStatus(event.target.value)} /><span>{status}</span></label>)}</div></fieldset>
              <label htmlFor="rsvp-message">Pesan untuk Alya & Raka</label><textarea id="rsvp-message" value={rsvpMessage} onChange={(event) => setRsvpMessage(event.target.value)} placeholder="Tulis doa yang ingin kamu titipkan" rows={4} />
              {rsvpError && <p className="form-error" role="alert">{rsvpError}</p>}
              {rsvpSent && <p className="form-success" role="status"><CheckCircle2 size={16} /> Terima kasih, pesanmu sudah ditambahkan.</p>}
              <button className="button button-dark" type="submit">Kirim kabar <Send size={15} /></button>
            </form>
          </div>
          <div className="section-inner guestbook-wrap reveal">{guestbook.length === 0 ? <div className="guestbook-empty"><Leaf size={18} /><p>Pesan ucapanmu akan muncul di sini setelah dikirim.</p></div> : <div className="guestbook-list">{guestbook.map((entry) => <article className="guestbook-entry" key={entry.id}><div className="guestbook-avatar">{entry.name.slice(0, 1).toUpperCase()}</div><div><div className="guestbook-meta"><strong>{entry.name}</strong><span>{entry.status}</span><time>{entry.createdAt}</time></div><p>{entry.message}</p></div></article>)}</div>}</div>
        </section>

        <section className="section gift-section plum-section" id="gift" tabIndex={-1} aria-labelledby="gift-heading">
          <div className="section-inner gift-layout">
            <div className="gift-copy reveal"><ChapterLabel number="05" children="Tanda kasih" /><p className="eyebrow">Jika ingin berbagi</p><h2 id="gift-heading">Doa adalah<br /><em>hadiah yang utama.</em></h2><p>Jika berkenan memberikan tanda kasih, berikut detail yang bisa digunakan. Terima kasih sudah hadir dalam cerita kami.</p></div>
            <div className="gift-details reveal reveal-delay-1"><div className="qr-card"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(invitationConfig.payments.ewalletLink)}`} alt="QR code untuk link pembayaran DANA" /><span>QR tanda kasih</span></div><div className="payment-list"><div className="payment-row"><span>Dompet digital · {invitationConfig.payments.ewalletProvider}</span><strong>{invitationConfig.payments.ewalletNumber}</strong><small>a.n. {invitationConfig.payments.ewalletRecipient}</small><button className="copy-button" onClick={() => copyToClipboard("ewallet", invitationConfig.payments.ewalletNumber)} type="button">{copiedField === "ewallet" ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin nomor</>}</button></div><div className="payment-row"><span>Transfer bank · {invitationConfig.payments.bank}</span><strong>{invitationConfig.payments.accountNumber}</strong><small>a.n. {invitationConfig.payments.accountName}</small><button className="copy-button" onClick={() => copyToClipboard("bank", invitationConfig.payments.accountNumber)} type="button">{copiedField === "bank" ? <><Check size={14} /> Tersalin</> : <><Copy size={14} /> Salin nomor</>}</button></div><div className="payment-row"><span>Catatan</span><small>Data pembayaran di atas adalah placeholder yang mudah diganti di objek konfigurasi.</small></div></div></div>
          </div>
        </section>

        <footer className="site-footer"><Emblem small /><p>Dengan kasih, Alya & Raka</p><span>{invitationConfig.event.dateShort} · Bogor</span></footer>
      </main>

      {coverOpen && invitationConfig.musicUrl && <button className="music-control" onClick={toggleMusic} type="button" aria-label={musicPlaying ? "Jeda musik" : "Putar musik"}>{musicPlaying ? <Pause size={17} /> : <Play size={17} />}<span>{musicPlaying ? "Musik berjalan" : "Putar musik"}</span></button>}

      {coverOpen && <nav className="sticky-nav" aria-label="Navigasi section">
        {chapterIds.map((chapterId, index) => <button className={activeChapter === chapterId ? "active" : ""} key={chapterId} onClick={() => scrollToChapter(chapterId)} type="button"><span className="sticky-icon">{index === 0 ? <Leaf size={16} /> : index === 1 ? <Clock3 size={16} /> : index === 2 ? <Sparkles size={16} /> : index === 3 ? <Mail size={16} /> : <Heart size={16} />}</span><span>{chapterLabels[index]}</span></button>)}
      </nav>}

      {lightboxIndex !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightboxIndex(null)}><button className="lightbox-close" onClick={() => setLightboxIndex(null)} type="button" aria-label="Tutup galeri"><X size={22} /></button><button className="lightbox-arrow lightbox-prev" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }} type="button" aria-label="Foto sebelumnya"><ChevronLeft size={25} /></button><figure onClick={(event) => event.stopPropagation()}><img src={gallery[lightboxIndex].src} alt={gallery[lightboxIndex].alt} /><figcaption><span>{String(lightboxIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span>{gallery[lightboxIndex].caption}</figcaption></figure><button className="lightbox-arrow lightbox-next" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }} type="button" aria-label="Foto berikutnya"><ChevronRight size={25} /></button></div>}
    </div>
  );
}
