import { useEffect, useState } from 'react';

const FEATURES = [
  { icon: '◆', title: 'Semantic AI matching', body: 'Vector-matched to your KPIs, not keyword-stuffed resumes.' },
  { icon: '◇', title: 'Vetted, not crowdsourced', body: 'Every profile on the network is reviewed before it\u2019s listed.' },
  { icon: '◈', title: 'Direct introductions', body: 'No bidding wars, no recruiter spam in between.' },
];

const BADGES = ['Encrypted in transit & at rest', 'GDPR-ready data handling', 'SSO-ready architecture'];

/**
 * Shared split-screen shell for every auth page (login, signup, forgot/reset
 * password). Left panel is fixed brand/marketing surface; right panel is a
 * slot for the actual form so each page only has to own its fields + logic.
 */
export default function AuthLayout({ eyebrow = 'AI SHOP INTERNATIONAL', headline, subhead, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="glow glow-a" />
        <div className="glow glow-b" />
        <div className="grid-overlay" />

        <div className={`left-inner ${mounted ? 'in' : ''}`}>
          <a href="/" className="brand" aria-label="AI Shop International home">
            <img src="/logo.png" className="logo-img" alt="" />
            <span>AI Shop <em>International</em></span>
          </a>

          <div className="left-copy">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{headline}</h1>
            <p>{subhead}</p>
          </div>

          <ul className="feature-list">
            {FEATURES.map((f, i) => (
              <li key={f.title} style={{ transitionDelay: `${140 + i * 80}ms` }}>
                <span className="feature-icon" aria-hidden="true">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.body}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="badge-row">
            {BADGES.map((b) => (
              <span className="sec-badge" key={b}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2l7 3v6c0 5-3.4 8.4-7 11-3.6-2.6-7-6-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9 12.5l2 2 4-4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {b}
              </span>
            ))}
          </div>

          <div className="orbit-graphic" aria-hidden="true">
            <div className="orbit-core" />
            <div className="orbit-ring ring-1" />
            <div className="orbit-ring ring-2" />
            <div className="orbit-dot dot-1" />
            <div className="orbit-dot dot-2" />
            <div className="orbit-dot dot-3" />
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="right-inner">{children}</div>
      </div>

      <style jsx>{`
        .auth-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
          background: var(--paper);
        }

        /* ---------------- Left panel ---------------- */
        .auth-left {
          position: relative;
          overflow: hidden;
          background: radial-gradient(120% 140% at 15% 0%, #1c1f3a 0%, var(--ink) 55%, #06070c 100%);
          color: var(--text-on-ink);
          padding: 44px 56px 40px;
          display: flex;
          flex-direction: column;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(85% 75% at 30% 20%, black 40%, transparent 100%);
          pointer-events: none;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.55;
          pointer-events: none;
        }
        .glow-a {
          width: 420px;
          height: 420px;
          top: -140px;
          left: -100px;
          background: radial-gradient(circle, rgba(91, 79, 232, 0.55), transparent 70%);
          animation: drift-a 16s ease-in-out infinite;
        }
        .glow-b {
          width: 380px;
          height: 380px;
          bottom: -160px;
          right: -120px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.28), transparent 70%);
          animation: drift-b 18s ease-in-out infinite;
        }
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 40px); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -25px); }
        }

        .left-inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          max-width: 460px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 600;
          color: var(--text-on-ink);
          margin-bottom: 64px;
          opacity: 0;
          transform: translateY(-6px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .left-inner.in .brand { opacity: 1; transform: translateY(0); }
        .brand em { color: var(--gold); font-style: normal; }
        .logo-img { width: 30px; height: 30px; border-radius: 8px; object-fit: cover; }

        .left-copy {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 60ms, transform 0.6s ease 60ms;
        }
        .left-inner.in .left-copy { opacity: 1; transform: translateY(0); }

        .eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.14em;
          color: var(--gold);
          margin-bottom: 18px;
        }
        .left-copy h1 {
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.15;
          font-weight: 560;
          margin-bottom: 16px;
          color: var(--text-on-ink);
        }
        .left-copy p {
          font-size: 15.5px;
          line-height: 1.65;
          color: var(--text-on-ink-muted);
          max-width: 400px;
        }

        .feature-list {
          list-style: none;
          margin: 40px 0 32px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .feature-list li {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .left-inner.in .feature-list li { opacity: 1; transform: translateY(0); }
        .feature-icon {
          flex-shrink: 0;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(91, 79, 232, 0.22);
          border: 1px solid rgba(91, 79, 232, 0.4);
          color: #b9b0ff;
          font-size: 13px;
        }
        .feature-list strong {
          display: block;
          font-size: 14.5px;
          font-weight: 600;
          color: var(--text-on-ink);
          margin-bottom: 2px;
        }
        .feature-list p {
          font-size: 13.5px;
          color: var(--text-on-ink-muted);
          line-height: 1.5;
        }

        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: auto;
          padding-top: 28px;
        }
        .sec-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11.5px;
          color: var(--text-on-ink-muted);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          padding: 6px 11px;
          border-radius: 999px;
        }
        .sec-badge svg { color: #7d76e0; }

        .orbit-graphic {
          position: absolute;
          right: -60px;
          bottom: -60px;
          width: 260px;
          height: 260px;
          opacity: 0.5;
          pointer-events: none;
        }
        .orbit-core {
          position: absolute;
          inset: 40%;
          border-radius: 50%;
          background: radial-gradient(circle, #8a80ff, transparent 70%);
        }
        .orbit-ring {
          position: absolute;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 50%;
        }
        .ring-1 { inset: 10%; animation: spin 22s linear infinite; }
        .ring-2 { inset: 0%; animation: spin 34s linear infinite reverse; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .orbit-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 12px 2px rgba(201, 162, 39, 0.6);
        }
        .dot-1 { top: 10%; left: 48%; }
        .dot-2 { top: 55%; left: 2%; background: #8a80ff; box-shadow: 0 0 12px 2px rgba(138, 128, 255, 0.6); }
        .dot-3 { bottom: 8%; right: 10%; }

        /* ---------------- Right panel ---------------- */
        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          background: var(--paper);
          position: relative;
        }
        .right-inner {
          width: 100%;
          max-width: 408px;
        }

        @media (max-width: 980px) {
          .auth-shell { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 28px 20px 48px; }
        }
      `}</style>
    </div>
  );
}
