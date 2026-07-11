import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getStoredUser, getToken, clearSession } from '../utils/auth';

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const Tag = as;
  return (
    <Tag className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

export default function CandidateLanding() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (!token || !user) {
      router.push('/login');
    } else {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the AI matching engine work for developers?",
      a: "Our engine uses semantic vector matching to parse your uploaded PDF resume, your main career KPI, and your challenge turnaround story. Instead of relying on raw keyword counts, the AI understands the context of your projects and matches you to roles where your exact stack and expertise are needed."
    },
    {
      q: "Are there any platform fees or commissions taken from my rate?",
      a: "No. Unlike traditional agencies that charge 20% placement fees or platforms that deduct service fees, AI Shop International is 100% free for freelancers. You get paid exactly the hourly rate you request."
    },
    {
      q: "How is my profile privacy and contact data secured?",
      a: "We value your privacy. Your name, contact details, and LinkedIn profile are kept completely anonymized on our recruiter dashboard. Full details are only unlocked and shared once a recruiter approves a high-fidelity match and you agree to connect."
    },
    {
      q: "What kinds of AI projects and clients will I work with?",
      a: "Our network connects you with AI-native startups, research labs, and enterprise clients in Fintech, Healthcare AI, Robotics, DevTools, and Climate Tech who are actively building in production using RAG, LLM orchestration, Computer Vision, and MLOps."
    }
  ];

  return (
    <div className="home-container">
      <Head>
        <title>Apply as AI Freelancer | AI Shop International</title>
        <meta
          name="description"
          content="Work on premium enterprise AI projects. No bidding wars. No recruiter spam. Get matched directly by your career KPIs."
        />
      </Head>

      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          <a href="/" className="brand" aria-label="AI Shop International home">
            <img src="/logo.png" className="logo-img" alt="AI Shop Logo" />
            <span className="brand-word">AI Shop <em>International</em></span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            <a href="#how-it-works">How it Works</a>
            <a href="#benefits">Developer Benefits</a>
            <a href="#faqs">FAQs</a>
          </nav>

          <div className="nav-actions">
            <a href="/dashboard" className="nav-ghost">Recruiter Dashboard</a>
            {currentUser ? (
              <>
                <span className="nav-user-indicator" style={{ fontSize: '12.5px', fontWeight: '700', letterSpacing: '0.04em', color: 'var(--indigo)', textTransform: 'uppercase' }}>
                  HI {currentUser.full_name.split(' ')[0]}
                </span>
                <button 
                  onClick={() => {
                    clearSession();
                    setCurrentUser(null);
                    window.location.reload();
                  }} 
                  className="btn btn-secondary nav-cta"
                  style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="nav-ghost">Log In</a>
                <a href="/freelancer" className="btn btn-primary nav-cta">Onboard Now</a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal className="hero-badge">FOR AI &amp; ML SPECIALISTS</Reveal>
            <Reveal delay={100} as="h1">
              Work on premium AI projects. <em>No bidding wars.</em>
            </Reveal>
            <Reveal delay={200} className="hero-sub">
              Get matched directly to enterprise AI, RAG, and Computer Vision roles based on your career KPIs. 0% platform commission.
            </Reveal>
            <Reveal delay={300} className="hero-ctas">
              <a href="/freelancer" className="btn btn-primary hero-cta">Apply as AI Freelancer</a>
              <a href="/" className="btn btn-secondary hero-cta">Hire AI Talent Instead</a>
            </Reveal>
            <Reveal delay={400} className="hero-social">
              <span>No recruiter fees for pilot</span>
              <span className="dot-sep">·</span>
              <span>Direct Slack introduction</span>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- How it Works ---------------- */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>Direct matching. Zero application spam.</h2>
            <p>We bypass the resume pile. You get matched directly to recruiters based on your achievements.</p>
          </Reveal>

          <div className="steps-grid">
            <Reveal className="step-card" delay={50}>
              <span className="step-num">01</span>
              <h3>Submit Profile &amp; Resume</h3>
              <p>Upload your PDF resume and input your primary skills in under a minute. Vetted before listing.</p>
            </Reveal>
            <Reveal className="step-card" delay={150}>
              <span className="step-num">02</span>
              <h3>Highlight Your KPIs</h3>
              <p>Briefly describe 1 Main KPI achieved and 1 tough challenge you turned around in your career.</p>
            </Reveal>
            <Reveal className="step-card" delay={250}>
              <span className="step-num">03</span>
              <h3>Get Matched Directly</h3>
              <p>Recruiters approve matches from their dashboard. Get direct introductions to start working.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Stats Strip ---------------- */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <h3>0%</h3>
              <p>Freelancer Service Fees</p>
            </div>
            <div className="stat">
              <h3>₹800–₹5,000</h3>
              <p>Typical Hourly Rates</p>
            </div>
            <div className="stat">
              <h3>3 Days</h3>
              <p>Average Match Speed</p>
            </div>
            <div className="stat">
              <h3>100%</h3>
              <p>Vetted Enterprise Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Developer Benefits Comparison ---------------- */}
      <section id="benefits" className="compare">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow eyebrow-dark">PLATFORM COMPARISON</span>
            <h2>Built for builders, not bidders</h2>
          </Reveal>

          <div className="compare-table">
            <div className="compare-header">
              <span>Feature</span>
              <span>Freelancer Marketplaces</span>
              <span className="compare-highlight">AI Shop</span>
            </div>
            {[
              ['Job search method', 'Bidding & proposal writing', 'Automated semantic matching'],
              ['Service fees', '10%–20% cut from your rate', '0% fee (Clients pay platform overhead)'],
              ['Profile privacy', 'Publicly indexed on Google', 'Anonymized until approved'],
              ['Project quality', 'Low-budget gig tasks', 'Premium enterprise AI builds']
            ].map((row, idx) => (
              <div className="compare-row" key={idx}>
                <span className="compare-label">{row[0]}</span>
                <span>{row[1]}</span>
                <span className="compare-highlight">{row[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQs ---------------- */}
      <section id="faqs" className="faqs">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow eyebrow-dark">FAQ</span>
            <h2>Frequently asked questions</h2>
          </Reveal>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div className="faq-item" key={idx}>
                <button
                  className="faq-trigger"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={activeFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeFaq === idx ? '−' : '+'}</span>
                </button>
                <div className={`faq-panel ${activeFaq === idx ? 'faq-panel-open' : ''}`}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="cta-banner">
        <div className="container text-center">
          <Reveal>
            <h2>Ready to work on premium AI requirements?</h2>
            <p>Join the vetted network and get matched to enterprise campaigns within 3 days.</p>
            <div className="cta-actions" style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' }}>
              <a href="/freelancer" className="btn btn-primary">Onboard as Candidate</a>
              <a href="/dashboard" className="btn btn-secondary">Open Dashboard</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-brand-name">AI Shop International</span>
            <p>The vetted network for AI-native hiring.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="/">Client Portal</a>
              <a href="/freelancer">Apply as Talent</a>
              <a href="/dashboard">Recruiter Portal</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="/credits">Framework Credits</a>
              <a href="#faqs">FAQs</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 AI Placement Solutions. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .home-container {
          background-color: var(--paper);
          color: var(--text);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .text-center {
          text-align: center;
        }

        /* ---------- Reveal Animation ---------- */
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        :global(.reveal-visible) {
          opacity: 1;
          transform: translateY(0);
        }

        /* ---------- Nav ---------- */
        .nav {
          position: sticky;
          top: 0;
          z-index: 200;
          background: rgba(250, 249, 246, 0.82) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--paper-line) !important;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .nav-scrolled {
          background: rgba(250, 249, 246, 0.95) !important;
          border-bottom-color: var(--paper-line) !important;
        }
        .nav-inner {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          height: 32px;
          width: auto;
          display: block;
        }
        .brand-word {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          color: var(--text) !important;
          letter-spacing: -0.01em;
        }
        .brand-word em {
          font-style: italic;
          color: var(--text-muted) !important;
          font-weight: 400;
        }
        .nav-links {
          display: flex;
          gap: 28px;
        }
        .nav-links a {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted) !important;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: var(--indigo) !important;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .nav-ghost {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-muted) !important;
        }
        .nav-ghost:hover {
          color: var(--indigo) !important;
        }
        .nav-cta {
          padding: 10px 20px;
          font-size: 14px;
        }

        /* ---------- Hero ---------- */
        .hero {
          position: relative;
          background: var(--ink) !important;
          padding: 110px 0 120px;
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 10;
        }
        .hero-copy {
          max-width: 640px;
          margin: 0 auto;
          text-align: center;
        }
        :global(.hero-badge) {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #fbbf24 !important;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 24px;
          background: rgba(251, 191, 36, 0.12) !important;
          padding: 6px 14px;
          border-radius: 99px;
        }
        .hero-copy :global(h1) {
          font-size: 48px;
          line-height: 1.1;
          color: #ffffff !important;
          margin-bottom: 20px;
          font-weight: 650;
        }
        .hero-copy :global(h1 em) {
          font-style: italic;
          color: #c7d2fe !important;
          font-weight: 400;
        }
        :global(.hero-sub) {
          font-size: 18px;
          color: #cbd5e1 !important;
          line-height: 1.5;
          margin-bottom: 36px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 40px;
        }
        .hero-cta {
          padding: 14px 28px;
          font-size: 15px;
        }
        :global(.hero-social) {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #cbd5e1 !important;
          font-size: 13px;
          font-family: var(--font-mono);
        }
        :global(.hero-social span) {
          color: #cbd5e1 !important;
        }
        :global(.hero-social .dot-sep) {
          color: var(--ink-line) !important;
        }

        /* ---------- How it Works ---------- */
        .how-it-works {
          padding: 96px 0;
          border-bottom: 1px solid var(--paper-line);
        }
        .section-head {
          max-width: 600px;
          margin: 0 auto 60px;
        }
        .eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--indigo);
          display: block;
          margin-bottom: 16px;
        }
        .eyebrow-dark {
          color: var(--text-muted);
        }
        .section-head h2 {
          font-size: 32px;
          color: var(--text);
          margin-bottom: 16px;
        }
        .section-head p {
          font-size: 16px;
          color: var(--text-muted);
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }
        .step-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          padding: 36px;
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .step-num {
          font-size: 36px;
          font-family: var(--font-display);
          font-style: italic;
          color: var(--indigo-soft);
          display: block;
          margin-bottom: 20px;
        }
        .step-card h3 {
          font-size: 18px;
          margin-bottom: 12px;
          color: var(--text);
        }
        .step-card p {
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        /* ---------- Stats ---------- */
        .stats {
          background: linear-gradient(135deg, var(--ink), #171d33);
          padding: 72px 0;
          border-top: 1px solid var(--ink-line);
          border-bottom: 1px solid var(--ink-line);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          text-align: center;
        }
        :global(.stat) h3 {
          font-size: 34px;
          color: #ffffff !important;
          font-weight: 600;
          margin-bottom: 8px;
        }
        :global(.stat) p {
          color: #cbd5e1 !important;
          font-size: 13.5px;
          font-family: var(--font-mono);
        }

        /* ---------- Compare ---------- */
        .compare {
          padding: 96px 0;
        }
        .compare-table {
          max-width: 760px;
          margin: 0 auto;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #ffffff;
          box-shadow: var(--shadow-sm);
        }
        .compare-header, .compare-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          padding: 18px 24px;
          border-bottom: 1px solid var(--paper-line);
          font-size: 14px;
        }
        .compare-header {
          background: var(--paper);
          font-weight: 600;
          color: var(--text);
        }
        .compare-row:last-child {
          border-bottom: none;
        }
        .compare-label {
          font-weight: 500;
          color: var(--text);
        }
        .compare-highlight {
          color: var(--indigo);
          font-weight: 600;
        }

        /* ---------- FAQs ---------- */
        .faqs {
          padding: 96px 0;
          background-color: var(--paper-dim);
          border-top: 1px solid var(--paper-line);
          border-bottom: 1px solid var(--paper-line);
        }
        .faq-list {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .faq-item {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }
        .faq-trigger {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: none;
          border: none;
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          text-align: left;
        }
        .faq-icon {
          font-size: 18px;
          color: var(--text-muted);
        }
        .faq-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }
        .faq-panel-open {
          max-height: 200px;
        }
        .faq-panel p {
          padding: 0 24px 20px;
          color: var(--text-muted);
          font-size: 14.5px;
          line-height: 1.6;
        }

        /* ---------- CTA Banner ---------- */
        .cta-banner {
          padding: 96px 0;
          background: var(--paper);
        }
        .cta-banner h2 {
          font-size: 36px;
          margin-bottom: 16px;
        }
        .cta-banner p {
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        /* ---------- Footer ---------- */
        .footer {
          background-color: var(--ink) !important;
          border-top: 1px solid var(--ink-line) !important;
          color: var(--text-on-ink-muted) !important;
          padding: 72px 0 36px;
          font-size: 14px;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 60px;
          margin-bottom: 48px;
        }
        .footer-brand-name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 600;
          color: var(--text-on-ink) !important;
          display: block;
          margin-bottom: 12px;
        }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
        }
        .footer-col h4 {
          color: var(--text-on-ink);
          margin-bottom: 16px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .footer-col a {
          display: block;
          color: var(--text-on-ink-muted);
          margin-bottom: 10px;
          transition: color 0.2s;
        }
        .footer-col a:hover {
          color: var(--text-on-ink);
        }
        .footer-bottom {
          border-top: 1px solid var(--ink-line);
          padding-top: 36px;
          text-align: center;
          color: var(--text-on-ink-muted);
          font-size: 13px;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 768px) {
          .hero-copy h1 { font-size: 38px; }
          .footer-inner { grid-template-columns: 1fr; gap: 40px; }
          .nav-actions { gap: 10px; }
          .nav-ghost { font-size: 12px; }
          .nav-cta { padding: 8px 14px; font-size: 12px; }
        }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hero-ctas { flex-direction: column; }
          .hero-ctas .btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
