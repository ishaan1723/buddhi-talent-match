import { useState } from 'react';
import Head from 'next/head';
import { API_URL } from '../config';

export default function FreelancerOnboarding() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    linkedin_url: '',
    primary_skill: '',
    experience: 2,
    hourly_rate: 1500
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) : name === 'hourly_rate' ? parseFloat(value) : value
    }));
  };

  // Mock LinkedIn Sync Feature
  const handleLinkedInSync = () => {
    if (!formData.linkedin_url || !formData.linkedin_url.includes('linkedin.com/')) {
      setErrorMsg("Please enter your LinkedIn profile link first before syncing.");
      return;
    }

    setErrorMsg('');
    setSyncing(true);

    // Simulate API fetch from a LinkedIn Scraper (e.g. Proxycurl)
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setFormData({
        name: "Jainish Shah",
        email: "jainish.shah@example.com",
        linkedin_url: formData.linkedin_url,
        primary_skill: "LLM Integrations & Agents (LangChain/LlamaIndex)",
        experience: 4,
        hourly_rate: 3500
      });
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1500);
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
      const res = await fetch(`${API_URL}/api/freelancers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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
            background-color: #f7f9fc;
          }
          .success-card {
            text-align: center;
            max-width: 450px;
            padding: 40px;
            background: #ffffff;
            border-radius: 8px;
            border: 1px solid #dadbdd;
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
          h2 { margin-bottom: 12px; color: #222325; font-size: 24px; }
          p { margin-bottom: 30px; color: #62646a; line-height: 1.6; }
          .btn-primary {
            display: inline-block;
            background-color: #104fdf;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 4px;
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
        <title>Apply as AI Freelancer | AI Talent Match</title>
      </Head>

      <header className="navbar">
        <a href="/" className="brand">
          <span className="brand-logo">B</span>
          <span className="brand-name">Buddhi Talent Ecosystem</span>
        </a>
      </header>

      <main className="form-container">
        <div className="form-header">
          <h1>Join the AI Talent Network</h1>
          <p>Fill out this quick form or sync your LinkedIn profile to apply instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="card form-card">
          {errorMsg && <div className="error-alert">{errorMsg}</div>}
          {syncSuccess && <div className="success-alert">LinkedIn Profile Synced Successfully!</div>}

          {/* LinkedIn Profile Field with Sync Button */}
          <div className="form-group">
            <label htmlFor="linkedin_url">LinkedIn Profile URL</label>
            <div className="input-group-sync">
              <input 
                type="text" 
                id="linkedin_url" 
                name="linkedin_url" 
                required 
                placeholder="e.g. https://www.linkedin.com/in/username" 
                value={formData.linkedin_url}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={handleLinkedInSync} 
                disabled={syncing}
                className="btn-sync"
              >
                {syncing ? "Syncing..." : "Sync Profile"}
              </button>
            </div>
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

          <div className="form-group">
            <label htmlFor="primary_skill">Primary AI Focus Area</label>
            <select 
              id="primary_skill" 
              name="primary_skill" 
              required 
              value={formData.primary_skill}
              onChange={handleChange}
            >
              <option value="">Select your main expertise</option>
              <option value="LLM Integrations & Agents (LangChain/LlamaIndex)">LLM Integrations & Agents (LangChain/LlamaIndex)</option>
              <option value="LLM Finetuning & Training (LoRA/QLoRA)">LLM Finetuning & Training (LoRA/QLoRA)</option>
              <option value="Computer Vision & CNNs (PyTorch/OpenCV)">Computer Vision & CNNs (PyTorch/OpenCV)</option>
              <option value="Natural Language Processing (Transformers/BERT)">Natural Language Processing (Transformers/BERT)</option>
              <option value="Prompt Engineering & RAG">Prompt Engineering & RAG</option>
            </select>
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
            <label htmlFor="hourly_rate">Target Hourly Rate (₹/hr): <span className="range-val">₹{formData.hourly_rate.toLocaleString('en-IN')}/hr</span></label>
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

          <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
            {loading ? "Submitting Profile..." : "Submit Application"}
          </button>
        </form>
      </main>

      <style jsx>{`
        .onboarding-page {
          min-height: 100vh;
          background-color: #f7f9fc;
          font-family: 'Inter', sans-serif;
          padding-bottom: 60px;
        }
        .navbar {
          height: 70px;
          background-color: #ffffff;
          border-bottom: 1px solid #dadbdd;
          display: flex;
          align-items: center;
          padding: 0 40px;
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
          color: #222325;
          margin-bottom: 8px;
        }
        .form-header p {
          color: #62646a;
          font-size: 15px;
          line-height: 1.5;
        }
        .form-card {
          background: #ffffff;
          border: 1px solid #dadbdd;
          border-radius: 8px;
          padding: 36px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
          color: #222325;
          display: flex;
          justify-content: space-between;
        }
        .range-val {
          color: #104fdf;
        }
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group select {
          padding: 12px;
          border: 1px solid #dadbdd;
          border-radius: 4px;
          font-size: 14px;
          color: #222325;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input[type="text"]:focus,
        .form-group input[type="email"]:focus,
        .form-group select:focus {
          border-color: #104fdf;
        }
        .input-group-sync {
          display: flex;
          gap: 8px;
        }
        .input-group-sync input {
          flex: 1;
        }
        .btn-sync {
          background-color: #ffffff;
          color: #104fdf;
          border: 1px solid #104fdf;
          border-radius: 4px;
          padding: 0 16px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-sync:hover {
          background-color: #eef5ff;
        }
        .btn-sync:disabled {
          color: #62646a;
          border-color: #dadbdd;
          background-color: #f7f9fc;
          cursor: not-allowed;
        }
        .form-group input[type="range"] {
          accent-color: #104fdf;
          height: 6px;
          cursor: pointer;
        }
        .submit-btn {
          width: 100%;
          border: none;
          background-color: #104fdf;
          color: #ffffff;
          padding: 14px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-btn:hover {
          background-color: #0c3dae;
        }
        .submit-btn:disabled {
          background-color: #dadbdd;
          cursor: not-allowed;
        }
        .error-alert {
          background-color: #fbeae9;
          color: #e31a1a;
          padding: 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
        }
        .success-alert {
          background-color: #e6f9f0;
          color: #1dbf73;
          padding: 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 24px;
          border: 1px solid #1dbf73;
        }
      `}</style>
    </div>
  );
}
