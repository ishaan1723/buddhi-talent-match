import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

/* ------------------------------------------------------------------
   Reveal: lightweight scroll-reveal wrapper (IntersectionObserver).
   Respects prefers-reduced-motion via the CSS in globals.css.
------------------------------------------------------------------- */
function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const heroVisualRef = useRef(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hi! I can point you to the right place — what are you trying to do?' }
  ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Subtle mouse-tracking parallax on the hero visual only.
  const handleHeroMouseMove = useCallback((e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = heroVisualRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--tiltX', `${y * -4}deg`);
    el.style.setProperty('--tiltY', `${x * 6}deg`);
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    const el = heroVisualRef.current;
    if (!el) return;
    el.style.setProperty('--tiltX', '0deg');
    el.style.setProperty('--tiltY', '0deg');
  }, []);

  const faqs = [
    {
      q: 'How does the AI matching engine work?',
      a: 'Our system converts candidate profiles and job descriptions into semantic vector embeddings. Instead of keyword matching, the AI compares contextual meaning between requirements and a freelancer’s real experience to calculate a match score.'
    },
    {
      q: 'Is there any cost for the agency or clients during the trial?',
      a: 'No. The 20-day trial runs on high-performance free cloud hosting tiers, so there are zero database or server infrastructure fees. The only minor cost is pay-as-you-go AI query APIs, averaging under ₹400 for hundreds of searches.'
    },
    {
      q: 'How secure is candidate and client data?',
      a: 'All personal information, profiles, and job listings are stored in a private, encrypted PostgreSQL database behind closed pipelines. Your proprietary data is never used to train public LLM models.'
    },
    {
      q: 'Can we customize the matching criteria?',
      a: 'Yes. The recruiter dashboard lets you adjust matching weights between technical AI skills, years of experience, and target hourly rates (₹) to prioritize what matters for each client.'
    }
  ];

  const skillCategories = [
    { name: 'LLM Engineering', desc: 'Fine-tuning, evals, inference optimization', count: '140+' },
    { name: 'RAG & Vector Search', desc: 'Retrieval pipelines, embeddings, vector DBs', count: '95+' },
    { name: 'AI Agents', desc: 'Tool-use, orchestration, multi-agent systems', count: '80+' },
    { name: 'Computer Vision', desc: 'Detection, segmentation, generative vision', count: '65+' },
    { name: 'NLP & Speech', desc: 'Classification, extraction, speech-to-text', count: '110+' },
    { name: 'MLOps & Infra', desc: 'Serving, monitoring, cost & latency tuning', count: '70+' }
  ];

  const talentSpotlight = [
    {
      initials: 'RK',
      name: 'Rohan K.',
      role: 'Senior LLM & RAG Specialist',
      tags: ['LangChain', 'Pinecone', 'Python'],
      rate: '₹2,200/hr',
      match: '98%'
    },
    {
      initials: 'AS',
      name: 'Ananya S.',
      role: 'Computer Vision Engineer',
      tags: ['PyTorch', 'YOLO', 'Edge AI'],
      rate: '₹1,850/hr',
      match: '96%'
    },
    {
      initials: 'VM',
      name: 'Vikram M.',
      role: 'AI Agent Architect',
      tags: ['AutoGen', 'FastAPI', 'AWS'],
      rate: '₹2,600/hr',
      match: '97%'
    }
  ];

  const testimonials = [
    {
      quote: 'We had a vetted RAG engineer in a live sprint within four days. The match score wasn’t marketing  —  the skills lined up exactly with our stack.',
      role: 'Head of Engineering, Series A fintech'
    },
    {
      quote: 'The dashboard let us tune for experience over raw skill overlap, which is exactly the control a normal freelancer platform never gives you.',
      role: 'VP Product, healthcare AI startup'
    },
    {
      quote: 'Cut our contractor search from six weeks of agency back-and-forth to under a week, at a fraction of the fee.',
      role: 'Founder, applied AI studio'
    }
  ];

  const toggleFaq = (index) => setActiveFaq(activeFaq === index ? null : index);

  const handleChatOption = (option, label) => {
    let replyText = '';
    if (option === 'how_match') {
      replyText = 'We convert candidate profiles and job requirements into semantic embeddings, then score the match on skills, experience, and rate fit.';
    } else if (option === 'how_apply') {
      replyText = 'Click “Apply as AI Freelancer” on this page to submit your profile in under a minute.';
    } else if (option === 'whatsapp') {
      replyText = 'Opening WhatsApp in a new tab  —  our team will pick it up from there.';
      window.open('https://wa.me/919999999999', '_blank');
    }
    setChatMessages((prev) => [...prev, { sender: 'user', text: label }, { sender: 'bot', text: replyText }]);
  };

  return (
    <div className="home">
      <Head>
        <title>AI Shop International  —  Hire Vetted AI Freelancers</title>
        <meta
          name="description"
          content="A vetted network of AI engineers, ML researchers, and prompt specialists, matched to your project by a semantic scoring engine."
        />
      </Head>

      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          <a href="#top" className="brand" aria-label="AI Shop International home">
            <img src="/logo.png" className="logo-img" alt="AI Shop Logo" />
            <span className="brand-word">AI Shop <em>International</em></span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            <a href="#how-it-works">How it Works</a>
            <a href="#skills">AI Skills</a>
            <a href="#talent">Talent</a>
            <a href="#faqs">FAQs</a>
            <a href="/credits">Credits</a>
          </nav>

          <div className="nav-actions">
            <a href="/dashboard" className="nav-ghost">Recruiter Dashboard</a>
            <a href="/client" className="btn btn-primary nav-cta">Hire Talent</a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ---------------- Hero ---------------- */}
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <div className="hero-dotgrid" />
            <div className="hero-glow" />
          </div>

          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">AI TALENT NETWORK</span>
              <h1>
                AI experts, <em>vetted</em> before you ever see them.
              </h1>
              <p className="hero-sub">
                We match your project with AI engineers, ML researchers, and prompt specialists
                who’ve shipped in production  —  scored, ranked, and ready in days, not weeks.
              </p>
              <div className="hero-ctas">
                <a href="/client" className="btn btn-primary">I want to hire AI talent</a>
                <a href="/freelancer" className="btn btn-ghost-dark">Apply as an AI freelancer</a>
              </div>
              <p className="hero-microtrust">No recruiter fees on your pilot · 3-day average time-to-match</p>
            </div>

            <div
              className="hero-visual"
              ref={heroVisualRef}
              onMouseMove={handleHeroMouseMove}
              onMouseLeave={handleHeroMouseLeave}
            >
              <div className="floating-card requirement-card">
                <span className="fc-eyebrow">CLIENT REQUIREMENT</span>
                <h3 className="fc-title">Senior RAG Engineer</h3>
                <div className="fc-tags">
                  <span>LangChain</span><span>Vector DB</span><span>Python</span>
                </div>
                <p className="fc-meta">Remote · ₹2,500/hr budget</p>
              </div>

              <svg className="connector" viewBox="0 0 320 200" aria-hidden="true">
                <path
                  d="M60 55 C 140 55, 140 145, 260 145"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1.6"
                  strokeDasharray="6 7"
                  className="connector-path"
                />
              </svg>

              <div className="match-seal">
                <span className="seal-ring" />
                <span className="seal-value">98%</span>
                <span className="seal-label">Match</span>
              </div>

              <div className="floating-card talent-card">
                <div className="tc-top">
                  <span className="avatar">RK</span>
                  <div className="tc-id">
                    <span className="tc-name">Rohan K.</span>
                    <span className="tc-role">LLM &amp; RAG Specialist</span>
                  </div>
                  <span className="verified-badge">Verified</span>
                </div>
                <div className="fc-tags">
                  <span>LangChain</span><span>Pinecone</span><span>Python</span>
                </div>
                <p className="tc-foot"><span className="dot-live" /> Available now · ₹2,200/hr</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Trust strip ---------------- */}
        <section className="trust-strip">
          <div className="container">
            <Reveal className="trust-inner">
              <span className="trust-label">Built for AI-native teams across</span>
              <div className="trust-tags">
                {['Fintech', 'Healthcare AI', 'E-commerce', 'DevTools', 'Robotics', 'Climate Tech'].map((t) => (
                  <span key={t} className="trust-pill">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------------- How it Works ---------------- */}
        <section id="how-it-works" className="how">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow-dark">HOW IT WORKS</span>
              <h2>Three steps from brief to matched</h2>
              <p className="section-sub">No job board. No résumé pile. Just a scored shortlist.</p>
            </Reveal>

            <div className="steps">
              {[
                { n: '01', title: 'Freelancers join', body: 'AI specialists submit profiles and focus areas in under a minute  —  verified before they’re listed.' },
                { n: '02', title: 'Clients post requirements', body: 'Describe the project and hourly budget in ₹. No generic job description needed.' },
                { n: '03', title: 'The engine scores and ranks', body: 'Every profile is scored against your requirement. Recruiters approve matches from the dashboard.' }
              ].map((step, i) => (
                <Reveal key={step.n} delay={i * 90} className="step">
                  <span className="step-num">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </Reveal>
              ))}
              <div className="step-line" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* ---------------- AI Skills / Categories ---------------- */}
        <section id="skills" className="skills">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow-dark">AI SKILLS</span>
              <h2>Specialists, not generalists</h2>
              <p className="section-sub">Every category below is a distinct vetting track  —  not a keyword tag.</p>
            </Reveal>

            <div className="skills-grid">
              {skillCategories.map((s, i) => (
                <Reveal key={s.name} delay={i * 70} className="skill-card">
                  <div className="skill-top">
                    <h3>{s.name}</h3>
                    <span className="skill-count">{s.count}</span>
                  </div>
                  <p>{s.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Featured Talent ---------------- */}
        <section id="talent" className="talent">
          <div className="container">
            <Reveal className="section-head section-head-light">
              <span className="eyebrow">FEATURED TALENT</span>
              <h2>A glimpse of who’s in the network</h2>
              <p className="section-sub section-sub-light">Anonymized preview  —  full profiles unlock once you post a requirement.</p>
            </Reveal>

            <div className="talent-grid">
              {talentSpotlight.map((t, i) => (
                <Reveal key={t.name} delay={i * 90} className="talent-card-full">
                  <div className="tc-top">
                    <span className="avatar avatar-lg">{t.initials}</span>
                    <div className="tc-id">
                      <span className="tc-name tc-name-light">{t.name}</span>
                      <span className="tc-role tc-role-light">{t.role}</span>
                    </div>
                    <span className="verified-badge">Verified</span>
                  </div>
                  <div className="fc-tags">
                    {t.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className="talent-foot">
                    <span className="talent-match">{t.match} match</span>
                    <span className="talent-rate">{t.rate}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Stats ---------------- */}
        <section id="stats" className="stats">
          <div className="container">
            <div className="stats-grid">
              {[
                { v: '₹5,00,000+', l: 'Saved in recruitment fees' },
                { v: '98.4%', l: 'AI match accuracy' },
                { v: '3 Days', l: 'Average time-to-hire' },
                { v: '₹800–₹5,000', l: 'Typical hourly rates' }
              ].map((s, i) => (
                <Reveal key={s.l} delay={i * 80} className="stat">
                  <h3>{s.v}</h3>
                  <p>{s.l}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Comparison ---------------- */}
        <section className="compare">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow-dark">WHY NOT AN AGENCY</span>
              <h2>Same vetting rigor, none of the overhead</h2>
            </Reveal>
            <Reveal className="compare-table" delay={80}>
              <div className="compare-row compare-head">
                <span></span>
                <span>Traditional agency</span>
                <span className="compare-highlight">AI Shop</span>
              </div>
              {[
                ['Time to shortlist', '2–6 weeks', '3 days avg'],
                ['Matching method', 'Manual keyword search', 'Semantic AI scoring'],
                ['Fee structure', '15–25% placement fee', 'Transparent hourly rate'],
                ['Match transparency', 'Rarely disclosed', 'Visible score, every time']
              ].map((row) => (
                <div className="compare-row" key={row[0]}>
                  <span className="compare-label">{row[0]}</span>
                  <span>{row[1]}</span>
                  <span className="compare-highlight">{row[2]}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------- Testimonials ---------------- */}
        <section className="testimonials">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow-dark">WHAT TEAMS SAY</span>
              <h2>Trusted by teams that ship AI, not just plan it</h2>
            </Reveal>
            <div className="testimonial-grid">
              {testimonials.map((t, i) => (
                <Reveal key={t.role} delay={i * 90} className="testimonial-card">
                  <p className="testimonial-quote">“{t.quote}”</p>
                  <span className="testimonial-role">{t.role}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faqs" className="faq">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow-dark">FAQ</span>
              <h2>Frequently asked questions</h2>
            </Reveal>
            <div className="faq-list">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={faq.q} className={`faq-item ${isOpen ? 'active' : ''}`}>
                    <button
                      className="faq-question"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${index}`}
                    >
                      <span>{faq.q}</span>
                      <span className="faq-icon" aria-hidden="true">{isOpen ? '\u2212' : '+'}</span>
                    </button>
                    <div className="faq-answer" id={`faq-panel-${index}`} role="region">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="final-cta">
          <div className="container final-cta-inner">
            <h2>Ready to hire your first AI expert?</h2>
            <p>Post a requirement and see scored matches within 3 days on average.</p>
            <div className="hero-ctas">
              <a href="/client" className="btn btn-primary">Post a requirement</a>
              <a href="/freelancer" className="btn btn-ghost-dark">Apply as talent</a>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <svg width="26" height="26" viewBox="0 0 30 30" fill="none" aria-hidden="true">
              <circle cx="7" cy="22" r="3.4" stroke="#f5f4f0" strokeWidth="1.4" />
              <circle cx="23" cy="22" r="3.4" stroke="#f5f4f0" strokeWidth="1.4" />
              <circle cx="15" cy="7" r="3.8" fill="#c9a227" />
              <path d="M9.8 20 L13 9.5 M20.2 20 L17 9.5" stroke="#f5f4f0" strokeWidth="1.2" strokeDasharray="1 2.4" />
            </svg>
            <div>
              <span className="footer-brand-name">AI Shop International</span>
              <p className="footer-tag">The vetted network for AI-native hiring.</p>
            </div>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Product</span>
            <a href="#how-it-works">How it Works</a>
            <a href="#skills">AI Skills</a>
            <a href="#talent">Talent</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Company</span>
            <a href="/credits">Framework Credits</a>
            <a href="#faqs">FAQs</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 AI Placement Solutions. All rights reserved.</span>
        </div>
      </footer>

      {/* ---------------- Chat widget ---------------- */}
      <div className="chat-widget">
        {isChatOpen ? (
          <div className="chat-card" role="dialog" aria-label="AI Shop assistant">
            <div className="chat-header">
              <span className="avatar">AI</span>
              <div>
                <h4>AI Shop Assistant</h4>
                <span>Online</span>
              </div>
              <button className="chat-close" onClick={() => setIsChatOpen(false)} aria-label="Close chat">×</button>
            </div>
            <div className="chat-body">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <span className="footer-lbl">Quick actions</span>
              <div className="chat-options">
                <button onClick={() => handleChatOption('how_match', 'How does matching work?')} className="btn-chat-opt">How does matching work?</button>
                <button onClick={() => handleChatOption('how_apply', 'How do I apply?')} className="btn-chat-opt">How do I apply?</button>
                <button onClick={() => handleChatOption('whatsapp', 'Chat on WhatsApp')} className="btn-chat-opt whatsapp">Chat on WhatsApp</button>
              </div>
            </div>
          </div>
        ) : (
          <button className="chat-trigger" onClick={() => setIsChatOpen(true)} aria-label="Open chat assistant">
            <span className="chat-pulse" aria-hidden="true" />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 4h16v12H8l-4 4V4z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: var(--paper);
          display: flex;
          flex-direction: column;
          overflow-x: clip;
        }

        /* ---------- Reveal ---------- */
        :global(.reveal) {
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
          background: var(--ink);
          padding: 96px 0 120px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-dotgrid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(245, 244, 240, 0.09) 1px, transparent 1px);
          background-size: 26px 26px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 70%, transparent);
        }
        .hero-glow {
          position: absolute;
          top: -120px;
          right: -140px;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(91, 79, 232, 0.35), transparent 70%);
          filter: blur(10px);
        }
        .hero-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 60px;
          align-items: center;
        }
        .eyebrow {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.14em;
          color: var(--gold);
          margin-bottom: 20px;
          font-weight: 500;
        }
        .eyebrow-dark {
          color: var(--indigo);
        }
        .hero-copy h1 {
          font-size: 52px;
          line-height: 1.1;
          color: var(--text-on-ink);
          font-weight: 500;
          max-width: 620px;
        }
        .hero-copy h1 em {
          font-style: italic;
          color: var(--gold);
        }
        .hero-sub {
          font-size: 18px;
          line-height: 1.6;
          color: var(--text-on-ink-muted);
          margin: 24px 0 36px;
          max-width: 520px;
        }
        .hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .btn-ghost-dark {
          background: transparent;
          color: var(--text-on-ink);
          border: 1.5px solid var(--ink-line);
        }
        .btn-ghost-dark:hover {
          border-color: var(--text-on-ink-muted);
          background: rgba(255, 255, 255, 0.04);
        }
        .hero-microtrust {
          margin-top: 24px;
          font-size: 13px;
          color: var(--text-on-ink-muted);
          font-family: var(--font-mono);
        }

        /* ---------- Hero visual ---------- */
        .hero-visual {
          position: relative;
          height: 400px;
          --tiltX: 0deg;
          --tiltY: 0deg;
          transform: perspective(900px) rotateX(var(--tiltX)) rotateY(var(--tiltY));
          transition: transform 0.2s ease-out;
        }
        .floating-card {
          position: absolute;
          width: 250px;
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius-md);
          padding: 20px;
          box-shadow: var(--shadow-lg);
          animation: floaty 6s ease-in-out infinite;
        }
        .requirement-card {
          top: 10px;
          left: 0;
        }
        .talent-card {
          bottom: 6px;
          right: 0;
          animation-delay: 1.2s;
        }
        .fc-eyebrow {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--text-on-ink-muted);
        }
        .fc-title {
          font-size: 18px;
          color: var(--text-on-ink);
          margin: 10px 0 12px;
          font-weight: 500;
        }
        .fc-tags {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .fc-tags span {
          font-family: var(--font-mono);
          font-size: 10.5px;
          padding: 4px 9px;
          border-radius: 999px;
          background: rgba(91, 79, 232, 0.16);
          color: #b8b0ff;
        }
        .fc-meta {
          font-size: 12.5px;
          color: var(--text-on-ink-muted);
        }
        .tc-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--indigo), #8b7bff);
          color: #fff;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .avatar-lg {
          width: 44px;
          height: 44px;
          font-size: 13px;
        }
        .tc-id {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .tc-name {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-on-ink);
        }
        .tc-role {
          font-size: 11.5px;
          color: var(--text-on-ink-muted);
        }
        .verified-badge {
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.04em;
          color: var(--gold);
          border: 1px solid rgba(201, 162, 39, 0.4);
          border-radius: 999px;
          padding: 3px 8px;
          flex-shrink: 0;
        }
        .tc-foot {
          font-size: 12px;
          color: var(--text-on-ink-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dot-live {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--success);
          display: inline-block;
          box-shadow: 0 0 0 3px rgba(31, 157, 99, 0.2);
        }

        .connector {
          position: absolute;
          top: 60px;
          left: 40px;
          width: 200px;
          height: 220px;
          pointer-events: none;
        }
        .connector-path {
          animation: dash 3s linear infinite;
        }
        .match-seal {
          position: absolute;
          top: 44%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: var(--ink);
          border: 1.5px solid var(--gold);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-gold);
        }
        .seal-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(201, 162, 39, 0.3);
          animation: ring-pulse 2.6s ease-out infinite;
        }
        .seal-value {
          font-family: var(--font-mono);
          font-size: 16px;
          font-weight: 600;
          color: var(--gold);
        }
        .seal-label {
          font-size: 9px;
          color: var(--text-on-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes dash {
          to { stroke-dashoffset: -130; }
        }
        @keyframes ring-pulse {
          0% { transform: scale(0.9); opacity: 0.9; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* ---------- Trust strip ---------- */
        .trust-strip {
          background: var(--paper-dim);
          border-bottom: 1px solid var(--paper-line);
          padding: 28px 0;
        }
        .trust-inner {
          display: flex;
          align-items: center;
          gap: 22px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .trust-label {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .trust-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .trust-pill {
          font-size: 12.5px;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid var(--paper-line);
          color: var(--text-muted);
          background: #fff;
        }

        /* ---------- Section heads ---------- */
        .section-head {
          text-align: center;
          max-width: 560px;
          margin: 0 auto 56px;
        }
        .section-head h2 {
          font-size: 34px;
          font-weight: 500;
          margin: 6px 0 12px;
        }
        .section-sub {
          color: var(--text-muted);
          font-size: 16px;
        }
        .section-head-light h2 {
          color: var(--text-on-ink);
        }
        .section-sub-light {
          color: var(--text-on-ink-muted);
        }

        /* ---------- How it works ---------- */
        .how {
          padding: 96px 0;
        }
        .steps {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .step-line {
          position: absolute;
          top: 26px;
          left: 8%;
          right: 8%;
          height: 1px;
          background: var(--paper-line);
          z-index: 0;
        }
        .step {
          position: relative;
          z-index: 1;
          background: var(--paper);
          padding-top: 4px;
        }
        .step-num {
          display: inline-flex;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 26px;
          color: var(--gold);
          margin-bottom: 18px;
        }
        .step h3 {
          font-size: 19px;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .step p {
          color: var(--text-muted);
          font-size: 14.5px;
          line-height: 1.65;
        }

        /* ---------- Skills ---------- */
        .skills {
          padding: 96px 0;
          background: var(--paper-dim);
        }
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .skill-card {
          background: #fff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          padding: 24px;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .skill-card:hover {
          transform: translateY(-3px);
          border-color: var(--indigo);
          box-shadow: var(--shadow-md);
        }
        .skill-top {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .skill-top h3 {
          font-size: 16.5px;
          font-weight: 600;
        }
        .skill-count {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--indigo);
          background: var(--indigo-soft);
          border-radius: 999px;
          padding: 3px 9px;
          flex-shrink: 0;
        }
        .skill-card p {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.55;
        }

        /* ---------- Talent ---------- */
        .talent {
          padding: 96px 0;
          background: var(--ink);
        }
        .talent-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .talent-card-full {
          background: var(--ink-soft);
          border: 1px solid var(--ink-line);
          border-radius: var(--radius-md);
          padding: 22px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .talent-card-full:hover {
          transform: translateY(-3px);
          border-color: var(--gold);
        }
        .tc-name-light { color: var(--text-on-ink); }
        .tc-role-light { color: var(--text-on-ink-muted); }
        .talent-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid var(--ink-line);
        }
        .talent-match {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--gold);
        }
        .talent-rate {
          font-family: var(--font-mono);
          font-size: 12.5px;
          color: var(--text-on-ink-muted);
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
        .stat h3 {
          font-size: 34px;
          color: #ffffff !important;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .stat p {
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
        }
        .compare-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          padding: 16px 22px;
          font-size: 14px;
          border-bottom: 1px solid var(--paper-line);
        }
        .compare-row:last-child {
          border-bottom: none;
        }
        .compare-head {
          background: var(--paper-dim);
          font-family: var(--font-mono);
          font-size: 11.5px;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .compare-label {
          font-weight: 600;
          color: var(--text);
        }
        .compare-highlight {
          color: var(--indigo);
          font-weight: 600;
        }

        /* ---------- Testimonials ---------- */
        .testimonials {
          padding: 96px 0;
          background: var(--paper-dim);
        }
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        .testimonial-card {
          background: #fff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-md);
          padding: 28px;
        }
        .testimonial-quote {
          font-family: var(--font-display);
          font-size: 16.5px;
          line-height: 1.55;
          color: var(--text);
          margin-bottom: 18px;
        }
        .testimonial-role {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
        }

        /* ---------- FAQ ---------- */
        .faq {
          padding: 96px 0;
        }
        .faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .faq-item {
          background: #fff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .faq-item:hover, .faq-item.active {
          border-color: var(--indigo);
        }
        .faq-question {
          width: 100%;
          padding: 20px 24px;
          background: none;
          border: none;
          text-align: left;
          font-size: 15.5px;
          font-weight: 600;
          color: var(--text);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .faq-icon {
          font-size: 19px;
          color: var(--indigo);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          padding: 0 24px;
        }
        .faq-item.active .faq-answer {
          max-height: 220px;
          padding-bottom: 20px;
        }
        .faq-answer p {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 14px;
        }

        /* ---------- Final CTA ---------- */
        .final-cta {
          background: var(--ink);
          padding: 96px 0;
          text-align: center;
        }
        .final-cta-inner h2 {
          color: var(--text-on-ink);
          font-size: 32px;
          margin-bottom: 12px;
        }
        .final-cta-inner p {
          color: var(--text-on-ink-muted);
          margin-bottom: 32px;
        }
        .final-cta .hero-ctas {
          justify-content: center;
        }

        /* ---------- Footer ---------- */
        .footer {
          padding: 56px 0 0;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
        }
        .footer-brand {
          display: flex;
          gap: 12px;
        }
        .footer-brand-name {
          font-family: var(--font-display);
          font-size: 16px;
          color: var(--text-on-ink);
          display: block;
        }
        .footer-tag {
          font-size: 13px;
          margin-top: 6px;
          max-width: 240px;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-col-title {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--text-on-ink-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .footer-col a {
          font-size: 13.5px;
        }
        .footer-bottom {
          border-top: 1px solid var(--ink-line);
          padding: 20px 0;
          font-size: 12.5px;
        }

        /* ---------- Chat widget ---------- */
        .chat-widget {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 1000;
        }
        .chat-trigger {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: var(--indigo);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          position: relative;
        }
        .chat-trigger:hover {
          background: var(--indigo-hover);
        }
        .chat-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: var(--indigo);
          opacity: 0.4;
          z-index: -1;
          animation: chatpulse 2.4s infinite;
        }
        @keyframes chatpulse {
          0% { transform: scale(0.95); opacity: 0.4; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .chat-card {
          width: 340px;
          height: 460px;
          background: #fff;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .chat-header {
          background: var(--ink);
          color: #fff;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .chat-header h4 {
          font-size: 14px;
          color: #fff;
        }
        .chat-header span {
          font-size: 11px;
          color: var(--text-on-ink-muted);
        }
        .chat-close {
          position: absolute;
          top: 14px;
          right: 16px;
          background: none;
          border: none;
          color: #fff;
          font-size: 22px;
          cursor: pointer;
        }
        .chat-body {
          flex: 1;
          padding: 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--paper-dim);
        }
        .chat-message {
          max-width: 82%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.5;
        }
        .chat-message.bot {
          background: #fff;
          border: 1px solid var(--paper-line);
          align-self: flex-start;
        }
        .chat-message.user {
          background: var(--indigo);
          color: #fff;
          align-self: flex-end;
        }
        .chat-footer {
          padding: 14px 18px;
          border-top: 1px solid var(--paper-line);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .footer-lbl {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .chat-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .btn-chat-opt {
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 500;
          text-align: left;
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-chat-opt:hover {
          border-color: var(--indigo);
          color: var(--indigo);
        }
        .btn-chat-opt.whatsapp {
          color: #128c7e;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 960px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }
          .hero-visual {
            height: 340px;
            margin-top: 20px;
          }
          .steps, .skills-grid, .talent-grid, .testimonial-grid {
            grid-template-columns: 1fr;
          }
          .step-line { display: none; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .compare-row {
            font-size: 13px;
            padding: 14px 16px;
          }
        }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-actions { gap: 10px; }
          .nav-ghost { font-size: 12px; }
          .nav-cta { padding: 8px 14px; font-size: 12px; }
          .hero { padding: 64px 0 80px; }
          .hero-copy h1 { font-size: 36px; }
          .hero-sub { font-size: 16px; }
          .hero-ctas { flex-direction: column; }
          .hero-ctas .btn { width: 100%; }
          .floating-card { width: 210px; padding: 16px; }
          .requirement-card { left: 0; top: 0; }
          .talent-card { right: 0; bottom: 0; }
          .connector { display: none; }
          .match-seal { display: none; }
          .section-head h2 { font-size: 26px; }
          .compare-row { grid-template-columns: 1fr; gap: 4px; }
          .chat-card { width: calc(100vw - 40px); height: 420px; }
          .chat-widget { bottom: 20px; right: 20px; }
        }
      `}</style>
    </div>
  );
}
