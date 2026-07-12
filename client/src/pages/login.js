import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { login, saveSession } from '../utils/auth';

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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({ email, password, rememberMe });
      saveSession(data, rememberMe);
      router.push('/');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-portal-page">
      <Head>
        <title>Log In | AI Shop International</title>
        <meta name="description" content="Sign in to AI Shop International to hire vetted AI freelancers or apply as talent." />
      </Head>

      {/* ---------------- Nav ---------------- */}
      <header className="nav">
        <div className="nav-inner container">
          <a href="/" className="brand" aria-label="AI Shop International home">
            <img src="/logo.png" className="logo-img" alt="AI Shop Logo" />
            <span className="brand-word">AI Shop <em>International</em></span>
          </a>
          <div className="nav-actions">
            <a href="/signup" className="btn btn-secondary">Create Account</a>
          </div>
        </div>
      </header>

      {/* ---------------- Hero (Split Layout) ---------------- */}
      <section className="hero">
        <div className="container hero-grid">
          
          {/* Left Column: Impressive Marketing Info */}
          <div className="hero-copy">
            <Reveal className="hero-badge">PRE-VETTED AI TALENT NETWORK</Reveal>
            <Reveal delay={100} as="h1">
              Where AI teams find their <em>next expert</em>.
            </Reveal>
            <Reveal delay={200} as="p" className="hero-p">
              Access the world's most elite database of screened machine learning engineers, prompt specialists, and RAG builders. Enter your credentials to view matches and launch campaign runs.
            </Reveal>
            
            <div className="hero-bullets">
              <Reveal delay={300} className="bullet-item">
                <span className="bullet-icon">⚡</span>
                <div>
                  <strong>Semantic Scoring Engine</strong>
                  <p>Our algorithms weigh candidate KPI achievements against your budget and technical requirements.</p>
                </div>
              </Reveal>
              <Reveal delay={350} className="bullet-item">
                <span className="bullet-icon">🛡️</span>
                <div>
                  <strong>Guaranteed Vetted Standards</strong>
                  <p>No crowdsourced clutter. Every engineer profile must undergo coding verify checks and background tests.</p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right Column: Beautiful Login Card */}
          <div className="hero-form-side">
            <Reveal delay={150} className="login-card">
              <h2>Sign In</h2>
              <p className="card-subtitle">Enter your account details to access the portal.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    type="email"
                    className={`input ${errors.email ? 'input-error' : ''}`}
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrap">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`input ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      style={{ paddingRight: 60 }}
                      required
                    />
                    <button type="button" className="toggle-visibility" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? 'HIDE' : 'SHOW'}
                    </button>
                  </div>
                  {errors.password && <p className="error-text">{errors.password}</p>}
                </div>

                <div className="row-between">
                  <label className="checkbox-wrap">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    Remember me
                  </label>
                  <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                </div>

                {formError && (
                  <p className="error-alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {formError}
                  </p>
                )}

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Signing in..." : "Log In"}
                </button>
              </form>

              <div className="card-footer">
                <p>New to AI Shop? <a href="/signup">Create account</a></p>
                <p>Are you an AI freelancer? <a href="/freelancer">Apply here</a></p>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* ---------------- Section 2: Vetting Details (More Information) ---------------- */}
      <section className="info-section">
        <div className="container">
          <Reveal className="text-center">
            <h2>Our Rigorous Vetting Standard</h2>
            <p className="section-subtitle">We screen out 97% of applicants to deliver elite talent.</p>
          </Reveal>
          
          <div className="info-grid">
            <div className="info-card-box">
              <span className="info-icon">💻</span>
              <h3>1. Practical Coding Verify</h3>
              <p>Candidates must pass timed, live-coding tests focusing on machine learning operations (MLOps), RAG integrations, and framework expertise.</p>
            </div>
            <div className="info-card-box">
              <span className="info-icon">📊</span>
              <h3>2. KPI Achievements Audited</h3>
              <p>We analyze their proudest turnarounds, metrics, and business impacts, sorting matching profiles based on actual performance data.</p>
            </div>
            <div className="info-card-box">
              <span className="info-icon">🤝</span>
              <h3>3. Match Alignment</h3>
              <p>Our semantic search maps matching candidate traits, rate metrics, and timezone windows to your requirements for high-velocity startup integrations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Section 3: Interactive FAQ ---------------- */}
      <section className="faq-section">
        <div className="container">
          <Reveal className="text-center">
            <h2>Frequently Asked Questions</h2>
            <p className="section-subtitle">Got questions about the onboarding or matching process? We have answers.</p>
          </Reveal>

          <div className="faq-list">
            {[
              {
                q: "What is AI Shop International?",
                a: "AI Shop International is a premium, pre-vetted matching network for elite artificial intelligence, machine learning, and data engineering experts. We connect companies with proven developers instantly."
              },
              {
                q: "How does the recruiter dashboard matching work?",
                a: "Placement agency admins access our match scoring portal. When a client submits requirements, our semantic system indexes vector scores against candidate achievements, presenting verified talent matches."
              },
              {
                q: "What costs are involved for companies?",
                a: "There are no listing or subscription fees. Companies only pay a pre-negotiated flat connection fee once a contract begins."
              },
              {
                q: "Are the candidates contract-ready?",
                a: "Yes. All indexed AI freelancers have pre-negotiated rate ranges and timezone windows, enabling immediate startup integration within 72 hours."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${activeFaq === idx ? 'faq-active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="faq-trigger">
                  <span>{faq.q}</span>
                  <span className="faq-icon">+</span>
                </div>
                <div className="faq-content">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} AI Shop International. All rights reserved.</p>
          <div className="footer-links">
            <a href="/credits">Credits</a>
            <a href="/login">Agency Login</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .login-portal-page {
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

        /* Nav Header styling */
        .nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          padding: 24px 0;
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
          color: #ffffff;
        }
        .brand-word em {
          color: var(--gold);
          font-style: normal;
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
        .nav-actions :global(.btn-secondary) {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          background: transparent !important;
          font-size: 13.5px;
          padding: 8px 16px;
        }
        .nav-actions :global(.btn-secondary:hover) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: #ffffff !important;
        }

        /* Hero (Split Screen on top of Dark Background) */
        .hero {
          position: relative;
          padding: 160px 0 100px;
          background: radial-gradient(120% 140% at 50% 10%, #141729 0%, var(--ink) 70%, #06070c 100%);
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
        .hero-bullets {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .bullet-item {
          display: flex;
          gap: 16px;
        }
        .bullet-icon {
          flex-shrink: 0;
          font-size: 20px;
          background: rgba(91, 79, 232, 0.15);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bullet-item strong {
          display: block;
          font-size: 14.5px;
          color: #ffffff;
          margin-bottom: 2px;
        }
        .bullet-item p {
          font-size: 13px;
          color: var(--text-on-ink-muted);
          line-height: 1.45;
        }

        /* Hero Login Form Card Side */
        .hero-form-side {
          display: flex;
          justify-content: flex-end;
        }
        .login-card {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          padding: 40px;
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 440px;
          box-shadow: var(--shadow-lg);
        }
        .login-card h2 {
          font-size: 24px;
          color: #ffffff;
          margin-bottom: 6px;
          font-weight: 650;
        }
        .card-subtitle {
          font-size: 13.5px;
          color: var(--text-on-ink-muted);
          margin-bottom: 28px;
        }
        .field {
          margin-bottom: 20px;
        }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-on-ink-muted);
          margin-bottom: 8px;
        }
        .input {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--ink-line);
          color: #fff;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .input:focus {
          border-color: var(--indigo);
          outline: none;
          background: rgba(255, 255, 255, 0.08);
        }
        .input-error {
          border-color: #d84c4c;
        }
        .input-wrap {
          position: relative;
        }
        .toggle-visibility {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-on-ink-muted);
          cursor: pointer;
        }
        .toggle-visibility:hover {
          color: #ffffff;
        }
        .error-text {
          font-size: 12px;
          color: #d84c4c;
          margin-top: 6px;
        }
        .error-alert {
          background: rgba(216, 76, 76, 0.1);
          border: 1px solid rgba(216, 76, 76, 0.3);
          color: #f7a0a0;
          font-size: 13.5px;
          padding: 10px 14px;
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1.4;
        }
        .row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13.5px;
          margin-bottom: 24px;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-on-ink-muted);
          cursor: pointer;
        }
        .checkbox-wrap input {
          width: 15px;
          height: 15px;
          accent-color: var(--indigo);
        }
        .forgot-link {
          color: var(--gold);
        }
        .btn-block {
          width: 100%;
          justify-content: center;
          padding: 12px 20px;
          font-size: 14.5px;
        }
        .card-footer {
          margin-top: 24px;
          border-top: 1px solid var(--ink-line);
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 13px;
        }
        .card-footer p {
          color: var(--text-on-ink-muted);
        }
        .card-footer a {
          color: var(--gold);
          font-weight: 550;
        }

        /* Info Section (Rigorous Vetting) */
        .info-section {
          padding: 100px 0;
          background: var(--paper-dim);
        }
        .text-center h2 {
          font-size: 32px;
          margin-bottom: 12px;
          font-weight: 650;
        }
        .section-subtitle {
          color: var(--text-muted);
          font-size: 15px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 60px;
        }
        .info-card-box {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 40px 32px;
          text-align: center;
        }
        .info-icon {
          font-size: 40px;
          margin-bottom: 20px;
          display: block;
        }
        .info-card-box h3 {
          font-size: 18px;
          margin-bottom: 12px;
          font-weight: 600;
        }
        .info-card-box p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* FAQ accordion styling */
        .faq-section {
          padding: 100px 0;
          background: #ffffff;
          border-top: 1px solid var(--paper-line);
        }
        .faq-list {
          max-width: 720px;
          margin: 40px auto 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .faq-item:hover {
          border-color: var(--indigo);
        }
        .faq-trigger {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 15px;
        }
        .faq-icon {
          font-size: 18px;
          color: var(--indigo);
          transition: transform 0.2s ease;
        }
        .faq-active .faq-icon {
          transform: rotate(45deg);
        }
        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.2s cubic-bezier(0, 1, 0, 1);
          padding: 0 24px;
        }
        .faq-active .faq-content {
          max-height: 1000px;
          padding: 0 24px 20px;
          transition: max-height 0.4s ease-in-out;
        }
        .faq-content p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          background: var(--ink);
          color: var(--text-on-ink-muted);
          padding: 40px 0;
          border-top: 1px solid var(--ink-line);
          font-size: 13.5px;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-links {
          display: flex;
          gap: 20px;
        }
        .footer-links a {
          color: var(--text-on-ink-muted);
        }
        .footer-links a:hover {
          color: #ffffff;
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .hero-form-side {
            justify-content: center;
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
          .footer-inner {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
