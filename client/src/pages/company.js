import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getStoredUser, getToken, clearSession } from '../utils/auth';
import { API_URL } from '../config';
import { fetchWithTimeout } from '../utils/fetchHelper';

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
  const [activeFaq, setActiveFaq] = useState(null);

  // Approved Matches State
  const [approvedMatches, setApprovedMatches] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(false);
  const [fetchError, setFetchError] = useState('');

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

  // Fetch approved matches for requirements posted by this company
  useEffect(() => {
    if (currentUser) {
      const fetchApprovedHires = async () => {
        setLoadingApproved(true);
        setFetchError('');
        try {
          const res = await fetchWithTimeout(
            `${API_URL}/api/matches/company/approved?email=${encodeURIComponent(currentUser.email)}`, 
            { timeout: 10000 }
          );
          if (res.ok) {
            const data = await res.json();
            setApprovedMatches(data);
          } else {
            throw new Error(`API error code: ${res.status}`);
          }
        } catch (err) {
          console.error("Failed to load approved matches. Running mock fallback.", err);
          setFetchError("Failed to fetch live matches. Running in demo mode.");
          // Mock data fallback so the user always has a working demo
          setApprovedMatches([
            {
              id: 301,
              job_id: 1,
              match_score: 95.8,
              job_title: 'Senior RAG Engineer',
              freelancer_name: 'Ishaan Jain',
              freelancer_email: 'ishaan.jain@example.com',
              linkedin_url: 'https://linkedin.com/in/ishaan-jain-ai',
              primary_skill: 'LLM Orchestration, LangChain, Vector Database indexing',
              experience: 4,
              hourly_rate: 2200,
              kpi_achieved: 'Reduced search query latency by 45% and scaled vector index chunking.',
              proud_situation: 'Built high-scale enterprise chatbot handling 50k concurrent requests.'
            }
          ]);
        } finally {
          setLoadingApproved(false);
        }
      };
      fetchApprovedHires();
    }
  }, [currentUser]);

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
            <a href="/dashboard" className="nav-ghost">Recruiter Dashboard</a>
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
                  <span className="step-circle">1</span>
                  <div>
                    <h4>Submit Requirement</h4>
                    <p>Outline project scope, expected KPIs, and tech stack details.</p>
                  </div>
                </li>
                <li>
                  <span className="step-circle">2</span>
                  <div>
                    <h4>AI Semantic Search</h4>
                    <p>Engine matches job requirements with verified past achievements.</p>
                  </div>
                </li>
                <li>
                  <span className="step-circle">3</span>
                  <div>
                    <h4>Direct Connection</h4>
                    <p>Unlock developer contacts and schedule interviews directly.</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Approved Matches Section ---------------- */}
      <section className="approved-section" id="approved-matches">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">APPROVED HIRES</span>
            <h2>My Candidate Introductions</h2>
            <p>Below are matched AI specialists approved for your requirements. You have unlocked their full contact information.</p>
          </Reveal>

          <div className="approved-list-card card">
            {loadingApproved ? (
              <div className="loader">
                <div className="spinner"></div>
                <p>Loading approved candidate connections...</p>
              </div>
            ) : approvedMatches.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🤝</span>
                <h3>No Approved Matches Yet</h3>
                <p>Once our agency admin approves matched talent for your job postings, their profiles and contact details will unlock here.</p>
              </div>
            ) : (
              <div className="approved-list">
                {fetchError && <p className="demo-notice">{fetchError}</p>}
                {approvedMatches.map((match) => (
                  <div key={match.id} className="approved-item">
                    
                    {/* Left Block: Match info & KPIs */}
                    <div className="approved-item-left">
                      <div className="approved-header-row">
                        <h3>{match.freelancer_name}</h3>
                        <span className="match-badge">{Math.round(match.match_score)}% Match</span>
                        <span className="role-tag">Matched to: {match.job_title}</span>
                      </div>
                      
                      <p className="skills"><strong>Expertise:</strong> {match.primary_skill} ({match.experience} yrs exp)</p>
                      
                      {match.kpi_achieved && (
                        <div className="kpi-box">
                          <strong>KPI Achieved:</strong> <span>{match.kpi_achieved}</span>
                        </div>
                      )}
                      
                      {match.proud_situation && (
                        <div className="situation-box">
                          <strong>Proud Accomplishment:</strong> <span>{match.proud_situation}</span>
                        </div>
                      )}
                    </div>

                    {/* Right Block: Contact & Budget details */}
                    <div className="approved-item-right">
                      <div className="contact-box">
                        <h4>Direct Contact</h4>
                        <a href={`mailto:${match.freelancer_email}`} className="contact-link email-link">
                          📧 {match.freelancer_email}
                        </a>
                        <a href={match.linkedin_url} target="_blank" rel="noopener noreferrer" className="contact-link linkedin-link">
                          🔗 View LinkedIn Profile
                        </a>
                      </div>
                      <div className="rate-box">
                        <span>Requested Rate:</span>
                        <strong>₹{match.hourly_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</strong>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- Value Proposition ---------------- */}
      <section className="value-prop">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">THE BUDGET</span>
            <h2>Vetted talent. Zero markup fees.</h2>
            <p>Our flat connection pricing model beats typical placement agency costs by thousands of dollars.</p>
          </Reveal>

          <div className="compare-grid">
            <Reveal className="compare-card">
              <h4>Typical Placement Agencies</h4>
              <div className="compare-pricing">20% - 30%</div>
              <p className="compare-label">ANNUAL SALARY MARKUP</p>
              <ul className="compare-features">
                <li>High cost of hiring</li>
                <li>Long negotiation processes</li>
                <li>Hiring risk if candidate leaves</li>
              </ul>
            </Reveal>

            <Reveal className="compare-card highlight" delay={100}>
              <span className="card-badge">RECOMMENDED</span>
              <h4>AI Shop International</h4>
              <div className="compare-pricing">Flat Fee</div>
              <p className="compare-label">ONE-TIME CONNECTION CHARGE</p>
              <ul className="compare-features">
                <li>No ongoing markups</li>
                <li>Direct client-freelancer contract</li>
                <li>Pre-vetted performance metrics</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- FAQs ---------------- */}
      <section className="faq-section">
        <div className="container">
          <Reveal className="section-head text-center">
            <span className="eyebrow">HELP</span>
            <h2>Frequently Asked Questions</h2>
            <p>Answers to common questions about billing, security, and developer contracts.</p>
          </Reveal>

          <div className="faq-list">
            {[
              {
                q: "How does the flat connection fee structure work?",
                a: "There are no monthly listing fees. When you review candidate matches and choose to unlock their contact information, we collect a flat placement engine connection fee. You then negotiate rates directly with the freelancer, paying zero platform commissions."
              },
              {
                q: "What standards must freelancers pass to join the network?",
                a: "Every candidate profile undergoes coding evaluations and technical resume screening. We require candidates to document verified achievements and past project turnaround scenarios to validate their senior capabilities."
              },
              {
                q: "Can we hire developers for long-term contract roles?",
                a: "Yes. All freelancers in our database negotiate rates and contracts directly with you. Many are looking for full-time or long-term contract roles."
              }
            ].map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} className="faq-item">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
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

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <span className="footer-brand-name">AI Shop International</span>
              <p>The premium pre-vetted matching engine network connecting businesses with global AI talent.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Portal</h4>
                <a href="#approved-matches">Approved Matches</a>
                <a href="/client">Post a Requirement</a>
              </div>
              <div className="footer-col">
                <h4>Admin</h4>
                <a href="/dashboard">Agency Login</a>
                <a href="/credits">Credits</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} AI Shop International. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .company-portal {
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
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 80px;
          align-items: center;
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
          font-size: clamp(38px, 5.5vw, 54px);
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
        .hero-p {
          font-size: 16.5px;
          line-height: 1.65;
          color: var(--text-on-ink-muted) !important;
          margin-bottom: 36px;
        }
        .info-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius-lg);
          padding: 32px;
        }
        .info-card h3 {
          font-size: 18px;
          color: #ffffff;
          margin-bottom: 24px;
          font-weight: 600;
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
        .step-circle {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          background: var(--indigo);
          color: #ffffff;
          font-weight: 700;
          font-size: 13px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pipeline-steps h4 {
          font-size: 14.5px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }
        .pipeline-steps p {
          font-size: 12.5px;
          color: var(--text-on-ink-muted);
          line-height: 1.5;
        }

        /* ---------- Approved Matches Section ---------- */
        .approved-section {
          padding: 80px 0;
          background: var(--paper-dim);
          border-bottom: 1px solid var(--paper-line);
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
        .approved-list-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 30px;
          box-shadow: var(--shadow-sm);
          max-width: 960px;
          margin: 40px auto 0;
        }
        .loader {
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
        .empty-state {
          text-align: center;
          padding: 60px 0;
        }
        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .empty-state h3 {
          font-size: 18px;
          color: var(--text);
          margin-bottom: 6px;
        }
        .empty-state p {
          color: var(--text-muted);
          font-size: 14px;
        }
        .approved-item {
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 36px;
          padding: 28px 0;
          border-bottom: 1px solid var(--paper-line);
        }
        .approved-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .approved-item:first-child {
          padding-top: 0;
        }
        .approved-item-left {
          flex: 1;
        }
        .approved-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .approved-header-row h3 {
          font-size: 19px;
          font-weight: 700;
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
        .role-tag {
          font-size: 12px;
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          color: var(--text-muted);
          padding: 2px 10px;
          border-radius: 99px;
          font-weight: 550;
        }
        .skills {
          font-size: 14px;
          color: var(--text);
          margin-bottom: 14px;
        }
        .kpi-box, .situation-box {
          font-size: 13px;
          background: #f8fafc;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          margin-bottom: 10px;
        }
        .kpi-box { border-left: 3px solid var(--indigo); }
        .situation-box { border-left: 3px solid var(--gold); }
        .kpi-box strong, .situation-box strong { color: var(--text); }
        .kpi-box span, .situation-box span { color: var(--text-muted); }

        .approved-item-right {
          width: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-left: 1px solid var(--paper-line);
          padding-left: 36px;
          flex-shrink: 0;
        }
        .contact-box h4 {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
        .contact-link {
          display: block;
          font-size: 13.5px;
          color: var(--indigo);
          text-decoration: none;
          margin-bottom: 8px;
          font-weight: 550;
        }
        .contact-link:hover {
          text-decoration: underline;
        }
        .rate-box {
          margin-top: 16px;
          font-size: 13px;
          color: var(--text-muted);
        }
        .rate-box strong {
          display: block;
          font-size: 20px;
          color: var(--text);
          margin-top: 2px;
        }

        /* ---------- Value Proposition ---------- */
        .value-prop {
          padding: 96px 0;
          background: #ffffff;
          border-bottom: 1px solid var(--paper-line);
        }
        .compare-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          max-width: 840px;
          margin: 40px auto 0;
        }
        .compare-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 40px;
          text-align: center;
          position: relative;
          box-shadow: var(--shadow-sm);
        }
        .compare-card.highlight {
          border-color: var(--indigo);
          box-shadow: var(--shadow-md);
        }
        .card-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--indigo);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 99px;
          letter-spacing: 0.06em;
        }
        .compare-card h4 {
          font-size: 16px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }
        .compare-pricing {
          font-size: 40px;
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .compare-label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--indigo);
          font-weight: 700;
          margin-bottom: 30px;
        }
        .compare-features {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: left;
          border-top: 1px solid var(--paper-line);
          padding-top: 24px;
          font-size: 14.5px;
          color: var(--text-muted);
        }
        .compare-features li {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* ---------- FAQs ---------- */
        .faq-section {
          padding: 96px 0;
          background: var(--paper-dim);
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
          .hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .approved-item { flex-direction: column; gap: 20px; }
          .approved-item-right {
            width: 100%;
            border-left: none;
            padding-left: 0;
            border-top: 1px solid var(--paper-line);
            padding-top: 20px;
          }
          .compare-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .hero-copy h1 { font-size: 38px; }
          .footer-inner { grid-template-columns: 1fr; gap: 40px; }
          .nav-actions { gap: 10px; }
          .nav-ghost { font-size: 12px; }
          .nav-cta { padding: 8px 14px; font-size: 12px; }
        }
      `}</style>
    </div>
  );
}
