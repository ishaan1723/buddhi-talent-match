import { useState, useEffect } from 'react';
import Head from 'next/head';
import { API_URL } from '../config';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Fetch Job Postings on Load
  useEffect(() => {
    fetchJobs();
  }, []);

  // 2. Fetch Matches when Selected Job Changes
  useEffect(() => {
    if (selectedJobId) {
      fetchMatches(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetch(`${API_URL}/api/jobs/`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
        if (data.length > 0) {
          setSelectedJobId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch jobs. Running local mock data.", err);
      // Mock fallback data for design previews
      const mockJobs = [
        { id: 1, title: "Need Python Dev to build an AI chatbot", description: "Build a customer support chatbot using LangChain...", budget: 50.00 },
        { id: 2, title: "Computer Vision Expert for Defect Detection", description: "Build classification pipeline with PyTorch...", budget: 70.00 }
      ];
      setJobs(mockJobs);
      setSelectedJobId(mockJobs[0].id);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchMatches = async (jobId) => {
    try {
      setLoadingMatches(true);
      const res = await fetch(`${API_URL}/api/matches/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (err) {
      console.error("Failed to fetch matches. Running local mock data.", err);
      // Mock fallback matches for preview
      const mockMatches = [
        {
          id: 101,
          job_id: jobId,
          freelancer_name: "Rohan Mehta",
          freelancer_email: "rohan@example.com",
          linkedin_url: "https://www.linkedin.com/in/rohan-mehta-ai",
          primary_skill: "LLM Integrations & LangChain",
          experience: 3,
          hourly_rate: 45.00,
          match_score: 94.50,
          status: "pending"
        },
        {
          id: 102,
          job_id: jobId,
          freelancer_name: "Vikram Singh",
          freelancer_email: "vikram@example.com",
          linkedin_url: "https://www.linkedin.com/in/vikram-llm",
          primary_skill: "LLM Finetuning & Python",
          experience: 3,
          hourly_rate: 55.00,
          match_score: 82.10,
          status: "pending"
        }
      ];
      setMatches(mockMatches);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/matches/${matchId}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      if (res.ok) {
        // Update local state status instantly
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
        setStatusMessage(`Candidate status updated to ${newStatus}!`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      // Offline fallback state update
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
      setStatusMessage(`[Demo Mode] Status updated to ${newStatus}!`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const getSelectedJobTitle = () => {
    const job = jobs.find(j => j.id === selectedJobId);
    return job ? job.title : '';
  };

  return (
    <div className="dashboard-container">
      <Head>
        <title>Agency Admin Dashboard | AI Talent Match</title>
      </Head>

      {/* Modern Top Header Navigation */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="brand-logo">B</span>
          <span className="brand-name">Buddhi Talent Ecosystem</span>
          <span className="badge">Agency Portal</span>
        </div>
        <div className="nav-links">
          <a href="/credits" className="nav-link">Framework Credits</a>
        </div>
      </header>

      <main className="dashboard-layout">
        {/* Left column: Active Jobs List */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <h3>Active Jobs ({jobs.length})</h3>
          </div>
          {loadingJobs ? (
            <div className="loading-spinner">Loading jobs...</div>
          ) : (
            <ul className="jobs-list">
              {jobs.map(job => (
                <li 
                  key={job.id} 
                  className={`job-item ${selectedJobId === job.id ? 'active' : ''}`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <h4>{job.title}</h4>
                  <div className="job-meta">
                    <span>Budget: ${job.budget}/hr</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Right column: Candidates List for selected Job */}
        <section className="matches-content">
          <div className="matches-header">
            <h2>Recommendations for: <span className="highlight">{getSelectedJobTitle()}</span></h2>
            {statusMessage && <div className="toast-notification">{statusMessage}</div>}
          </div>

          {loadingMatches ? (
            <div className="loading-spinner">Analyzing talent database...</div>
          ) : matches.length === 0 ? (
            <div className="empty-state">
              <p>No candidates found matching this job criteria yet.</p>
            </div>
          ) : (
            <div className="candidates-grid">
              {matches.map(candidate => (
                <div key={candidate.id} className={`candidate-card ${candidate.status}`}>
                  <div className="card-top">
                    <div className="candidate-info">
                      <h3>{candidate.freelancer_name}</h3>
                      <p className="skill-tag">{candidate.primary_skill}</p>
                    </div>
                    {/* Circle match score percentage */}
                    <div className="score-badge">
                      <span className="score-val">{candidate.match_score}%</span>
                      <span className="score-lbl">AI Match</span>
                    </div>
                  </div>

                  <div className="card-details">
                    <div className="detail-item">
                      <span className="lbl">Experience</span>
                      <span className="val">{candidate.experience} Years</span>
                    </div>
                    <div className="detail-item">
                      <span className="lbl">Rate Request</span>
                      <span className="val">${candidate.hourly_rate}/hr</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <a 
                      href={candidate.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-linkedin"
                    >
                      View LinkedIn Profile
                    </a>
                    
                    <div className="approval-buttons">
                      {candidate.status !== 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(candidate.id, 'approved')} 
                          className="btn-action approve"
                        >
                          Approve
                        </button>
                      )}
                      {candidate.status !== 'rejected' && (
                        <button 
                          onClick={() => handleUpdateStatus(candidate.id, 'rejected')} 
                          className="btn-action reject"
                        >
                          Reject
                        </button>
                      )}
                      {candidate.status !== 'pending' && (
                        <span className={`status-pill ${candidate.status}`}>
                          {candidate.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #f7f9fc;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #dadbdd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .nav-brand {
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

        .badge {
          background-color: #eef5ff;
          color: #104fdf;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .nav-link {
          font-weight: 600;
          color: #62646a;
          font-size: 14px;
        }

        .nav-link:hover {
          color: #104fdf;
        }

        .dashboard-layout {
          display: flex;
          flex: 1;
        }

        .jobs-sidebar {
          width: 320px;
          background-color: #ffffff;
          border-right: 1px solid #dadbdd;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #dadbdd;
        }

        .sidebar-header h3 {
          font-size: 16px;
          color: #222325;
        }

        .jobs-list {
          list-style: none;
          overflow-y: auto;
        }

        .job-item {
          padding: 20px 24px;
          border-bottom: 1px solid #dadbdd;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .job-item:hover {
          background-color: #f7f9fc;
        }

        .job-item.active {
          background-color: #eef5ff;
          border-left: 4px solid #104fdf;
        }

        .job-item h4 {
          font-size: 14px;
          color: #222325;
          margin-bottom: 6px;
        }

        .job-meta {
          font-size: 12px;
          color: #62646a;
        }

        .matches-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .matches-header {
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .matches-header h2 {
          font-size: 22px;
          color: #222325;
        }

        .highlight {
          color: #104fdf;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .candidate-card {
          background: #ffffff;
          border: 1px solid #dadbdd;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .candidate-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .candidate-card.approved {
          border-left: 5px solid #1dbf73;
        }

        .candidate-card.rejected {
          opacity: 0.6;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .candidate-info h3 {
          font-size: 18px;
          color: #222325;
          margin-bottom: 4px;
        }

        .skill-tag {
          font-size: 13px;
          color: #104fdf;
          font-weight: 500;
          background-color: #eef5ff;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
        }

        .score-badge {
          text-align: center;
          background-color: #104fdf;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          min-width: 70px;
        }

        .score-val {
          font-weight: 700;
          font-size: 16px;
          display: block;
        }

        .score-lbl {
          font-size: 9px;
          text-transform: uppercase;
          display: block;
          opacity: 0.8;
        }

        .card-details {
          display: flex;
          gap: 40px;
          border-top: 1px solid #dadbdd;
          border-bottom: 1px solid #dadbdd;
          padding: 12px 0;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lbl {
          font-size: 11px;
          color: #62646a;
          text-transform: uppercase;
        }

        .val {
          font-size: 14px;
          font-weight: 600;
          color: #222325;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .btn-linkedin {
          background-color: #ffffff;
          border: 1px solid #0077b5;
          color: #0077b5;
          text-align: center;
          padding: 10px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .btn-linkedin:hover {
          background-color: #f0f7fa;
        }

        .approval-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }

        .btn-action {
          flex: 1;
          border: none;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-action.approve {
          background-color: #1dbf73;
          color: #ffffff;
        }

        .btn-action.approve:hover {
          background-color: #1aa865;
        }

        .btn-action.reject {
          background-color: #f7f9fc;
          border: 1px solid #dadbdd;
          color: #62646a;
        }

        .btn-action.reject:hover {
          background-color: #f0f1f3;
        }

        .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .status-pill.approved {
          background-color: #e6f9f0;
          color: #1dbf73;
        }

        .status-pill.rejected {
          background-color: #fbeae9;
          color: #e31a1a;
        }

        .toast-notification {
          background-color: #222325;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 13px;
        }

        .loading-spinner, .empty-state {
          padding: 40px;
          text-align: center;
          color: #62646a;
        }
      `}</style>
    </div>
  );
}
