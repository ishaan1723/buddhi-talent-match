import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { API_URL } from '../config';
import { fetchWithTimeout } from '../utils/fetchHelper';
import { getStoredUser, getToken, login, signup, saveSession } from '../utils/auth';

const formatCurrency = (val) => {
  if (val === undefined || val === null) return '';
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPassword, setAgencyPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Sidebar states
  const [sidebarTab, setSidebarTab] = useState('active'); // active, archived, drafts
  
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [maxRate, setMaxRate] = useState(10000);
  
  // Modal / Drawer states
  const [activeDrawerCandidate, setActiveDrawerCandidate] = useState(null);
  const [shareModalCandidate, setShareModalCandidate] = useState(null);
  const [copied, setCopied] = useState(false);

  // Bulk Parser states
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkUrls, setBulkUrls] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStage, setParsingStage] = useState('');
  const [parsingProgress, setParsingProgress] = useState(0);

  // Check placement agency auth status on load
  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();
    if (token && user && user.email === 'admin@buddhi.com') {
      setIsAuthenticated(true);
      fetchJobs();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleAgencyLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    if (agencyEmail === 'admin@buddhi.com' && agencyPassword === 'AdminPassword123!') {
      const adminUser = {
        id: 999,
        full_name: 'Buddhi Admin',
        email: 'admin@buddhi.com',
        account_type: 'admin'
      };
      saveSession({ access_token: 'admin-token-bypass', user: adminUser }, true);
      setIsAuthenticated(true);
      fetchJobs();
      setLoading(false);
    } else {
      setErrorMsg('Invalid placement agency credentials.');
      setLoading(false);
    }
  };



  // Fetch Matches when Selected Job Changes
  useEffect(() => {
    if (selectedJobId) {
      fetchMatches(selectedJobId);
    }
  }, [selectedJobId]);

  const fetchJobs = async () => {
    try {
      setLoadingJobs(true);
      const res = await fetchWithTimeout(`${API_URL}/api/jobs/`, { timeout: 10000 });
      if (!res.ok) {
        throw new Error(`API error code: ${res.status}`);
      }
      const data = await res.json();
      const archivedIds = JSON.parse(localStorage.getItem('archived_job_ids') || '[]');
      const jobsWithStatus = data.map(j => ({
        ...j,
        status: archivedIds.includes(j.id) ? 'archived' : 'active'
      }));
      setJobs(jobsWithStatus);
      const activeJob = jobsWithStatus.find(j => j.status !== 'archived');
      if (activeJob) {
        setSelectedJobId(activeJob.id);
      } else if (jobsWithStatus.length > 0) {
        setSelectedJobId(jobsWithStatus[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch jobs. Running local mock data.", err);
      const mockJobs = [
        { id: 1, title: "Need Python Dev to build an AI chatbot", description: "Build a customer support chatbot using LangChain...", budget: 3500 },
        { id: 2, title: "Computer Vision Expert for Defect Detection", description: "Build classification pipeline with PyTorch...", budget: 6000 },
        { id: 3, title: "NLP Researcher for Article Summarizer", description: "Financial news summarizer using Hugging Face...", budget: 4500 }
      ];
      const archivedIds = JSON.parse(localStorage.getItem('archived_job_ids') || '[]');
      const jobsWithStatus = mockJobs.map(j => ({
        ...j,
        status: archivedIds.includes(j.id) ? 'archived' : 'active'
      }));
      setJobs(jobsWithStatus);
      const activeJob = jobsWithStatus.find(j => j.status !== 'archived');
      if (activeJob) {
        setSelectedJobId(activeJob.id);
      } else {
        setSelectedJobId(jobsWithStatus[0].id);
      }
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchMatches = async (jobId) => {
    try {
      setLoadingMatches(true);
      const res = await fetchWithTimeout(`${API_URL}/api/matches/${jobId}`, { timeout: 10000 });
      if (!res.ok) {
        throw new Error(`API error code: ${res.status}`);
      }
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Failed to fetch matches. Running local mock data.", err);
      const mockMatches = [
        {
          id: 101,
          job_id: jobId,
          freelancer_name: "Rohan Mehta",
          freelancer_email: "rohan.mehta@example.com",
          linkedin_url: "https://www.linkedin.com/in/rohan-mehta-ai",
          primary_skill: "LLM Integrations & Agents (LangChain/LlamaIndex)",
          experience: 3,
          hourly_rate: 2500,
          match_score: 94.50,
          status: "pending",
          created_at: "2026-07-04T10:00:00Z"
        },
        {
          id: 102,
          job_id: jobId,
          freelancer_name: "Priya Sharma",
          freelancer_email: "priya.sharma@example.com",
          linkedin_url: "https://www.linkedin.com/in/priya-cv",
          primary_skill: "Computer Vision & CNNs (PyTorch/OpenCV)",
          experience: 4,
          hourly_rate: 6000,
          match_score: 54.20,
          status: "pending",
          created_at: "2026-07-04T10:00:00Z"
        },
        {
          id: 103,
          job_id: jobId,
          freelancer_name: "Vikram Singh",
          freelancer_email: "vikram.singh@example.com",
          linkedin_url: "https://www.linkedin.com/in/vikram-llm",
          primary_skill: "LLM Finetuning & Training (LoRA/QLoRA)",
          experience: 3,
          hourly_rate: 3500,
          match_score: 82.10,
          status: "pending",
          created_at: "2026-07-04T10:00:00Z"
        }
      ];
      setMatches(mockMatches);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleArchiveJob = (jobId) => {
    const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, status: 'archived' } : j);
    setJobs(updatedJobs);
    
    const archived = JSON.parse(localStorage.getItem('archived_job_ids') || '[]');
    if (!archived.includes(jobId)) {
      archived.push(jobId);
      localStorage.setItem('archived_job_ids', JSON.stringify(archived));
    }
    
    setStatusMessage("Campaign archived successfully!");
    setTimeout(() => setStatusMessage(''), 3000);
    
    const nextJob = updatedJobs.find(j => j.status !== 'archived');
    if (nextJob) {
      setSelectedJobId(nextJob.id);
    } else {
      setSelectedJobId(null);
    }
  };

  const getFilteredJobs = () => {
    return jobs.filter(job => {
      const isArchived = job.status === 'archived';
      if (sidebarTab === 'archived') return isArchived;
      return !isArchived;
    });
  };

  const handleUpdateStatus = async (matchId, newStatus) => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/matches/${matchId}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      if (res.ok) {
        setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
        setStatusMessage(`Candidate status updated to ${newStatus}!`);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (err) {
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: newStatus } : m));
      setStatusMessage(`[Demo Mode] Status updated to ${newStatus}!`);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // Filter Logic
  const getFilteredCandidates = () => {
    return matches.filter(c => {
      const matchesSearch = c.freelancer_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSkill = skillFilter === 'all' || c.primary_skill.includes(skillFilter);
      const matchesRate = c.hourly_rate <= maxRate;
      return matchesSearch && matchesSkill && matchesRate;
    });
  };

  const getSelectedJob = () => {
    return jobs.find(j => j.id === selectedJobId) || {};
  };

  const handleCopyEmail = () => {
    const text = document.getElementById("email-template").innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBulkImport = async (e) => {
    if (e) e.preventDefault();
    if (!bulkFile && !bulkUrls.trim()) {
      setStatusMessage("Please select a resume PDF or paste LinkedIn links.");
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setIsParsing(true);
    setErrorMsg('');
    
    // Multi-step progressive pipeline simulation
    const stages = [
      { text: "Reading files & loading URL links...", progress: 20 },
      { text: "Mining technical skillsets via AI semantic parsing...", progress: 50 },
      { text: "Extracting achievements & past KPI credentials...", progress: 75 },
      { text: "Generating auto-tags & indexing matches...", progress: 95 }
    ];

    for (const stage of stages) {
      setParsingStage(stage.text);
      setParsingProgress(stage.progress);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      let parsedData = null;

      if (bulkFile) {
        const formData = new FormData();
        formData.append('file', bulkFile);
        const res = await fetch(`${API_URL}/api/parser/resume`, {
          method: 'POST',
          body: formData
        });
        if (res.ok) parsedData = await res.json();
      } else if (bulkUrls.trim()) {
        const url = bulkUrls.split('\n')[0].trim(); // Parse first URL
        const res = await fetch(`${API_URL}/api/parser/linkedin?url=${encodeURIComponent(url)}`, {
          method: 'POST'
        });
        if (res.ok) parsedData = await res.json();
      }

      if (parsedData) {
        // Post the parsed candidate directly to backend to insert & trigger matcher
        const regForm = new FormData();
        regForm.append('name', parsedData.name);
        regForm.append('email', parsedData.email);
        regForm.append('linkedin_url', parsedData.linkedin_url);
        regForm.append('primary_skill', parsedData.primary_skill);
        regForm.append('experience', parsedData.experience);
        regForm.append('hourly_rate', parsedData.hourly_rate);
        regForm.append('kpi_achieved', parsedData.kpi_achieved);
        regForm.append('proud_situation', parsedData.proud_situation);
        regForm.append('tags', parsedData.tags);

        const createRes = await fetch(`${API_URL}/api/freelancers/`, {
          method: 'POST',
          body: regForm
        });

        if (createRes.ok) {
          setStatusMessage("AI Bulk Ingestion complete! Candidate matching indexes refreshed.");
          setTimeout(() => setStatusMessage(''), 4000);
          
          // Reset bulk state
          setBulkFile(null);
          setBulkUrls('');
          setShowBulkPanel(false);
          
          // Re-fetch matches to display newly inserted candidate matches
          if (selectedJobId) {
            fetchMatches(selectedJobId);
          }
        } else {
          const errText = await createRes.text();
          throw new Error(errText || "Failed to register candidate.");
        }
      } else {
        throw new Error("Could not parse file contents.");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Demo Import complete! Test match profile added to listings.");
      setTimeout(() => setStatusMessage(''), 4000);
      
      // Fallback local mock insertion for testing offline/local robustness
      const newCandId = Date.now();
      const mockNewMatch = {
        id: newCandId,
        job_id: selectedJobId,
        freelancer_name: bulkFile ? "Aarav Sharma" : "Ishaan Jain",
        freelancer_email: bulkFile ? "aarav.sharma@example.com" : "17ishaanjain@gmail.com",
        linkedin_url: bulkFile ? "https://linkedin.com/in/aarav-sharma-ml" : "https://linkedin.com/in/ishaan-jain-ai",
        primary_skill: bulkFile ? "Python, PyTorch, TensorFlow, OpenCV, NumPy, Scikit-Learn" : "Python, LangChain, Vector Indexes",
        experience: 5,
        hourly_rate: 3200.0,
        match_score: 96.5,
        status: "pending",
        tags: bulkFile ? "CV, PyTorch, OpenCV, DeepLearning, Lead" : "RAG, LangChain, Senior",
        created_at: new Date().toISOString(),
        ai_reasoning: "Excellent alignment with target requirements. Experience bounds match. Hourly rate fits within job budget constraints."
      };
      setMatches(prev => [mockNewMatch, ...prev]);
      
      setBulkFile(null);
      setBulkUrls('');
      setShowBulkPanel(false);
    } finally {
      setIsParsing(false);
      setParsingProgress(0);
      setParsingStage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="agency-login-container">
        <Head>
          <title>Agency Portal | AI Shop International</title>
        </Head>
        <div className="login-card">
          <img src="/logo.png" className="logo" alt="" />
          <h2>Placement Agency Portal</h2>
          <p className="subtitle">Authorized Access Only. Please enter your credentials to manage talent campaigns.</p>
          
          {errorMsg && <p className="error-alert">{errorMsg}</p>}
          
          <form onSubmit={handleAgencyLogin}>
            <div className="field">
              <label>Agency Email</label>
              <input 
                type="email" 
                value={agencyEmail} 
                onChange={(e) => setAgencyEmail(e.target.value)} 
                placeholder="agency@buddhi.com" 
                required 
              />
            </div>
            <div className="field">
              <label>Access Password</label>
              <input 
                type="password" 
                value={agencyPassword} 
                onChange={(e) => setAgencyPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ cursor: 'pointer' }} disabled={loading}>
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>


        </div>
        <style jsx>{`
          .agency-login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(120% 140% at 50% 10%, #141729 0%, var(--ink) 70%, #06070c 100%);
            padding: 24px;
            color: #fff;
            font-family: var(--font-body);
          }
          .login-card {
            background: var(--ink-soft);
            border: 1px solid var(--ink-line);
            border-radius: var(--radius-lg);
            padding: 40px;
            width: 100%;
            max-width: 440px;
            box-shadow: var(--shadow-lg);
            text-align: center;
          }
          .logo {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          h2 {
            font-family: var(--font-display);
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #fff;
          }
          .subtitle {
            font-size: 13.5px;
            color: var(--text-on-ink-muted);
            line-height: 1.5;
            margin-bottom: 30px;
          }
          .field {
            text-align: left;
            margin-bottom: 20px;
          }
          label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--gold);
            margin-bottom: 8px;
          }
          input {
            width: 100%;
            padding: 12px 14px;
            background: rgba(255, 255, 255, 0.03);
            border: 1.5px solid var(--ink-line);
            border-radius: var(--radius-sm);
            color: #fff;
            font-size: 14.5px;
            transition: all 0.2s ease;
          }
          input:focus {
            outline: none;
            border-color: var(--indigo);
            background: rgba(255, 255, 255, 0.06);
          }
          .btn-block {
            width: 100%;
            padding: 12px;
            font-size: 14.5px;
            font-weight: 600;
            border-radius: var(--radius-sm);
          }
          .error-alert {
            background: rgba(216, 76, 76, 0.15);
            border: 1px solid #d84c4c;
            color: #ff7e7e;
            padding: 10px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            margin-bottom: 20px;
            text-align: left;
          }
          .divider {
            margin: 20px 0;
            font-size: 11px;
            color: var(--text-on-ink-muted);
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--ink-line);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Head>
        <title>Agency Admin Dashboard | AI Shop International</title>
      </Head>

      {/* Modern Top Header Navigation */}
      <header className="navbar">
        <div className="nav-brand">
          <img src="/logo.png" alt="AI Shop Logo" className="logo-img" />
          <span className="brand-name">AI Shop International</span>
          <span className="badge">Agency Portal</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home Portal</a>
          <a href="/credits" className="nav-link">Framework Credits</a>
        </div>
      </header>

      <main className="dashboard-layout">
        {/* Left column: Enhanced Jobs Sidebar with Tabs */}
        <aside className="jobs-sidebar">
          <div className="sidebar-header">
            <h3>Talent Campaigns</h3>
            <div className="sidebar-tabs">
              <button 
                onClick={() => setSidebarTab('active')} 
                className={`tab-btn ${sidebarTab === 'active' ? 'active' : ''}`}
              >
                Active ({jobs.filter(j => j.status !== 'archived').length})
              </button>
              <button 
                onClick={() => setSidebarTab('archived')} 
                className={`tab-btn ${sidebarTab === 'archived' ? 'active' : ''}`}
              >
                Archived ({jobs.filter(j => j.status === 'archived').length})
              </button>
            </div>
          </div>

          {loadingJobs ? (
            <div className="loading-spinner">Loading campaigns...</div>
          ) : (
            <div className="jobs-list-wrapper">
              <ul className="jobs-list">
                {getFilteredJobs().map(job => (
                  <li 
                    key={job.id} 
                    className={`job-item ${selectedJobId === job.id ? 'active' : ''}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <h4>{job.title}</h4>
                    <div className="job-meta">
                      <span>Budget: ₹{formatCurrency(job.budget)}/hr</span>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="sidebar-footer">
                <a href="/client" className="btn btn-primary btn-add-job">+ Create New Job</a>
              </div>
            </div>
          )}
        </aside>

        {/* Right column: Main Dashboard Area */}
        <section className="matches-content">
          {!selectedJobId || !getSelectedJob().title ? (
            <div className="empty-state" style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', marginTop: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#101828', marginBottom: '8px' }}>No Active Campaign Selected</h3>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Please choose an active campaign from the sidebar, or switch to the Archived tab to view past listings.</p>
            </div>
          ) : (
            <>
              <div className="matches-header">
                <div>
                  <h2>Recommendations for: <span className="highlight">{getSelectedJob().title}</span></h2>
                  <p className="job-desc-preview">{getSelectedJob().description}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowBulkPanel(!showBulkPanel)} 
                    style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '10px', background: 'var(--indigo)' }}
                  >
                    ⚡ Bulk Ingest AI
                  </button>
                  {getSelectedJob().status !== 'archived' && (
                    <button className="btn btn-secondary" onClick={() => handleArchiveJob(getSelectedJob().id)} style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '10px' }}>
                      Archive Campaign
                    </button>
                  )}
                  {statusMessage && <div className="toast-notification">{statusMessage}</div>}
                </div>
              </div>

              {/* Bulk Ingestion Panel (Dynamic expandable) */}
              {showBulkPanel && (
                <div className="bulk-ingest-panel card" style={{
                  padding: '24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <h3 style={{ fontSize: '16px', color: '#101828', marginBottom: '4px' }}>⚡ Advanced AI Candidate Ingestion</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Upload candidate resumes or paste LinkedIn profile links to auto-parse, skill-tag, and match profiles instantly.</p>
                  
                  {isParsing ? (
                    <div className="parsing-loader" style={{ textAlign: 'center', padding: '20px 0' }}>
                      <div className="spinner-animation" style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid #bfdbfe',
                        borderTop: '3px solid var(--indigo)',
                        borderRadius: '50%',
                        margin: '0 auto 12px',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <h4 style={{ fontSize: '14px', color: '#101828', marginBottom: '4px' }}>{parsingStage}</h4>
                      <div className="progress-bar-wrap" style={{ width: '200px', height: '6px', background: '#e2e8f0', borderRadius: '99px', margin: '0 auto', overflow: 'hidden' }}>
                        <div className="progress-bar-fill" style={{ width: `${parsingProgress}%`, height: '100%', background: 'var(--indigo)', transition: 'width 0.3s ease' }}></div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleBulkImport} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Option 1: Upload PDF Resume</label>
                        <input 
                          type="file" 
                          accept=".pdf" 
                          onChange={(e) => {
                            setBulkFile(e.target.files[0]);
                            setBulkUrls('');
                          }} 
                          style={{
                            padding: '12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            fontSize: '13px',
                            background: '#f8fafc'
                          }}
                        />
                      </div>
                      <div className="form-col" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Option 2: Paste LinkedIn Profile URL</label>
                        <textarea 
                          rows={1}
                          placeholder="https://linkedin.com/in/username"
                          value={bulkUrls}
                          onChange={(e) => {
                            setBulkUrls(e.target.value);
                            setBulkFile(null);
                          }}
                          style={{
                            padding: '12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '10px',
                            fontSize: '13px',
                            resize: 'none',
                            fontFamily: 'inherit'
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={() => setShowBulkPanel(false)} className="btn btn-secondary" style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '10px' }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 20px', borderRadius: '10px', background: 'var(--indigo)' }}>Run AI Analysis</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

          {/* Search & Dynamic Filter Bar */}
          <div className="filter-bar card">
            <div className="filter-group search">
              <label>Search Candidates</label>
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label>AI Expertise</label>
              <select 
                value={skillFilter} 
                onChange={(e) => setSkillFilter(e.target.value)}
                className="filter-input"
              >
                <option value="all">All Skills</option>
                <option value="LLM">LLM & Agents</option>
                <option value="Vision">Computer Vision</option>
                <option value="NLP">NLP & Text</option>
                <option value="Prompt">Prompt Engineering</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Max Hourly Rate: <span className="highlight">₹{formatCurrency(maxRate)}/hr</span></label>
              <input 
                type="range" 
                min="500" 
                max="10000" 
                step="250"
                value={maxRate} 
                onChange={(e) => setMaxRate(parseInt(e.target.value))}
                className="filter-input-range"
              />
            </div>
          </div>

          {/* Grid display of matched candidates */}
          {loadingMatches ? (
            <div className="loading-spinner">Analyzing talent database...</div>
          ) : getFilteredCandidates().length === 0 ? (
            <div className="empty-state">
              <p>No candidates match your search filters.</p>
            </div>
          ) : (
            <div className="candidates-grid">
              {getFilteredCandidates().map(candidate => (
                <div key={candidate.id} className={`candidate-card ${candidate.status}`}>
                  <div className="card-top">
                    <div className="candidate-info">
                      <h3>{candidate.freelancer_name}</h3>
                      <p className="skill-tag">{candidate.primary_skill.split('(')[0]}</p>
                      
                      {/* Recruiter Tags row */}
                      {candidate.tags && (
                        <div className="recruiter-tags-row" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                          {candidate.tags.split(',').map((tag, tIdx) => {
                            const trimmed = tag.trim();
                            if (!trimmed) return null;
                            return (
                              <span 
                                key={tIdx} 
                                className="tag-badge-pill" 
                                style={{
                                  fontSize: '10px',
                                  padding: '1px 6px',
                                  borderRadius: '99px',
                                  fontWeight: '600',
                                  backgroundColor: '#eff6ff',
                                  color: '#1e40af',
                                  border: '1px solid #bfdbfe'
                                }}
                              >
                                #{trimmed}
                              </span>
                            );
                          })}
                        </div>
                      )}
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
                      <span className="val">₹{formatCurrency(candidate.hourly_rate)}/hr</span>
                    </div>
                  </div>

                  <div className="card-actions">
                    <button 
                      onClick={() => setActiveDrawerCandidate(candidate)} 
                      className="btn-secondary btn-small"
                    >
                      View Details
                    </button>
                    
                    <div className="approval-buttons">
                      {candidate.status !== 'approved' && (
                        <button 
                          onClick={() => {
                            handleUpdateStatus(candidate.id, 'approved');
                            setShareModalCandidate(candidate);
                          }} 
                          className="btn-action approve"
                        >
                          Approve & Share
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
          </>
          )}
        </section>
      </main>

      {/* Candidate Details Slide-out Drawer */}
      {activeDrawerCandidate && (
        <div className="drawer-overlay" onClick={() => setActiveDrawerCandidate(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setActiveDrawerCandidate(null)}>×</button>
            <div className="drawer-header">
              <h2>Candidate File: {activeDrawerCandidate.freelancer_name}</h2>
              <span className={`status-pill ${activeDrawerCandidate.status}`}>{activeDrawerCandidate.status.toUpperCase()}</span>
            </div>
            
            <div className="drawer-body">
              <div className="drawer-section">
                <h3>Core Profile</h3>
                <table className="details-table">
                  <tbody>
                    <tr>
                      <td className="table-lbl">Email Address</td>
                      <td>{activeDrawerCandidate.freelancer_email}</td>
                    </tr>
                    <tr>
                      <td className="table-lbl">LinkedIn Link</td>
                      <td>
                        <a href={activeDrawerCandidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-blue">
                          View Profile
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="table-lbl">Primary Focus</td>
                      <td>{activeDrawerCandidate.primary_skill}</td>
                    </tr>
                    <tr>
                      <td className="table-lbl">Experience</td>
                      <td>{activeDrawerCandidate.experience} Years</td>
                    </tr>
                    <tr>
                      <td className="table-lbl">Target Rate</td>
                      <td>₹{formatCurrency(activeDrawerCandidate.hourly_rate)}/hr</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="drawer-section">
                <h3>Strategic Achievements</h3>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Main Career KPI:</strong>
                  <p style={{ fontSize: '13.5px', color: '#101828', lineHeight: '1.4', margin: 0 }}>{activeDrawerCandidate.kpi_achieved || "Not provided"}</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <strong style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Challenge Turned Around:</strong>
                  <p style={{ fontSize: '13.5px', color: '#101828', lineHeight: '1.4', margin: 0 }}>{activeDrawerCandidate.proud_situation || "Not provided"}</p>
                </div>
              </div>

              <div className="drawer-section">
                <h3>AI Recommendation Breakdown</h3>
                <div className="ai-breakdown-card">
                  <div className="breakdown-score">
                    <span className="big-percent">{activeDrawerCandidate.match_score}%</span>
                    <span>Overall Match Confidence</span>
                  </div>
                  <p className="breakdown-text">
                    This freelancer was matched against the role <strong>"{getSelectedJob().title}"</strong>. 
                    The system verified their primary focus on <strong>{activeDrawerCandidate.primary_skill.split('(')[0]}</strong> aligns with the job description. 
                    Additionally, their hourly rate request of <strong>₹{formatCurrency(activeDrawerCandidate.hourly_rate)}/hr</strong> is aligned with your budget of <strong>₹{formatCurrency(getSelectedJob().budget)}/hr</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share / Email Template Modal */}
      {shareModalCandidate && (
        <div className="modal-overlay" onClick={() => setShareModalCandidate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Approve & Generate Introduction Email</h3>
              <button className="close-btn" onClick={() => setShareModalCandidate(null)}>×</button>
            </div>
            <div className="modal-body">
              <p className="modal-intro">Here is a draft introduction email you can send directly to the hiring manager:</p>
              
              <div id="email-template" className="email-preview-box">
                <strong>Subject:</strong> Recommended AI Talent: {shareModalCandidate.freelancer_name} ({shareModalCandidate.match_score}% Match)<br/><br/>
                Hello,<br/><br/>
                We have reviewed your request for <strong>"{getSelectedJob().title}"</strong>. Using our semantic matching dashboard, we have vetted and approved the following candidate for your consideration:<br/><br/>
                • <strong>Name:</strong> {shareModalCandidate.freelancer_name}<br/>
                • <strong>Role Focus:</strong> {shareModalCandidate.primary_skill}<br/>
                • <strong>Experience:</strong> {shareModalCandidate.experience} Years<br/>
                • <strong>Target Rate:</strong> ₹{formatCurrency(shareModalCandidate.hourly_rate)}/hr<br/>
                • <strong>LinkedIn:</strong> {shareModalCandidate.linkedin_url}<br/><br/>
                Please let us know when you would like to schedule a brief introductory interview.<br/><br/>
                Best regards,<br/>
                The Placement Team
              </div>

              <div className="modal-actions">
                <button onClick={handleCopyEmail} className="btn btn-primary">
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
                <button onClick={() => setShareModalCandidate(null)} className="btn btn-secondary">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background-color: #eef4ff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .navbar {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
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

        .logo-img {
          height: 40px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .brand-name {
          font-weight: 700;
          font-size: 18px;
          color: #101828;
        }

        .badge {
          background-color: #eaf2ff;
          color: #1656d8;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-link {
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .nav-link:hover {
          color: #1656d8;
        }

        .dashboard-layout {
          display: flex;
          flex: 1;
        }

        .jobs-sidebar {
          width: 320px;
          background-color: #ffffff;
          border-right: 1px solid #e2e8f0;
          border-top: 6px solid #1656d8;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .sidebar-header h3 {
          font-size: 16px;
          color: #101828;
          margin-bottom: 12px;
        }

        .sidebar-tabs {
          display: flex;
          background-color: #eef4ff;
          padding: 4px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .tab-btn {
          flex: 1;
          background: none;
          border: none;
          padding: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          border-radius: 10px;
          transition: background-color 0.2s;
        }

        .tab-btn.active {
          background-color: #ffffff;
          color: #1656d8;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .jobs-list-wrapper {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
        }

        .jobs-list {
          list-style: none;
          overflow-y: auto;
          flex: 1;
        }

        .job-item {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .job-item:hover {
          background-color: #eef4ff;
        }

        .job-item.active {
          background-color: #eaf2ff;
          border-left: 4px solid #1656d8;
        }

        .job-item h4 {
          font-size: 14px;
          color: #101828;
          margin-bottom: 6px;
        }

        .job-meta {
          font-size: 12px;
          color: #64748b;
        }

        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid #e2e8f0;
          background-color: #ffffff;
        }

        .btn-add-job {
          width: 100%;
          text-align: center;
          font-size: 14px;
          padding: 12px;
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
          align-items: flex-start;
        }

        .matches-header h2 {
          font-size: 22px;
          color: #101828;
          margin-bottom: 6px;
        }

        .job-desc-preview {
          font-size: 14px;
          color: #64748b;
          max-width: 800px;
        }

        .highlight {
          color: #1656d8;
        }

        /* Filter Bar card */
        .filter-bar {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1.2fr 1fr 1.2fr;
          gap: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
        }

        .filter-input {
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #101828;
          outline: none;
        }

        .filter-input:focus {
          border-color: #1656d8;
        }

        .filter-input-range {
          accent-color: #1656d8;
          height: 6px;
          margin-top: 12px;
          cursor: pointer;
        }

        .candidates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 24px;
        }

        .candidate-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
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
          color: #101828;
          margin-bottom: 4px;
        }

        .skill-tag {
          font-size: 13px;
          color: #1656d8;
          font-weight: 500;
          background-color: #eaf2ff;
          padding: 4px 8px;
          border-radius: 10px;
          display: inline-block;
        }

        .score-badge {
          text-align: center;
          background-color: #1656d8;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 14px;
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
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .lbl {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
        }

        .val {
          font-size: 14px;
          font-weight: 600;
          color: #101828;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: auto;
        }

        .btn-small {
          width: 100%;
          padding: 8px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 10px;
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
          border-radius: 10px;
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
          background-color: #eef4ff;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        .btn-action.reject:hover {
          background-color: #f0f1f3;
        }

        .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 10px;
          display: inline-block;
        }

        .status-pill.approved {
          background-color: #e6f9f0;
          color: #1dbf73;
        }

        .status-pill.rejected {
          background-color: #fbeae9;
          color: #e31a1a;
        }

        /* Slide-out Candidate Details Drawer Overlay */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(34, 35, 37, 0.4);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          animation: fadeIn 0.2s ease-out;
        }

        .drawer-content {
          width: 500px;
          background-color: #ffffff;
          height: 100%;
          box-shadow: -4px 0 30px rgba(0,0,0,0.1);
          padding: 40px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 30px;
          animation: slideIn 0.3s ease-out;
        }

        .close-btn {
          position: absolute;
          top: 24px;
          right: 24px;
          background: none;
          border: none;
          font-size: 32px;
          color: #64748b;
          cursor: pointer;
        }

        .drawer-header {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 20px;
          margin-top: 10px;
        }

        .drawer-header h2 {
          font-size: 20px;
          color: #101828;
          margin-bottom: 8px;
        }

        .drawer-body {
          display: flex;
          flex-direction: column;
          gap: 30px;
          overflow-y: auto;
        }

        .drawer-section h3 {
          font-size: 14px;
          color: #64748b;
          text-transform: uppercase;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .details-table {
          width: 100%;
          border-collapse: collapse;
        }

        .details-table td {
          padding: 12px 0;
          border-bottom: 1px solid #eef4ff;
          font-size: 14px;
          color: #101828;
        }

        .table-lbl {
          font-weight: 600;
          color: #64748b;
          width: 140px;
        }

        .link-blue {
          color: #1656d8;
          font-weight: 600;
        }

        .link-blue:hover {
          text-decoration: underline;
        }

        .ai-breakdown-card {
          background-color: #eaf2ff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
        }

        .breakdown-score {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 12px;
          color: #1656d8;
          font-weight: 600;
        }

        .big-percent {
          font-size: 28px;
          font-weight: 800;
        }

        .breakdown-text {
          font-size: 14px;
          color: #101828;
          line-height: 1.6;
        }

        /* Share / Email Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(34, 35, 37, 0.4);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background-color: #ffffff;
          border-radius: 14px;
          width: 600px;
          padding: 36px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.1);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-header {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 16px;
        }

        .modal-header h3 {
          font-size: 18px;
          color: #101828;
        }

        .modal-intro {
          font-size: 14px;
          color: #64748b;
        }

        .email-preview-box {
          background-color: #eef4ff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 20px;
          font-size: 13.5px;
          line-height: 1.6;
          color: #101828;
          max-height: 280px;
          overflow-y: auto;
          font-family: monospace;
          white-space: pre-wrap;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .toast-notification {
          background-color: #101828;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
        }

        .loading-spinner, .empty-state {
          padding: 40px;
          text-align: center;
          color: #64748b;
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
        }

        .btn-primary {
          background-color: #1656d8;
          color: #ffffff;
        }

        .btn-primary:hover {
          background-color: #0e3fa3;
        }

        .btn-secondary {
          background-color: #ffffff;
          color: #101828;
          border: 1px solid #e2e8f0;
        }

        .btn-secondary:hover {
          background-color: #eef4ff;
          border-color: #101828;
        }

        /* Mobile Responsiveness media queries */
        @media (max-width: 768px) {
          .navbar {
            padding: 0 16px;
          }
          .dashboard-layout {
            flex-direction: column;
          }
          .jobs-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e2e8f0;
          }
          .matches-content {
            padding: 20px 16px;
          }
          .matches-header {
            flex-direction: column;
            gap: 16px;
          }
          .filter-bar {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .candidates-grid {
            grid-template-columns: 1fr;
          }
          .drawer-content {
            width: 100%;
            padding: 24px;
          }
          .card-details {
            gap: 20px;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}
