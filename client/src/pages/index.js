import Head from 'next/head';

export default function Home() {
  return (
    <div className="home-container">
      <Head>
        <title>Buddhi Talent Ecosystem | Connect with AI Freelancers</title>
      </Head>

      {/* Top Navbar */}
      <header className="navbar">
        <div className="brand">
          <span className="brand-logo">B</span>
          <span className="brand-name">Buddhi Talent Ecosystem</span>
        </div>
        <div className="nav-actions">
          <a href="/dashboard" className="btn btn-secondary">Recruiter Dashboard</a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
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

        {/* Hero Visual Block */}
        <div className="hero-graphic">
          <div className="mock-card fiverr-style">
            <div className="card-header">
              <span className="badge-ai">AI MATCH</span>
              <h3>Rohan Mehta</h3>
              <p>LLM & LangChain Developer</p>
            </div>
            <div className="card-body">
              <div className="metric">
                <span className="lbl">Match Accuracy</span>
                <span className="val highlight">96%</span>
              </div>
              <div className="metric">
                <span className="lbl">Hourly Rate</span>
                <span className="val">$45/hr</span>
              </div>
            </div>
            <div className="card-footer">
              <span className="approved-pill">✓ Approved by Agency</span>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          height: 70px;
          border-bottom: 1px solid #dadbdd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
          background: #ffffff;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo {
          background-color: #104fdf;
          color: #ffffff;
          font-weight: 700;
          font-size: 20px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .brand-name {
          font-weight: 700;
          font-size: 18px;
          color: #222325;
        }

        .hero-section {
          max-width: 1200px;
          margin: 80px auto;
          padding: 0 40px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          color: #222325;
          margin-bottom: 24px;
        }

        .highlight {
          color: #104fdf;
        }

        .hero-content p {
          font-size: 18px;
          color: #62646a;
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
        }

        .cta-btn {
          padding: 16px 32px;
          font-size: 16px;
          border-radius: 4px;
        }

        .hero-graphic {
          display: flex;
          justify-content: center;
        }

        .mock-card {
          width: 300px;
          background: #ffffff;
          border: 1px solid #dadbdd;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .badge-ai {
          background-color: #eef5ff;
          color: #104fdf;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
        }

        .mock-card h3 {
          font-size: 20px;
          color: #222325;
          margin-bottom: 4px;
        }

        .mock-card p {
          font-size: 13px;
          color: #62646a;
        }

        .card-body {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #dadbdd;
          border-bottom: 1px solid #dadbdd;
          padding: 12px 0;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric .lbl {
          font-size: 10px;
          color: #62646a;
          text-transform: uppercase;
        }

        .metric .val {
          font-size: 15px;
          font-weight: 700;
          color: #222325;
        }

        .approved-pill {
          font-size: 12px;
          font-weight: 600;
          color: #1dbf73;
          background-color: #e6f9f0;
          padding: 6px 12px;
          border-radius: 4px;
          display: inline-block;
          text-align: center;
          width: 100%;
        }

        /* Standard Utility Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background-color: #104fdf;
          color: #ffffff;
        }

        .btn-primary:hover {
          background-color: #0c3dae;
        }

        .btn-secondary {
          background-color: #ffffff;
          color: #222325;
          border: 1px solid #dadbdd;
        }

        .btn-secondary:hover {
          background-color: #f7f9fc;
          border-color: #222325;
        }
      `}</style>
    </div>
  );
}
