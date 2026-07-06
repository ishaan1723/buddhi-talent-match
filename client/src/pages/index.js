import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Floating AI Chatbot / WhatsApp Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to AI Shop International. How can I assist you today?' }
  ]);

  const faqs = [
    {
      q: "How does the AI matching engine work?",
      a: "Our system converts candidate profiles and job descriptions into semantic vector embeddings. Instead of looking for simple keyword matches, the AI compares the contextual meaning of the requirements with the freelancer's actual experience, calculating a highly accurate match score."
    },
    {
      q: "Is there any cost for the agency or clients during the trial?",
      a: "No! The 20-day trial is built using high-performance free cloud hosting tiers, meaning there are zero database or server infrastructure fees. The only minor cost is pay-as-you-go AI query APIs, which average less than ₹400 for hundreds of searches."
    },
    {
      q: "How secure is candidate and client data?",
      a: "All personal information, LinkedIn profiles, and job listings are stored in a private, encrypted PostgreSQL database. We use secure closed pipelines, meaning your proprietary data is never used to train public LLM models."
    },
    {
      q: "Can we customize the matching criteria?",
      a: "Yes. The agency admin dashboard allows recruiters to adjust matching weights between technical AI skills, years of experience, and target hourly rates (₹) to prioritize different client needs."
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleChatOption = (option, label) => {
    let replyText = '';
    if (option === 'how_match') {
      replyText = 'We convert candidate profiles and job files into semantic vector embeddings to calculate a match score against job descriptions.';
    } else if (option === 'how_apply') {
      replyText = 'You can click the "Apply as AI Freelancer" button on the homepage to submit your profile in under a minute!';
    } else if (option === 'whatsapp') {
      replyText = 'Connecting you to our team on WhatsApp...';
      window.open('https://wa.me/919999999999', '_blank');
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: label },
      { sender: 'bot', text: replyText }
    ]);
  };

  return (
    <div className="home-container">
      <Head>
        <title>AI Shop International | Connect with AI Freelancers</title>
      </Head>

      {/* Modern Enhanced Header */}
      <header className="navbar">
        <div className="brand">
          <img src="/logo.png" alt="AI Shop Logo" className="logo-img" />
          <span className="brand-name">AI Shop International</span>
        </div>
        <nav className="nav-links">
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <a href="#stats" className="nav-link">Stats</a>
          <a href="#faqs" className="nav-link">FAQs</a>
          <a href="/credits" className="nav-link">Framework Credits</a>
        </nav>
        <div className="nav-actions">
          <a href="/dashboard" className="btn btn-secondary">Recruiter Dashboard</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Top-Tier <span className="highlight">AI Freelancers</span> for Your Growth</h1>
          <p>
            An AI-powered placement platform matching specialized AI developers, NLP engineers, and prompt engineers with businesses in seconds.
          </p>

          <div className="cta-buttons">
            <a href="/client" className="btn btn-primary cta-btn">
              I Want to Hire AI Talent
            </a>
            <a href="/freelancer" className="btn btn-secondary cta-btn">
              Apply as AI Freelancer
            </a>
          </div>
        </div>

        {/* Hero Visual Block with AI Generated Tech Image */}
        <div className="hero-graphic">
          <div className="image-wrapper">
            <img 
              src="/hero_tech_graphic.png" 
              alt="AI Neural Network Illustration" 
              className="hero-img"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>₹5,00,000+</h3>
              <p>Saved in Recruitment Fees</p>
            </div>
            <div className="stat-card">
              <h3>98.4%</h3>
              <p>AI Match Accuracy</p>
            </div>
            <div className="stat-card">
              <h3>3 Days</h3>
              <p>Average Time-to-Hire</p>
            </div>
            <div className="stat-card">
              <h3>₹800 - ₹5,000</h3>
              <p>Average Hourly Rates</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>Simple, Efficient Matching</h2>
          <p className="section-subtitle">How we connect companies with top AI developers</p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h4>Freelancers Join</h4>
              <p>Freelancers enter their LinkedIn profiles and AI focus areas in under a minute.</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h4>Clients Post Requirements</h4>
              <p>Companies describe their projects and specify hourly budgets in Indian Rupees (₹).</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h4>AI Analyzes & Curates</h4>
              <p>The matching engine scores candidates. Recruiters approve matches via the dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faqs" className="faq-section">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.q}</span>
                  <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-brand">
            <img src="/logo.png" alt="AI Shop Logo" className="logo-img-small" />
            <span>AI Shop International</span>
          </div>
          <div className="footer-links">
            <a href="/credits">AI Shop Framework Credits</a>
            <span>•</span>
            <span>© 2026 AI Placement Solutions. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Interactive AI Chatbot & WhatsApp Floating Widget */}
      <div className="chatbot-widget">
        {isChatOpen ? (
          <div className="chat-card card">
            <div className="chat-header">
              <div className="chat-avatar">AI</div>
              <div>
                <h4>AI Shop Assistant</h4>
                <span>Online</span>
              </div>
              <button className="chat-close" onClick={() => setIsChatOpen(false)}>×</button>
            </div>

            <div className="chat-body">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.sender}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="chat-footer">
              <span className="footer-lbl">Quick Actions:</span>
              <div className="chat-options">
                <button onClick={() => handleChatOption('how_match', 'How does matching work?')} className="btn-chat-opt">
                  How does matching work?
                </button>
                <button onClick={() => handleChatOption('how_apply', 'How do I apply?')} className="btn-chat-opt">
                  How do I apply?
                </button>
                <button onClick={() => handleChatOption('whatsapp', 'Chat on WhatsApp')} className="btn-chat-opt whatsapp">
                  💬 Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="chat-trigger-btn" onClick={() => setIsChatOpen(true)}>
            <span className="chat-icon">💬</span>
            <span className="chat-pulse"></span>
          </button>
        )}
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          height: 75px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-img {
          height: 42px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .logo-img-small {
          height: 26px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .brand-name {
          font-weight: 700;
          font-size: 18px;
          color: #101828;
        }

        .nav-links {
          display: flex;
          gap: 24px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: #1656d8;
        }

        .hero-section {
          max-width: 1200px;
          margin: 40px auto;
          padding: 64px 48px;
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 60px;
          align-items: center;
          background: linear-gradient(135deg, #071936 0%, #0e2e5e 100%) !important;
          border-radius: 24px;
          border: 1px solid #153970;
          box-shadow: 0 20px 50px rgba(7, 25, 54, 0.15);
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
          color: #ffffff !important;
          margin-bottom: 24px;
        }

        .highlight {
          color: #38bdf8 !important;
        }

        .hero-content p {
          font-size: 18px;
          color: #e2e8f0 !important;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
        }

        .cta-btn {
          padding: 16px 32px;
          font-size: 15px;
          border-radius: 999px;
        }

        .hero-graphic {
          display: flex;
          justify-content: center;
        }

        .image-wrapper {
          width: 100%;
          max-width: 420px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(16, 79, 223, 0.1);
          border: 1px solid #e2e8f0;
          background: #ffffff;
        }

        .hero-img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.3s ease;
        }

        .hero-img:hover {
          transform: scale(1.02);
        }

        /* Stats Section */
        .stats-section {
          background: linear-gradient(120deg, #071a3f 0%, #0e2f7a 45%, #1656d8 100%) !important;
          padding: 64px 0;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          text-align: center;
        }

        .stat-card h3 {
          font-size: 36px;
          color: #ffffff !important;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .stat-card p {
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 14px;
          font-weight: 600;
        }

        /* How it Works */
        .how-it-works {
          padding: 80px 0;
          text-align: center;
          background-color: #ffffff !important;
        }

        .how-it-works h2 {
          font-size: 28px;
          color: #101828 !important;
          margin-bottom: 8px;
        }

        .section-subtitle {
          color: #64748b !important;
          margin-bottom: 50px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .step-card {
          padding: 30px;
          background-color: #ffffff !important;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          transition: transform 0.2s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          border-color: #1656d8;
        }

        .step-num {
          background-color: #eaf2ff !important;
          color: #1656d8 !important;
          font-weight: 700;
          font-size: 18px;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 20px;
        }

        .step-card h4 {
          font-size: 18px;
          color: #101828 !important;
          margin-bottom: 12px;
        }

        .step-card p {
          color: #64748b !important;
          font-size: 14px;
          line-height: 1.6;
        }

        /* FAQ Section */
        .faq-section {
          padding: 80px 0;
          background-color: #eef4ff;
          border-top: 1px solid #e2e8f0;
        }

        .faq-section h2 {
          font-size: 28px;
          color: #101828;
          margin-bottom: 40px;
          text-align: center;
        }

        .faq-list {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .faq-item:hover {
          border-color: #1656d8;
        }

        .faq-item.active {
          border-color: #1656d8;
          background-color: #eef4ff;
        }

        .faq-question {
          width: 100%;
          padding: 20px 24px;
          background: none;
          border: none;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: #101828;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .faq-icon {
          font-size: 20px;
          color: #1656d8;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
          padding: 0 24px;
        }

        .faq-item.active .faq-answer {
          max-height: 200px;
          padding-bottom: 20px;
        }

        .faq-answer p {
          color: #64748b;
          line-height: 1.6;
          font-size: 14px;
        }

        /* Footer */
        .footer {
          background-color: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 30px 0;
          margin-top: auto;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #64748b;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: #101828;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-links a:hover {
          color: #1656d8;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
        }

        /* Chatbot Floating Widget */
        .chatbot-widget {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          font-family: inherit;
        }

        .chat-trigger-btn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #1656d8;
          border: none;
          color: #ffffff;
          font-size: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(16, 79, 223, 0.25);
          position: relative;
          transition: transform 0.2s;
        }

        .chat-trigger-btn:hover {
          transform: scale(1.05);
        }

        .chat-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #1656d8;
          opacity: 0.4;
          z-index: -1;
          animation: pulse 2s infinite;
        }

        .chat-card {
          width: 360px;
          height: 500px;
          background-color: #ffffff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        .chat-header {
          background-color: #1656d8;
          color: #ffffff;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-header h4 {
          font-size: 15px;
          margin: 0;
        }

        .chat-header span {
          font-size: 11px;
          opacity: 0.8;
        }

        .chat-close {
          position: absolute;
          top: 18px;
          right: 20px;
          background: none;
          border: none;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
        }

        .chat-body {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background-color: #eef4ff;
        }

        .chat-message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.5;
        }

        .chat-message.bot {
          background-color: #ffffff;
          color: #101828;
          align-self: flex-start;
          border-bottom-left-radius: 2px;
          border: 1px solid #e2e8f0;
        }

        .chat-message.user {
          background-color: #1656d8;
          color: #ffffff;
          align-self: flex-end;
          border-bottom-right-radius: 2px;
        }

        .chat-footer {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-lbl {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .chat-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .btn-chat-opt {
          width: 100%;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          background-color: #eef4ff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          color: #101828;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-chat-opt:hover {
          background-color: #eaf2ff;
          border-color: #1656d8;
          color: #1656d8;
        }

        .btn-chat-opt.whatsapp {
          background-color: #e6f9f0;
          border-color: #25d366;
          color: #128c7e;
        }

        .btn-chat-opt.whatsapp:hover {
          background-color: #d1f4e2;
        }

        /* Animations */
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 79, 223, 0.5); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(16, 79, 223, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 79, 223, 0); }
        }

        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Common Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none !important;
        }

        .btn-primary {
          background-color: #1656d8 !important;
          color: #ffffff !important;
          text-decoration: none !important;
        }

        .btn-primary:hover {
          background-color: #0e3fa3 !important;
        }

        .btn-secondary {
          background-color: #ffffff !important;
          color: #0a2f7c !important;
          border: 1.5px solid #ffffff !important;
          text-decoration: none !important;
        }

        .btn-secondary:hover {
          background-color: #eef4ff;
          border-color: #101828;
        }

        /* Mobile & Tablet Responsiveness */
        @media (max-width: 768px) {
          .navbar {
            padding: 15px 20px;
            height: auto;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .nav-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;
          }
          
          .nav-link {
            font-size: 13px;
          }
          
          .hero-section {
            grid-template-columns: 1fr;
            margin: 20px 15px;
            padding: 40px 24px;
            gap: 30px;
            text-align: center;
            border-radius: 16px;
          }
          
          .hero-content h1 {
            font-size: 32px;
            line-height: 1.2;
          }
          
          .hero-content p {
            font-size: 15px;
            margin-bottom: 24px;
            text-align: center;
          }
          
          .cta-buttons {
            flex-direction: column;
            width: 100%;
            gap: 12px;
          }
          
          .cta-btn {
            width: 100%;
            padding: 14px 20px;
            font-size: 14px;
            border-radius: 8px;
          }

          .image-wrapper {
            max-width: 320px;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 20px;
          }
          
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 20px;
          }
          
          .faq-list {
            padding: 0 20px;
          }
          
          .faq-question {
            padding: 16px;
            font-size: 14px;
          }

          .faq-answer p {
            font-size: 13px;
          }
          
          .footer-content {
            flex-direction: column;
            gap: 16px;
            text-align: center;
            padding: 0 20px;
          }
          
          .footer-links {
            flex-direction: column;
            gap: 8px;
          }
          
          .chatbot-widget {
            bottom: 20px;
            right: 20px;
          }
          
          .chat-card {
            width: calc(100vw - 40px);
            height: 420px;
          }
        }
      `}</style>
    </div>
  );
}
