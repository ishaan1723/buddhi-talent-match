import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getStoredUser, getToken, clearSession } from '../utils/auth';
import { API_URL } from '../config';
import { fetchWithTimeout } from '../utils/fetchHelper';

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

  // Match Inbox States
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (!token || !user) {
      router.push('/login');
    } else if (user.account_type !== 'freelancer') {
      router.push('/');
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

  // Fetch matched opportunities for this candidate
  useEffect(() => {
    if (currentUser) {
      const fetchCandidateMatches = async () => {
        setLoadingMatches(true);
        setFetchError('');
        try {
          const res = await fetchWithTimeout(
            `${API_URL}/api/matches/freelancer/all?email=${encodeURIComponent(currentUser.email)}`, 
            { timeout: 10000 }
          );
          if (res.ok) {
            const data = await res.json();
            setMatches(data);
          } else {
            throw new Error(`API error code: ${res.status}`);
          }
        } catch (err) {
          console.error("Failed to fetch matches. Running local mock data.", err);
          setFetchError('Failed to load live status. Running in demo mode.');
          // Mock data fallback so the user always has a working demo
          setMatches([
            {
              id: 201,
              job_id: 1,
              match_score: 96.5,
              status: 'approved',
              job_title: 'Senior RAG Engineer (LangChain / Vector DB)',
              job_description: 'Build query optimizations and document chunking systems.',
              job_budget: 3500,
              job_kpi_expectations: 'Optimize query latency and handle index clustering.'
            },
            {
              id: 202,
              job_id: 2,
              match_score: 88.2,
              status: 'pending',
              job_title: 'Computer Vision Expert (PyTorch / MLOps)',
              job_description: 'Set up automated defect classification on image datasets.',
              job_budget: 6000,
              job_kpi_expectations: 'Achieve image classification accuracy threshold >98%.'
            }
          ]);
        } finally {
          setLoadingMatches(false);
        }
      };
      fetchCandidateMatches();
    }
  }, [currentUser]);

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
            {currentUser && <a href="#my-inbox">My Inbox</a>}
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

      {/* ---------------- My Personal Match Inbox ---------------- */}
      {currentUser && (
        <section className="inbox-section" id="my-inbox">
          <div className="container">
            <Reveal className="section-head text-center">
              <span className="eyebrow">MY INBOX</span>
              <h2>Application Status &amp; Matches</h2>
              <p>Track your AI profile matches, recruiter approvals, and direct connection states in real-time.</p>
            </Reveal>

            <div className="inbox-card card">
              {loadingMatches ? (
                <div className="inbox-loader">
                  <div className="spinner"></div>
                  <p>Loading your matched campaigns...</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="inbox-empty">
                  <span className="empty-icon">⏳</span>
                  <h3>Waiting for matching campaigns</h3>
                  <p>As soon as client requirements align with your profile, your matches will appear here instantly!</p>
                </div>
              ) : (
                <div className="inbox-list">
                  {fetchError && <p className="demo-notice">{fetchError}</p>}
                  {matches.map((m) => (
                    <div key={m.id} className="inbox-item">
                      <div className="inbox-item-left">
                        <div className="inbox-header-row">
                          <h3>{m.job_title}</h3>
                          <span className="match-badge">{Math.round(m.match_score)}% Match</span>
                        </div>
                        <p className="job-desc">{m.job_description}</p>
                        {m.job_kpi_expectations && (
                          <div className="job-kpis">
                            <strong>Expected KPIs:</strong> <span>{m.job_kpi_expectations}</span>
                          </div>
                        )}
                        <div className="job-meta">
                          <span>Budget: ₹{m.job_budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</span>
                        </div>
                      </div>
                      <div className="inbox-item-right">
                        {m.status === 'approved' ? (
                          <div className="status-badge approved">
                            <span className="status-dot"></span>
                            APPROVED
                          </div>
                        ) : m.status === 'rejected' ? (
                          <div className="status-badge rejected">
                            <span className="status-dot"></span>
                            DECLINED
                          </div>
                        ) : (
                          <div className="status-badge pending">
                            <span className="status-dot"></span>
                            UNDER REVIEW
                          </div>
                        )}
                        <p className="status-note">
                          {m.status === 'approved' 
                            ? "Approved! The recruiter has unlocked your contact details and will reach out to you directly via email."
                            : m.status === 'rejected'
                            ? "Not selected for this specific role. Your profile remains active for other campaign matches."
                            : "Matched! The recruiter is currently reviewing your KPI achievements and proud situation."
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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
            <Reveal className="stat" delay={50}>
              <h3>0%</h3>
              <p>COMMISSION FEES</p>
            </Reveal>
            <Reveal className="stat" delay={150}>
              <h3>72h</h3>
              <p>AVERAGE MATCH TIME</p>
            </Reveal>
            <Reveal className="stat" delay={250}>
              <h3>₹3.5k+</h3>
              <p>AVG HOURLY RATE</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Compare ---------------- */}
      <section id="benefits" className="compare">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">THE DIFFERENCE</span>
            <h2>Why elite AI builders choose us</h2>
            <p>We built this platform to fix what is broken with standard freelancer websites.</p>
          </Reveal>

          <div className="compare-table">
            <div className="compare-header">
              <span>Feature</span>
              <span>Traditional Upwork/Fiverr</span>
              <span className="compare-highlight">AI Shop International</span>
            </div>
            <div className="compare-row">
              <span className="compare-label">Client Access</span>
              <span>Unvetted, low-budget listings</span>
              <span>Pre-screened tech recruiters</span>
            </div>
            <div className="compare-row">
              <span className="compare-label">Match Method</span>
              <span>Bidding wars / Cover letters</span>
              <span>Direct AI KPI Match</span>
            </div>
            <div className="compare-row">
              <span className="compare-label">Service Fees</span>
              <span>10% to 20% cut from your pay</span>
              <span className="compare-highlight">0% Platform Cut</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQs ---------------- */}
      <section id="faqs" className="faqs">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">QUESTIONS</span>
            <h2>Frequently Asked Questions</h2>
            <p>Clear, direct answers for developers joining the network.</p>
          </Reveal>

          <div className="faq-list">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} className="faq-item">
                  <button
                    onClick={() => toggleFaq(i)}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-icon" aria-hidden="true">{isOpen ? '\u2212' : '+'}</span>
                  </button>
                  <div className={`faq-panel ${isOpen ? 'faq-panel-open' : ''}`}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CTA Banner ---------------- */}
      <section className="cta-banner">
        <div className="container text-center">
          <h2>Ready to scale your career?</h2>
          <p>Complete your profile, submit your KPIs, and get matched to active campaigns.</p>
          <a href="/freelancer" className="btn btn-primary">Submit Your AI Profile</a>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <span className="footer-brand-name">AI Shop International</span>
              <p>Vetted matching network connecting elite AI developers with clients globally.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Platform</h4>
                <a href="#how-it-works">How it Works</a>
                <a href="#benefits">Benefits</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="/credits">Credits</a>
                <a href="/login">Agency Admin</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} AI Shop International. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .home-container {
          background-color: var(--paper-dim);
          color: var(--text);
          min-height: 100vh;
          font-family: var(--font-body);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .text-center { text-align: center; }

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

        /* ---------- Nav ---------- */
        .nav {
          height: 76px;
          display: flex;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: transparent;
          transition: all 0.3s;
        }
        .nav-scrolled {
          background: rgba(245, 244, 240, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--paper-line);
        }
        .nav-inner {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .logo-img {
          width: 28px;
          height: 28px;
          border-radius: 8px;
        }
        .brand-word {
          font-family: var(--font-display);
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .brand-word em {
          color: var(--indigo);
          font-style: normal;
        }
        .nav-links {
          display: flex;
          gap: 32px;
        }
        .nav-links a {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 550;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: var(--text);
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-ghost {
          font-size: 13.5px;
          color: var(--text-muted);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-ghost:hover {
          color: var(--text);
        }

        /* ---------- Hero ---------- */
        .hero {
          position: relative;
          padding: 160px 0 100px;
          background: radial-gradient(120% 140% at 50% 10%, #1c233a 0%, var(--ink) 70%, #06070c 100%);
          color: var(--text-on-ink);
          overflow: hidden;
        }
        .hero-grid {
          display: flex;
          justify-content: center;
          text-align: center;
        }
        .hero-copy {
          max-width: 720px;
        }
        .hero-badge {
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
          font-size: clamp(38px, 5.5vw, 56px);
          line-height: 1.1;
          margin-bottom: 20px;
          color: #ffffff !important;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
        .hero-copy :global(h1 em) {
          color: var(--gold) !important;
          font-style: normal;
        }
        .hero-sub {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-on-ink-muted) !important;
          margin-bottom: 36px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .hero-ctas :global(.btn-secondary) {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          background: transparent !important;
        }
        .hero-ctas :global(.btn-secondary:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: #ffffff !important;
        }
        .hero-social {
          display: flex;
          gap: 12px;
          justify-content: center;
          font-size: 13.5px;
          color: var(--text-on-ink-muted);
          font-family: var(--font-mono);
        }
        .dot-sep {
          color: var(--gold);
        }

        /* ---------- Personal Match Inbox ---------- */
        .inbox-section {
          padding: 80px 0;
          background: var(--paper-dim);
          border-bottom: 1px solid var(--paper-line);
        }
        .inbox-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: var(--shadow-sm);
          max-width: 900px;
          margin: 40px auto 0;
        }
        .inbox-loader {
          text-align: center;
          padding: 40px 0;
          color: var(--text-muted);
        }
        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--indigo-soft);
          border-top-color: var(--indigo);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 12px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .demo-notice {
          background: #fff8e6;
          border: 1px solid #ffeeba;
          color: #856404;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          text-align: center;
        }
        .inbox-empty {
          text-align: center;
          padding: 60px 0;
        }
        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .inbox-empty h3 {
          font-size: 18px;
          color: var(--text);
          margin-bottom: 6px;
        }
        .inbox-empty p {
          color: var(--text-muted);
          font-size: 14px;
        }
        .inbox-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          padding: 24px 0;
          border-bottom: 1px solid var(--paper-line);
        }
        .inbox-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .inbox-item:first-child {
          padding-top: 0;
        }
        .inbox-item-left {
          flex: 1;
        }
        .inbox-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }
        .inbox-header-row h3 {
          font-size: 17px;
          font-weight: 650;
          color: var(--text);
        }
        .match-badge {
          background: rgba(91, 79, 232, 0.08);
          border: 1px solid rgba(91, 79, 232, 0.25);
          color: var(--indigo);
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 99px;
        }
        .job-desc {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 10px;
        }
        .job-kpis {
          font-size: 12.5px;
          background: #f8fafc;
          padding: 8px 12px;
          border-left: 3px solid var(--indigo);
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-bottom: 12px;
        }
        .job-kpis strong {
          color: var(--text);
        }
        .job-kpis span {
          color: var(--text-muted);
        }
        .job-meta {
          font-size: 12.5px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .inbox-item-right {
          width: 220px;
          text-align: right;
          flex-shrink: 0;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .status-badge.approved {
          background: #e6f9f0;
          color: #1dbf73;
          border: 1px solid rgba(29, 191, 115, 0.2);
        }
        .status-badge.approved .status-dot { background: #1dbf73; }
        .status-badge.pending {
          background: #fff8e6;
          color: #b27a00;
          border: 1px solid rgba(178, 122, 0, 0.2);
        }
        .status-badge.pending .status-dot { background: #b27a00; }
        .status-badge.rejected {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid rgba(100, 116, 139, 0.2);
        }
        .status-badge.rejected .status-dot { background: #64748b; }
        
        .status-note {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* ---------- How it Works ---------- */
        .how-it-works {
          padding: 96px 0;
          background: #ffffff;
        }
        .section-head {
          margin-bottom: 54px;
        }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--indigo);
          letter-spacing: 0.12em;
          font-weight: 700;
          display: block;
          margin-bottom: 12px;
        }
        .section-head h2 {
          font-size: 32px;
          color: var(--text);
          margin-bottom: 16px;
          font-weight: 650;
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
          font-weight: 600;
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
          background: var(--paper-dim);
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
          background-color: #ffffff;
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
          background: var(--paper-dim);
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
          font-weight: 650;
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
        @media (max-width: 960px) {
          .inbox-item {
            flex-direction: column;
            gap: 16px;
          }
          .inbox-item-right {
            width: 100%;
            text-align: left;
          }
        }
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
