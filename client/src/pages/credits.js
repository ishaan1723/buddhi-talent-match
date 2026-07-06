import Head from 'next/head';

export default function Credits() {
  const team = [
    {
      name: "Lead Strategist",
      role: "Lead Strategy & Product Owner",
      contribution: "Led product roadmap design, database schema conceptualization, and alignment with the placement agency client.",
      avatar: "LS"
    },
    {
      name: "Team Developer 1",
      role: "Lead Full-Stack Architect",
      contribution: "Built the FastAPI backend routes, connection pools, and integrated Next.js API query controllers.",
      avatar: "DEV"
    },
    {
      name: "Team Developer 2",
      role: "AI & Data Engineer",
      contribution: "Developed the semantic cosine matching algorithm and local TF-IDF text vectorization fallbacks.",
      avatar: "AI"
    },
    {
      name: "Team Developer 3",
      role: "UI/UX Frontend Engineer",
      contribution: "Designed and built the Fiverr-inspired Blue & White frontend interfaces, ensuring absolute mobile responsiveness.",
      avatar: "UI"
    }
  ];

  return (
    <div className="credits-container">
      <Head>
        <title>Project Credits & Framework Details | AI Shop International</title>
      </Head>

      {/* Header */}
      <header className="navbar">
        <a href="/" className="brand">
          <img src="/logo.png" alt="AI Shop Logo" className="logo-img" />
          <span className="brand-name">AI Shop International</span>
        </a>
        <div className="nav-actions">
          <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="credits-content">
        <section className="framework-section card">
          <span className="framework-badge">ARCHITECTURE</span>
          <h2>Powered by the AI Shop Framework</h2>
          <p>
            This application was engineered utilizing the **AI Shop Framework**—a specialized design and development blueprint created to help recruitment agencies leverage semantic AI screening at scale. By enforcing strict separation between high-performance APIs and responsive client pages, it ensures zero latency and unmatched scalability for SMEs in the placement industry.
          </p>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>The Project Delivery Team (4 Expert Members)</h2>
          <p className="subtitle">Meet the team that built and deployed this matching platform in 20 days.</p>

          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="card member-card">
                <div className="member-avatar">{member.avatar}</div>
                <h3>{member.name}</h3>
                <span className="role-tag">{member.role}</span>
                <p className="contribution">{member.contribution}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .credits-container {
          min-height: 100vh;
          background-color: #eef4ff;
          font-family: 'Inter', sans-serif;
          padding-bottom: 80px;
        }

        .navbar {
          height: 70px;
          background-color: var(--bg-white);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-img {
          height: 40px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .brand-name {
          font-weight: 700;
          font-size: 18px;
          color: var(--text-dark);
        }

        .credits-content {
          max-width: 1000px;
          margin: 60px auto 0;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        .framework-section {
          background: var(--bg-white);
          border: 1px solid var(--border-color);
          padding: 40px;
          border-radius: 14px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .framework-badge {
          background-color: #eaf2ff;
          color: #1656d8;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .framework-section h2 {
          font-size: 26px;
          color: var(--text-dark);
          margin-bottom: 16px;
        }

        .framework-section p {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 15px;
          max-width: 800px;
          margin: 0 auto;
        }

        .team-section {
          text-align: center;
        }

        .team-section h2 {
          font-size: 26px;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .subtitle {
          color: var(--text-muted);
          margin-bottom: 40px;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }

        .member-card {
          background: var(--bg-white);
          border: 1px solid var(--border-color);
          border-top: 4px solid #1656d8;
          padding: 30px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .member-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border-color: #1656d8;
        }

        .member-avatar {
          width: 60px;
          height: 60px;
          background-color: #eaf2ff;
          color: #1656d8;
          font-weight: 700;
          font-size: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .member-card h3 {
          font-size: 18px;
          color: var(--text-dark);
        }

        .role-tag {
          font-size: 12px;
          color: #1656d8;
          font-weight: 600;
          background-color: #eaf2ff;
          padding: 4px 8px;
          border-radius: 10px;
        }

        .contribution {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: 8px;
        }

        /* Utilities */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-secondary {
          background-color: var(--bg-white);
          color: var(--text-dark);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background-color: #eef4ff;
        }
      `}</style>
    </div>
  );
}
