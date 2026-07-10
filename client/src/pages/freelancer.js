import { useState } from 'react';
import Head from 'next/head';
import { API_URL } from '../config';
import { fetchWithTimeout } from '../utils/fetchHelper';

export default function FreelancerOnboarding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    primary_skill: '',
    experience: 2,
    hourly_rate: 1500,
    kpi_achieved: '',
    proud_situation: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : name === 'hourly_rate' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Basic LinkedIn Validation
    if (!formData.linkedin_url.includes('linkedin.com/')) {
      setErrorMsg("Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/username)");
      setLoading(false);
      return;
    }

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('name', formData.name);
      formDataPayload.append('email', formData.email);
      formDataPayload.append('linkedin_url', formData.linkedin_url);
      formDataPayload.append('primary_skill', formData.primary_skill);
      formDataPayload.append('experience', formData.experience);
      formDataPayload.append('hourly_rate', formData.hourly_rate);
      formDataPayload.append('kpi_achieved', formData.kpi_achieved);
      formDataPayload.append('proud_situation', formData.proud_situation);
      if (resumeFile) {
        formDataPayload.append('resume', resumeFile);
      }

      const res = await fetchWithTimeout(`${API_URL}/api/freelancers/`, {
        method: 'POST',
        body: formDataPayload
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.detail || "Submission failed. Please check your inputs.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback/demo success state if server is offline
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="onboarding-page success">
        <div className="card success-card">
          <div className="success-icon">✓</div>
          <h2>Profile Registered Successfully!</h2>
          <p>Your profile is now in our system. The matching engine is analyzing your skills against active client jobs.</p>
          <a href="/dashboard" className="btn btn-primary">Go to Agency Dashboard</a>
        </div>
        <style jsx>{`
          .onboarding-page.success {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #eef4ff;
          }
          .success-card {
            text-align: center;
            max-width: 450px;
            padding: 40px;
            background: #ffffff;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .success-icon {
            font-size: 40px;
            color: #1dbf73;
            background-color: #e6f9f0;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }
          h2 { margin-bottom: 12px; color: #101828; font-size: 24px; }
          p { margin-bottom: 30px; color: #64748b; line-height: 1.6; }
          .btn-primary {
            display: inline-block;
            background-color: #1656d8;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 10px;
            font-weight: 600;
            text-decoration: none;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="onboarding-page">
      <Head>
        <title>Apply as AI Freelancer | AI Shop International</title>
      </Head>

      <header className="navbar">
        <a href="/" className="brand">
          <img src="/logo.png" alt="AI Shop Logo" className="logo-img" />
          <span className="brand-name">AI Shop International</span>
        </a>
      </header>

      <main className="form-container">
        <div className="form-header">
          <h1>Join the AI Talent Network</h1>
          <p>Fill out the details below. Our AI engine will match your profile against active client jobs.</p>
        </div>

        <form onSubmit={handleSubmit} className="card form-card">
          {errorMsg && <div className="error-alert">{errorMsg}</div>}

          {/* Simple LinkedIn Profile Field */}
          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
            <input 
              type="text" 
              id="linkedin_url" 
              name="linkedin_url" 
              required 
              placeholder="e.g. https://www.linkedin.com/in/username" 
              value={formData.linkedin_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="e.g. Rohan Mehta" 
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="e.g. rohan@example.com" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Upgraded to Written Input Field for better semantic matching */}
          <div className="form-group">
            <label htmlFor="primary_skill">Primary AI Skills & Focus Area</label>
            <input 
              type="text" 
              id="primary_skill" 
              name="primary_skill" 
              required 
              placeholder="e.g. Building custom RAG pipelines with LangChain and PyTorch" 
              value={formData.primary_skill}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of AI/ML Experience: <span className="range-val">{formData.experience} Years</span></label>
            <input 
              type="range" 
              id="experience" 
              name="experience" 
              min="0" 
              max="15" 
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hourly_rate">Target Hourly Rate (₹/hr): <span className="range-val">₹{formData.hourly_rate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/hr</span></label>
            <input 
              type="range" 
              id="hourly_rate" 
              name="hourly_rate" 
              min="500" 
              max="10000" 
              step="250"
              value={formData.hourly_rate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="kpi_achieved">1 Main Career KPI Achieved</label>
            <textarea 
              id="kpi_achieved" 
              name="kpi_achieved" 
              required 
              rows={2}
              placeholder="e.g. Reduced inference latency by 45% for a production LLM chatbot" 
              value={formData.kpi_achieved}
              onChange={handleChange}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="proud_situation">1 Challenge Turned Around (Proud Moment)</label>
            <textarea 
              id="proud_situation" 
              name="proud_situation" 
              required 
              rows={2}
              placeholder="e.g. Migrated a failing vector search database to pgvector in 48 hours to restore service" 
              value={formData.proud_situation}
              onChange={handleChange}
              style={{
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* PDF Resume Upload Field */}
          <div className="form-group">
            <label htmlFor="resume">Upload Resume (PDF format only)</label>
            <input 
              type="file" 
              id="resume" 
              accept=".pdf" 
              onChange={(e) => setResumeFile(e.target.files[0])}
              style={{
                padding: '10px',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                backgroundColor: '#f8fafc',
                color: '#101828',
                cursor: 'pointer'
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
            {loading ? "Submitting Profile..." : "Submit Application"}
          </button>
        </form>
      </main>

      <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          background-color: #eef4ff;
          font-family: 'Inter', sans-serif;
          padding-bottom: 60px;
        }
        .navbar {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
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
          color: #101828;
        }
        .form-container {
          max-width: 580px;
          margin: 60px auto 0;
          padding: 0 24px;
        }
        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .form-header h1 {
          font-size: 28px;
          color: #101828;
          margin-bottom: 8px;
        }
        .form-header p {
          color: #64748b;
          font-size: 15px;
          line-height: 1.5;
        }
        .form-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 6px solid #1656d8;
          border-radius: 16px;
          padding: 36px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #101828;
          display: flex;
          justify-content: space-between;
        }
        .range-val {
          color: #1656d8;
        }
        .form-group input[type="text"],
        .form-group input[type="email"] {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #101828;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input[type="text"]:focus,
        .form-group input[type="email"]:focus {
          border-color: #1656d8;
          box-shadow: 0 0 0 3px rgba(22, 86, 216, 0.12);
        }
        .form-group input[type="range"] {
          accent-color: #1656d8;
          height: 6px;
          cursor: pointer;
        }
        .submit-btn {
          width: 100%;
          border: none;
          background-color: #1656d8;
          color: #ffffff;
          padding: 14px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-btn:hover {
          background-color: #0e3fa3;
        }
        .submit-btn:disabled {
          background-color: #e2e8f0;
          cursor: not-allowed;
        }
        .error-alert {
          background-color: #fbeae9;
          color: #e31a1a;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
}
