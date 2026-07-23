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
  
  // Dashboard States
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  
  // Search, Filters & Toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('match_score');
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const [actionStatuses, setActionStatuses] = useState({});
  
  // Loading & Error States
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [jobCounts, setJobCounts] = useState({});

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

  // Fetch Jobs and Candidate Counts
  const loadCompanyDashboard = async (userEmail) => {
    setLoadingJobs(true);
    setFetchError('');
    try {
      // 1. Fetch all jobs posted by this company
      const jobsRes = await fetchWithTimeout(`${API_URL}/api/jobs/company?email=${encodeURIComponent(userEmail)}`, { timeout: 3000 });
      if (!jobsRes.ok) throw new Error("Could not fetch company jobs.");
      
      const jobsData = await jobsRes.json();
      setJobs(jobsData);
      
      // 2. Fetch approved candidates count for each job to show counts in Level 1 list
      const counts = {};
      for (const job of jobsData) {
        const matchesRes = await fetchWithTimeout(`${API_URL}/api/matches/company/job/${job.id}/approved`, { timeout: 1500 });
        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          counts[job.id] = matchesData.length;
        } else {
          counts[job.id] = 0;
        }
      }
      setJobCounts(counts);
    } catch (err) {
      console.error("Running Company portal in fallback demo mode.", err);
      setFetchError("Displaying mock data (Demo Mode).");
      
      // Populate rich mock data for the demo
      const mockJobs = [
        {
          id: 101,
          title: "Senior RAG Engineer (LangChain / LlamaIndex)",
          description: "We are seeking an expert to construct a scalable retrieval-augmented generation pipeline. The candidate will work on document parsing, sentence window retrieval, and integrating metadata filters. The ideal developer has experience with vector databases.",
          budget: 3500.0,
          kpi_expectations: "Reduce query latency of internal document searches by 40% and build automated chunking parser.",
          duration: "3 Months",
          deadline: "July 30, 2026",
          status: "open",
          created_at: "2026-07-15T10:00:00Z"
        },
        {
          id: 102,
          title: "Computer Vision Expert for Image Segmentation",
          description: "We need an ML engineer to build a neural network pipeline for quality assurance defect classification. You will design, train, and deploy deep learning models to categorize defects in factory manufacturing lines.",
          budget: 6000.0,
          kpi_expectations: "Achieve defect detection classification accuracy >98% and run inference under 40ms.",
          duration: "6 Months",
          deadline: "Immediate",
          status: "open",
          created_at: "2026-07-12T09:30:00Z"
        },
        {
          id: 103,
          title: "NLP Researcher for Text Summarization",
          description: "Looking for a backend NLP specialist to build a microservice summarizing complex financial and news documents daily. Experience with Hugging Face transformers and deploying async FastAPI tasks is required.",
          budget: 4500.0,
          kpi_expectations: "Build text summarization microservice handling 100,000+ daily documents with average API latency <100ms.",
          duration: "2 Months",
          deadline: "Expired",
          status: "closed",
          created_at: "2026-06-30T14:00:00Z"
        }
      ];
      setJobs(mockJobs);
      setJobCounts({
        101: 2,
        102: 0,
        103: 1
      });
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadCompanyDashboard(currentUser.email);
    }
  }, [currentUser]);

  // Fetch approved candidates for a specific selected job (Level 2 drill down)
  const selectJob = async (job) => {
    setSelectedJob(job);
    setLoadingCandidates(true);
    setSearchQuery('');
    setExpandedReasoning({});
    
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/matches/company/job/${job.id}/approved`, { timeout: 3000 });
      if (!res.ok) throw new Error("Could not load approved matches.");
      const data = await res.json();
      setApprovedCandidates(data);
    } catch (err) {
      console.warn("Using mock approved candidates fallback for Job:", job.id);
      
      // Seed high-fidelity matching candidates for demo purposes
      if (job.id === 101 || job.id === 1) {
        setApprovedCandidates([
          {
            id: 501,
            freelancer_name: "Ishaan Jain",
            headline: "Senior AI Engineer & RAG Specialist",
            primary_skill: "Python, LangChain, LlamaIndex, Vector Database Indexing",
            experience: 4,
            hourly_rate: 2800.0,
            rating: 5.0,
            portfolio_url: "https://github.com/ishaan-ai-developer",
            freelancer_email: "ishaan.jain@example.com",
            linkedin_url: "https://linkedin.com/in/ishaan-jain-ai",
            match_score: 96.5,
            ai_reasoning: "Excellent semantic alignment on search latency and index clustering. Matches 5/5 required tools. Requested rate fits within budget constraints.",
            kpi_achieved: "Reduced vector search query latency by 45% and scaled RAG pipelines for 50k concurrent docs."
          },
          {
            id: 502,
            freelancer_name: "Aishwarya Roy",
            headline: "NLP Developer & LLM Engineer",
            primary_skill: "Hugging Face, BERT, Transformers, LLM fine-tuning",
            experience: 3,
            hourly_rate: 2500.0,
            rating: 4.8,
            portfolio_url: "https://github.com/aishwarya-nlp",
            freelancer_email: "aishwarya@example.com",
            linkedin_url: "https://linkedin.com/in/aishwarya-nlp",
            match_score: 84.2,
            ai_reasoning: "Decent keyword similarity for LangChain orchestrations. Strong accomplishments in model fine-tuning and token optimizations.",
            kpi_achieved: "Built summarization pipeline processing 120k articles daily under 80ms latency."
          }
        ]);
      } else if (job.id === 103 || job.id === 3) {
        setApprovedCandidates([
          {
            id: 503,
            freelancer_name: "Aishwarya Roy",
            headline: "NLP Developer & LLM Engineer",
            primary_skill: "Hugging Face, BERT, Transformers, LLM fine-tuning",
            experience: 3,
            hourly_rate: 2500.0,
            rating: 4.8,
            portfolio_url: "https://github.com/aishwarya-nlp",
            freelancer_email: "aishwarya@example.com",
            linkedin_url: "https://linkedin.com/in/aishwarya-nlp",
            match_score: 88.0,
            ai_reasoning: "Perfect fit for BERT fine-tuning expectations. 3 years relevant experience in text mining and summarization pipeline runs.",
            kpi_achieved: "Built summarization pipeline processing 120k articles daily under 80ms latency."
          }
        ]);
      } else {
        // Empty state for Job 102 (CV Expert)
        setApprovedCandidates([]);
      }
    } finally {
      setLoadingCandidates(false);
    }
  };

  // Toggle Job Status (Open/Closed)
  const toggleJobStatus = async (job) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      const res = await fetch(`${API_URL}/api/jobs/${job.id}/status?status=${newStatus}`, {
        method: 'PUT'
      });
      if (res.ok) {
        // Update local state
        const updatedJobs = jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j);
        setJobs(updatedJobs);
        if (selectedJob && selectedJob.id === job.id) {
          setSelectedJob({ ...selectedJob, status: newStatus });
        }
      }
    } catch (err) {
      // Local toggle for offline demo mode
      const updatedJobs = jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j);
      setJobs(updatedJobs);
      if (selectedJob && selectedJob.id === job.id) {
        setSelectedJob({ ...selectedJob, status: newStatus });
      }
    }
  };

  // Toggle reasoning expandable block
  const toggleReasoning = (candId) => {
    setExpandedReasoning(prev => ({
      ...prev,
      [candId]: !prev[candId]
    }));
  };

  // Trigger candidate action (Hire / Message)
  const triggerAction = (cand, action) => {
    const candId = cand.id;
    setActionStatuses(prev => ({
      ...prev,
      [`${candId}-${action}`]: true
    }));
    
    setTimeout(() => {
      setActionStatuses(prev => ({
        ...prev,
        [`${candId}-${action}`]: false,
        [`${candId}-${action}-done`]: true
      }));

      // Direct email integration via Mailto
      const subject = action === 'hire'
        ? `Job Offer: ${selectedJob.title} - AI Shop International`
        : `Inquiry regarding your AI profile - AI Shop International`;

      const body = action === 'hire'
        ? `Hi ${cand.freelancer_name},\n\nWe reviewed your pre-vetted AI profile on AI Shop International and were highly impressed by your achievements (specifically: "${cand.kpi_achieved}").\n\nWe have approved you for our project: "${selectedJob.title}" (Hourly Budget: ₹${selectedJob.budget}/hr) and would love to schedule a direct introductory call.\n\nPlease let us know your availability.\n\nBest regards,\n${currentUser.full_name}`
        : `Hi ${cand.freelancer_name},\n\nWe are currently looking for specialists for our "${selectedJob.title}" project and would like to ask a few questions regarding your experience in: ${cand.primary_skill}.\n\nLet us know if you have time for a quick message thread.\n\nBest regards,\n${currentUser.full_name}`;

      window.location.href = `mailto:${cand.freelancer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 1200);
  };

  // Filter and sort candidates
  const filteredCandidates = approvedCandidates
    .filter(cand => {
      const query = searchQuery.toLowerCase();
      return (
        cand.freelancer_name.toLowerCase().includes(query) ||
        cand.primary_skill.toLowerCase().includes(query) ||
        cand.headline.toLowerCase().includes(query) ||
        (cand.tags && cand.tags.toLowerCase().includes(query)) ||
        (cand.ai_reasoning && cand.ai_reasoning.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'match_score') return b.match_score - a.match_score;
      if (sortBy === 'experience') return b.experience - a.experience;
      if (sortBy === 'hourly_rate') return a.hourly_rate - b.hourly_rate;
      return 0;
    });

  if (!currentUser) return null;

  return (
    <div className="company-portal">
      <Head>
        <title>Recruiter Dashboard | AI Shop International</title>
        <meta name="description" content="Manage requirements and hire pre-vetted AI specialists." />
      </Head>

      {/* ---------------- Nav ---------------- */}
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner container">
          <button onClick={() => setSelectedJob(null)} className="brand-btn" aria-label="Home">
            <img src="/logo.png" className="logo-img" alt="AI Shop Logo" />
            <span className="brand-word">AI Shop <em>International</em></span>
          </button>

          <div className="nav-actions">
            {selectedJob && (
              <button onClick={() => setSelectedJob(null)} className="nav-ghost btn-back-nav">
                ← Back to Jobs
              </button>
            )}
            <span className="nav-user-indicator" style={{ fontSize: '12.5px', fontWeight: '700', letterSpacing: '0.04em', color: 'var(--indigo)', textTransform: 'uppercase' }}>
              HI {currentUser.full_name.split(' ')[0]} (Company User)
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

      {/* ---------------- Dashboard Shell ---------------- */}
      <main className="dashboard-content container">
        
        {/* LEVEL 1: Job Postings List */}
        {!selectedJob ? (
          <div className="job-list-view">
            <div className="dashboard-header-row">
              <div>
                <span className="eyebrow">COMPANY WORKSPACE</span>
                <h2>Active Job Requirements</h2>
                <p>Post tech roles and view candidate shortlist matches pre-screened and approved by our placement team.</p>
              </div>
              <a href="/client" className="btn btn-primary btn-post-new">
                + Post a New Requirement
              </a>
            </div>

            {fetchError && <p className="demo-badge-banner">{fetchError}</p>}

            {loadingJobs ? (
              <div className="loader-container">
                <div className="spinner"></div>
                <p>Sourcing your postings from the database...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="empty-workspace-card card text-center">
                <span className="empty-icon">📁</span>
                <h3>No posted requirements found</h3>
                <p>Get started by listing your first project description. Our AI matching pipeline will instantly parse and score candidates.</p>
                <a href="/client" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Post First Job</a>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map((job) => {
                  const count = jobCounts[job.id] || 0;
                  return (
                    <div key={job.id} className="job-card card">
                      <div className="job-card-header">
                        <span className={`status-pill ${job.status}`}>
                          {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
                        </span>
                        <span className="date-stamp">
                          {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3>{job.title}</h3>
                      <p className="job-desc-preview">
                        {job.description.length > 130 ? `${job.description.substring(0, 130)}...` : job.description}
                      </p>
                      
                      <div className="job-meta-row">
                        <span className="budget-tag">Budget: ₹{job.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</span>
                        {job.duration && <span className="duration-tag">⏱️ {job.duration}</span>}
                      </div>

                      <div className="job-card-footer">
                        <div className="match-counter-badge">
                          <strong>{count}</strong> Approved Candidate{count !== 1 ? 's' : ''}
                        </div>
                        <button onClick={() => selectJob(job)} className="btn btn-secondary btn-view-matches">
                          View approved candidates →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          
          /* LEVEL 2: Job Detail & Approved Candidates View */
          <div className="job-detail-view">
            
            {/* Back Button / Navigation */}
            <div className="back-bar">
              <button onClick={() => setSelectedJob(null)} className="btn-back">
                ← Back to Job Postings
              </button>
            </div>

            {/* Split Grid Layout */}
            <div className="detail-grid">
              
              {/* Left Column: Job Description and original parameters */}
              <div className="job-specs-col card">
                <div className="specs-header">
                  <div className="status-toggle-row">
                    <span className={`status-pill ${selectedJob.status}`}>
                      {selectedJob.status === 'open' ? '🟢 Open Posting' : '🔴 Closed Posting'}
                    </span>
                    <button onClick={() => toggleJobStatus(selectedJob)} className="btn-status-toggle">
                      {selectedJob.status === 'open' ? 'Close Posting' : 'Open Posting'}
                    </button>
                  </div>
                  <h2>{selectedJob.title}</h2>
                  <span className="date-stamp">Posted: {new Date(selectedJob.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>

                <div className="spec-info-row">
                  <div className="spec-tile">
                    <span>MAX HOURLY BUDGET</span>
                    <strong>₹{selectedJob.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</strong>
                  </div>
                  {selectedJob.duration && (
                    <div className="spec-tile">
                      <span>PROJECT DURATION</span>
                      <strong>{selectedJob.duration}</strong>
                    </div>
                  )}
                  {selectedJob.deadline && (
                    <div className="spec-tile">
                      <span>DEADLINE</span>
                      <strong>{selectedJob.deadline}</strong>
                    </div>
                  )}
                </div>

                <div className="spec-section">
                  <h4>Role Description</h4>
                  <p>{selectedJob.description}</p>
                </div>

                {selectedJob.kpi_expectations && (
                  <div className="spec-section target-kpis-box">
                    <h4>Target Performance KPIs Expected</h4>
                    <p>{selectedJob.kpi_expectations}</p>
                  </div>
                )}

                <div className="specs-notes">
                  <p><strong>Note:</strong> Vetting parameters and AI screening configurations are managed by our agency recruiters. Only final approved matches are displayed here.</p>
                </div>
              </div>

              {/* Right Column: Approved Candidates List */}
              <div className="candidates-list-col">
                <div className="list-header-card card">
                  <div className="search-filter-row">
                    <h3>AI-Approved Candidates ({filteredCandidates.length})</h3>
                    
                    {/* Sort Dropdown */}
                    <div className="sort-box">
                      <label htmlFor="sortSelect">Sort:</label>
                      <select 
                        id="sortSelect" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                      >
                        <option value="match_score">Highest Match</option>
                        <option value="experience">Experience</option>
                        <option value="hourly_rate">Lowest Rate</option>
                      </select>
                    </div>
                  </div>

                  {/* Search input */}
                  <input 
                    type="text" 
                    placeholder="Search candidates by name, primary skill, or match reasoning..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="candidate-search-input"
                  />
                </div>

                {loadingCandidates ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                    <p>Fetching approved candidates...</p>
                  </div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="empty-candidates-card card text-center">
                    <span className="empty-icon">⏳</span>
                    <h3>No Approved Candidates</h3>
                    <p>
                      {searchQuery 
                        ? "No matched profiles found fitting your search query parameters."
                        : "Our agency recruiters are still evaluating applicants for this job. You will see approved profiles populating here soon."
                      }
                    </p>
                  </div>
                ) : (
                  <div className="candidates-stack">
                    {filteredCandidates.map((cand) => {
                      const isExpanded = !!expandedReasoning[cand.id];
                      return (
                        <div key={cand.id} className="candidate-card card">
                          
                          {/* Top Row: Name, headline, rating, match percentage */}
                          <div className="cand-card-top">
                            <div className="cand-profile-row">
                              <div className="avatar-circle">
                                {cand.freelancer_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h4>{cand.freelancer_name}</h4>
                                <span className="cand-headline">{cand.headline || "AI / Machine Learning Specialist"}</span>
                                
                                {/* Dynamic Tags Row */}
                                {cand.tags && (
                                  <div className="cand-tags-row" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                    {cand.tags.split(',').map((tag, tIdx) => {
                                      const trimmed = tag.trim();
                                      if (!trimmed) return null;
                                      return (
                                        <span 
                                          key={tIdx} 
                                          className="cand-tag-pill" 
                                          style={{
                                            fontSize: '11px',
                                            padding: '2px 8px',
                                            borderRadius: '99px',
                                            fontWeight: '600',
                                            background: trimmed.toLowerCase().includes('senior') || trimmed.toLowerCase().includes('lead') 
                                              ? 'rgba(201, 162, 39, 0.1)' 
                                              : trimmed.toLowerCase().includes('rag') || trimmed.toLowerCase().includes('cv') || trimmed.toLowerCase().includes('nlp')
                                                ? 'rgba(91, 79, 232, 0.1)'
                                                : 'rgba(74, 85, 104, 0.08)',
                                            color: trimmed.toLowerCase().includes('senior') || trimmed.toLowerCase().includes('lead')
                                              ? '#b58e12'
                                              : trimmed.toLowerCase().includes('rag') || trimmed.toLowerCase().includes('cv') || trimmed.toLowerCase().includes('nlp')
                                                ? 'var(--indigo)'
                                                : '#4a5568',
                                            border: trimmed.toLowerCase().includes('senior') || trimmed.toLowerCase().includes('lead')
                                              ? '1px solid rgba(201, 162, 39, 0.2)'
                                              : trimmed.toLowerCase().includes('rag') || trimmed.toLowerCase().includes('cv') || trimmed.toLowerCase().includes('nlp')
                                                ? '1px solid rgba(91, 79, 232, 0.2)'
                                                : '1px solid rgba(74, 85, 104, 0.15)'
                                          }}
                                        >
                                          #{trimmed}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="cand-score-box">
                              <span className="score-percentage">{Math.round(cand.match_score)}%</span>
                              <span className="score-lbl">AI Match</span>
                            </div>
                          </div>

                          {/* Mid Info: Experience, Rate, Rating */}
                          <div className="cand-meta-strip">
                            <span>💼 <strong>{cand.experience} yrs</strong> experience</span>
                            <span>💵 <strong>₹{cand.hourly_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</strong> rate</span>
                            <span>⭐ <strong>{cand.rating.toFixed(1)}/5.0</strong> rating</span>
                          </div>

                          {/* Direct Contacts Info */}
                          <div className="cand-contact-row" style={{ display: 'flex', gap: '20px', fontSize: '13px', margin: '-4px 0 14px', color: 'var(--text-muted)' }}>
                            <span>📧 <a href={`mailto:${cand.freelancer_email}`} style={{ color: 'var(--indigo)', fontWeight: '600' }}>{cand.freelancer_email}</a></span>
                            <span>🔗 <a href={cand.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--indigo)', fontWeight: '600' }}>LinkedIn Profile</a></span>
                          </div>

                          {/* Expertise / Skills list */}
                          <div className="skills-block">
                            <strong>Skills:</strong>
                            <div className="skills-tags">
                              {cand.primary_skill.split(',').map((skill, sIdx) => (
                                <span key={sIdx} className="skill-badge">{skill.trim()}</span>
                              ))}
                            </div>
                          </div>

                          {/* KPI Achievements */}
                          {cand.kpi_achieved && (
                            <div className="cand-kpi-brief">
                              <strong>KPI Achieved:</strong> <span>{cand.kpi_achieved}</span>
                            </div>
                          )}

                          {/* AI Match reasoning (Expandable) */}
                          <div className="ai-reasoning-container">
                            <button onClick={() => toggleReasoning(cand.id)} className="btn-reasoning-toggle">
                              {isExpanded ? 'Hide AI Match Reasoning ▲' : 'Show AI Match Reasoning ▼'}
                            </button>
                            {isExpanded && (
                              <div className="ai-reasoning-details">
                                <p><strong>Approval Match Context:</strong> {cand.ai_reasoning || "Matches job descriptions keywords and experience bounds. Screened and certified by agency recruiter."}</p>
                                <span className="recruiter-tag">Vetted by: Agency Admin</span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="cand-actions-row">
                            {cand.portfolio_url && (
                              <a href={cand.portfolio_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary cand-action-btn">
                                🔗 View Portfolio
                              </a>
                            )}
                            
                            <button 
                              onClick={() => triggerAction(cand, 'message')}
                              disabled={actionStatuses[`${cand.id}-message-done`]}
                              className={`btn btn-secondary cand-action-btn ${actionStatuses[`${cand.id}-message-done`] ? 'done' : ''}`}
                            >
                              {actionStatuses[`${cand.id}-message`] ? 'Sending...' : actionStatuses[`${cand.id}-message-done`] ? 'Email Client Opened ✓' : '💬 Message'}
                            </button>

                            <button 
                              onClick={() => triggerAction(cand, 'hire')}
                              disabled={actionStatuses[`${cand.id}-hire-done`]}
                              className={`btn btn-primary cand-action-btn ${actionStatuses[`${cand.id}-hire-done`] ? 'done' : ''}`}
                            >
                              {actionStatuses[`${cand.id}-hire`] ? 'Connecting...' : actionStatuses[`${cand.id}-hire-done`] ? 'Email Offer Sent ✓' : '🚀 Hire Candidate'}
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div>
              <span className="footer-brand-name">AI Shop International</span>
              <p>The pre-vetted matching network connecting businesses with global AI talent.</p>
            </div>
            <div className="footer-links">
              <div className="footer-col">
                <h4>Dashboard</h4>
                <a href="#company-workspace" onClick={() => setSelectedJob(null)}>Requirements Workspace</a>
                <a href="/client">Post a Job</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="/credits">Credits</a>
                <a href="/login">Logout session</a>
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
          padding-top: 100px;
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
        .brand-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 0;
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
        .btn-back-nav {
          background: none;
          border: none;
          cursor: pointer;
        }

        /* ---------- Shell Layout ---------- */
        .dashboard-content {
          padding-bottom: 80px;
        }
        .dashboard-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 40px;
          border-bottom: 1px solid var(--paper-line);
          padding-bottom: 24px;
        }
        .eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--indigo);
          letter-spacing: 0.12em;
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
        }
        .dashboard-header-row h2 {
          font-size: 28px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 8px;
        }
        .dashboard-header-row p {
          color: var(--text-muted);
          font-size: 14.5px;
        }
        .demo-badge-banner {
          background: #fff8e6;
          border: 1px solid #ffeeba;
          color: #856404;
          font-size: 13.5px;
          padding: 10px 20px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          font-weight: 550;
        }

        /* ---------- Level 1: Jobs Grid ---------- */
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 28px;
        }
        .job-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 28px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .job-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .job-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .status-pill {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }
        .status-pill.open {
          background: #e6f9f0;
          color: #1dbf73;
        }
        .status-pill.closed {
          background: #f1f5f9;
          color: #64748b;
        }
        .date-stamp {
          font-size: 12px;
          color: var(--text-muted);
        }
        .job-card h3 {
          font-size: 18px;
          font-weight: 650;
          color: var(--text);
          margin-bottom: 12px;
        }
        .job-desc-preview {
          font-size: 13.5px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-bottom: 20px;
          min-height: 60px;
        }
        .job-meta-row {
          display: flex;
          gap: 16px;
          font-size: 12.5px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          margin-bottom: 24px;
        }
        .budget-tag {
          color: var(--text);
          font-weight: 600;
        }
        .job-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--paper-line);
          padding-top: 16px;
        }
        .match-counter-badge {
          font-size: 13px;
          color: var(--text);
        }
        .match-counter-badge strong {
          color: var(--indigo);
          font-size: 15px;
        }

        /* ---------- Level 2: Job Detail view ---------- */
        .back-bar {
          margin-bottom: 30px;
        }
        .btn-back {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          font-weight: 600;
          font-size: 14.5px;
          transition: color 0.2s;
        }
        .btn-back:hover {
          color: var(--text);
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.4fr;
          gap: 40px;
          align-items: start;
        }

        /* Left specs panel */
        .job-specs-col {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 36px;
          box-shadow: var(--shadow-sm);
        }
        .specs-header {
          border-bottom: 1px solid var(--paper-line);
          padding-bottom: 24px;
          margin-bottom: 24px;
        }
        .status-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .btn-status-toggle {
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-status-toggle:hover {
          background: var(--paper-line);
        }
        .job-specs-col h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
        }
        .spec-info-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 30px;
        }
        .spec-tile {
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-sm);
          padding: 14px 10px;
          text-align: center;
        }
        .spec-tile span {
          display: block;
          font-size: 9px;
          font-family: var(--font-mono);
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 6px;
        }
        .spec-tile strong {
          font-size: 13.5px;
          color: var(--text);
        }
        .spec-section {
          margin-bottom: 24px;
        }
        .spec-section h4 {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text);
          margin-bottom: 10px;
        }
        .spec-section p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
        }
        .target-kpis-box {
          background: #f8fafc;
          border-left: 3px solid var(--indigo);
          padding: 16px;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .specs-notes {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
          margin-top: 36px;
          border-top: 1px solid var(--paper-line);
          padding-top: 16px;
        }

        /* Right matches panel */
        .list-header-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: var(--shadow-sm);
        }
        .search-filter-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .search-filter-row h3 {
          font-size: 17px;
          font-weight: 650;
          color: var(--text);
        }
        .sort-box {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: var(--text-muted);
        }
        .sort-select {
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          color: var(--text);
          cursor: pointer;
        }
        .candidate-search-input {
          width: 100%;
          border: 1px solid var(--paper-line);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 13.5px;
          background: var(--paper-dim);
          color: var(--text);
        }
        .candidates-stack {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .candidate-card {
          background: #ffffff;
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-lg);
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }
        .cand-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .cand-profile-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--indigo-soft);
          color: var(--indigo);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          letter-spacing: 0.05em;
        }
        .cand-profile-row h4 {
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 2px;
        }
        .cand-headline {
          font-size: 13px;
          color: var(--text-muted);
          display: block;
        }
        .cand-score-box {
          text-align: center;
          background: rgba(91, 79, 232, 0.08);
          border: 1px solid rgba(91, 79, 232, 0.25);
          padding: 6px 12px;
          border-radius: 8px;
        }
        .score-percentage {
          font-size: 18px;
          font-weight: 700;
          color: var(--indigo);
          display: block;
          line-height: 1.1;
        }
        .score-lbl {
          font-size: 9px;
          color: var(--indigo);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .cand-meta-strip {
          display: flex;
          gap: 24px;
          font-size: 13.5px;
          color: var(--text-muted);
          border-bottom: 1px solid var(--paper-line);
          padding-bottom: 14px;
          margin-bottom: 14px;
        }
        .skills-block {
          margin-bottom: 14px;
          font-size: 13.5px;
        }
        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }
        .skill-badge {
          font-size: 11.5px;
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          padding: 2px 10px;
          border-radius: var(--radius-sm);
          color: var(--text);
        }
        .cand-kpi-brief {
          font-size: 12.5px;
          background: #f8fafc;
          border-left: 3px solid var(--indigo);
          padding: 8px 12px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          margin-bottom: 20px;
        }
        .cand-kpi-brief strong {
          color: var(--text);
        }
        .cand-kpi-brief span {
          color: var(--text-muted);
        }
        
        /* Expandable Reasoning block */
        .ai-reasoning-container {
          background: var(--paper-dim);
          border: 1px solid var(--paper-line);
          border-radius: var(--radius-sm);
          margin-bottom: 20px;
          overflow: hidden;
        }
        .btn-reasoning-toggle {
          width: 100%;
          background: none;
          border: none;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 600;
          color: var(--indigo);
          cursor: pointer;
          text-align: left;
        }
        .ai-reasoning-details {
          padding: 0 16px 14px;
          font-size: 12.5px;
          line-height: 1.5;
          color: var(--text-muted);
        }
        .recruiter-tag {
          display: inline-block;
          font-size: 10px;
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 8px;
          font-family: var(--font-mono);
        }

        /* Action Buttons */
        .cand-actions-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .cand-action-btn {
          width: 100%;
          justify-content: center;
          padding: 10px 0;
          font-size: 13px;
        }
        :global(.btn-secondary.done), :global(.btn-primary.done) {
          background: #1dbf73 !important;
          border-color: #1dbf73 !important;
          color: #ffffff !important;
          cursor: not-allowed;
        }

        /* Miscellaneous */
        .loader-container {
          text-align: center;
          padding: 60px 0;
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
        .empty-workspace-card, .empty-candidates-card {
          padding: 60px 24px;
        }
        .empty-icon {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .empty-workspace-card h3, .empty-candidates-card h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .empty-workspace-card p, .empty-candidates-card p {
          color: var(--text-muted);
          font-size: 14.5px;
        }

        /* ---------- Footer ---------- */
        .footer {
          background-color: var(--ink) !important;
          border-top: 1px solid var(--ink-line) !important;
          color: var(--text-on-ink-muted) !important;
          padding: 72px 0 36px;
          font-size: 14px;
          margin-top: 80px;
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
          .detail-grid { grid-template-columns: 1fr; }
          .nav-actions { gap: 10px; }
          .nav-ghost { font-size: 12px; }
          .nav-cta { padding: 8px 14px; font-size: 12px; }
        }
        @media (max-width: 640px) {
          .spec-info-row { grid-template-columns: 1fr; }
          .cand-actions-row { grid-template-columns: 1fr; }
          .search-filter-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .sort-box { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </div>
  );
}
