import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getStoredUser, getToken, clearSession } from '../utils/auth';

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
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

export default function CompanyHome() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (!token || !user) {
      router.push('/login');
    } else if (user.account_type !== 'company') {
      router.push('/');
    } else {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="company-portal">
      <Head>
        <title>Recruiter Portal | AI Shop International</title>
        <meta name="description" content="Company dashboard to request requirements and source vetted AI engineers." />
      </Head>

      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          <a href="/" className="brand" aria-label="AI Shop International home">
            <img src="/logo.png" className="logo-img" alt="AI Shop Logo" />
            <span className="brand-word">AI Shop <em>International</em></span>
          </a>

          <div className="nav-actions">
            <span className="nav-user-indicator" style={{ fontSize: '12.5px', fontWeight: '700', letterSpacing: '0.04em', color: 'var(--indigo)', textTransform: 'uppercase' }}>
              HI {currentUser.full_name.split(' ')[0]}
            </span>
            <button 
              onClick={() => {
                clearSession();
                router.push('/login');
              }} 
              className="btn btn-secondary nav-cta"
              style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', cursor: 'pointer' }}
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <Reveal className="hero-badge">COMPANY PORTAL</Reveal>
            <Reveal delay={100} as="h1">
              Find your next <em>AI Expert</em> in days, not weeks.
            </Reveal>
            <Reveal delay={200} as="p" className="hero-p">
              Welcome back, <strong>{currentUser.full_name}</strong>. Submit your project requirements below, and our placement agency team will instantly run them through the semantic matching engine to shortlist vetted specialists.
            </Reveal>
            <Reveal delay={300} className="hero-ctas">
              <a href="/client" className="btn btn-primary hero-cta">Post a New Requirement</a>
            </Reveal>
          </div>

          <Reveal delay={200} className="hero-card-side">
            <div className="info-card">
              <h3>Vetting & Matching Pipeline</h3>
              <ul className="pipeline-steps">
                <li>
                  <span className="step-num">1</span>
                  <div>
                    <strong>Post Requirement</strong>
                    <p>Describe your role requirements, target budget, and tech stack.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">2</span>
                  <div>
                    <strong>Semantic Match</strong>
                    <p>Our system analyzes candidate KPI achievements & vectors to score fit.</p>
                  </div>
                </li>
                <li>
                  <span className="step-num">3</span>
                  <div>
                    <strong>Agency Review</strong>
                    <p>We manually verify the top matches and introduce candidates directly.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Value Props ---------------- */}
      <section className="props-section">
        <div className="container">
          <Reveal as="h2" className="section-title">The Matching Advantage</Reveal>
          <div className="props-grid">
            <div className="prop-card">
              <div className="icon">🏆</div>
              <h4>KPI-Driven Matches</h4>
              <p>We weigh candidates by their strategic career achievements and proudest turnarounds, not just keywords on resumes.</p>
            </div>
            <div className="prop-card">
              <div className="icon">🛡️</div>
              <h4>Vetted Talent Network</h4>
              <p>Every developer profile undergoes manual background checks and portfolio reviews before getting indexed in our system.</p>
            </div>
            <div className="prop-card">
              <div className="icon">⚡</div>
              <h4>Rapid Placement</h4>
              <p>Cut out recruiter back-and-forth. Get vetted AI engineers introduced directly to your inbox within 4 days.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .company-portal {
          background-color: var(--paper);
          color: var(--text);
          min-height: 100vh;
          font-family: var(--font-body);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ---------- Reveal Animation ---------- */
        :global(.reveal) {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        :global(.reveal-visible) {
          opacity: 1;
          transform: translateY(0);
        }

        /* Nav styling with dynamic scrolling states */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: transparent;
          transition: all 0.3s ease;
          padding: 20px 0;
        }
        .nav-scrolled {
          background-color: rgba(250, 249, 246, 0.95) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--paper-line);
          padding: 14px 0;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-word {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #ffffff !important;
          transition: color 0.3s ease;
        }
        .brand-word em {
          color: var(--gold);
          font-style: normal;
        }
        .nav-scrolled .brand-word {
          color: var(--text) !important;
        }
        .logo-img {
          width: 28px;
          height: 28px;
          border-radius: 8px;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .nav-actions :global(.nav-user-indicator) {
          color: #b9b0ff !important;
          transition: color 0.3s ease;
        }
        .nav-scrolled .nav-actions :global(.nav-user-indicator) {
          color: var(--indigo) !important;
        }
        .nav-actions :global(.btn-secondary) {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        .nav-actions :global(.btn-secondary:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: #ffffff !important;
        }
        .nav-scrolled .nav-actions :global(.btn-secondary) {
          color: var(--text) !important;
          border-color: var(--paper-line) !important;
          background: #ffffff !important;
        }
        .nav-scrolled .nav-actions :global(.btn-secondary:hover) {
          background: var(--paper-dim) !important;
        }

        /* Hero section style matching index.js but clean dark-navy background */
        .hero {
          position: relative;
          padding: 160px 0 100px;
          background: radial-gradient(120% 140% at 50% 10%, #141729 0%, var(--ink) 70%, #06070c 100%);
          color: var(--text-on-ink);
          overflow: hidden;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        .hero-copy :global(.hero-badge) {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--gold) !important;
          letter-spacing: 0.12em;
          border: 1px solid rgba(201, 162, 39, 0.3) !important;
          background: rgba(201, 162, 39, 0.08) !important;
          padding: 4px 10px;
          border-radius: 99px;
          margin-bottom: 24px;
        }
        .hero-copy :global(h1) {
          font-size: clamp(36px, 4.5vw, 52px);
          line-height: 1.1;
          margin-bottom: 20px;
          color: #ffffff !important;
          font-weight: 700;
        }
        .hero-copy :global(h1 em) {
          color: var(--gold) !important;
          font-style: normal;
        }
        .hero-copy :global(.hero-p) {
          font-size: 16px;
          line-height: 1.65;
          color: var(--text-on-ink-muted) !important;
          margin-bottom: 36px;
          max-width: 480px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
        }
        .hero-cta {
          padding: 14px 28px;
          font-size: 15px;
          border-radius: 99px;
        }

        /* Side Info Card with Pipeline */
        .hero-card-side {
          display: flex;
          justify-content: flex-end;
        }
        .info-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          padding: 32px;
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-lg);
        }
        .info-card h3 {
          font-size: 18px;
          color: #fff;
          margin-bottom: 24px;
          font-family: var(--font-display);
        }
        .pipeline-steps {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .pipeline-steps li {
          display: flex;
          gap: 16px;
        }
        .step-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(91, 79, 232, 0.18);
          border: 1px solid rgba(91, 79, 232, 0.4);
          color: #b9b0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }
        .pipeline-steps strong {
          display: block;
          font-size: 14px;
          color: #fff;
          margin-bottom: 2px;
        }
        .pipeline-steps p {
          font-size: 12.5px;
          color: var(--text-on-ink-muted);
          line-height: 1.45;
        }

        /* Prop section */
        .props-section {
          padding: 80px 0;
          background: var(--paper-dim);
        }
        .section-title {
          font-size: clamp(24px, 3vw, 32px);
          text-align: center;
          margin-bottom: 48px;
        }
        .props-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }
        .prop-card {
          background: #fff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          padding: 32px;
          text-align: center;
        }
        .icon {
          font-size: 32px;
          margin-bottom: 16px;
        }
        .prop-card h4 {
          font-size: 16.5px;
          margin-bottom: 10px;
          font-weight: 600;
        }
        .prop-card p {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-card-side {
            justify-content: center;
          }
          .props-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
