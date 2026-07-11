import { useState } from 'react';
import Head from 'next/head';
import AuthLayout from '../components/AuthLayout';
import { forgotPassword } from '../utils/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      if (res.dev_link) {
        setDevLink(res.dev_link);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Locked out happens. <em>Let&apos;s fix that.</em></>}
      subhead="We'll send a secure, time-limited link to reset your password."
    >
      <Head>
        <title>Forgot Password | AI Shop International</title>
      </Head>

      <div className="af-mobile-brand">
        <img src="/logo.png" alt="" />
        <span>AI Shop <em>International</em></span>
      </div>

      {submitted ? (
        <div className="af-success-panel">
          <div className="af-success-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 13l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Check your inbox</h2>
          <p>
            If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your password.
            It&apos;ll expire in 30 minutes.
          </p>
          
          {devLink && (
            <div style={{
              background: 'rgba(201, 162, 39, 0.1)',
              border: '1.5px dashed var(--gold)',
              borderRadius: '12px',
              padding: '16px',
              margin: '20px 0',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--gold)', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>DEV MODE: RESET PASSWORD LINK</span>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.5' }}>
                Since no live email server is configured in development, you can click the button below to test the reset flow:
              </p>
              <a href={devLink} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--gold)', borderColor: 'var(--gold)', boxShadow: 'none' }}>
                ⚡ Reset Password Now
              </a>
            </div>
          )}

          <a href="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Back to login</a>
        </div>
      ) : (
        <>
          <span className="af-eyebrow">RESET PASSWORD</span>
          <h1 className="af-title">Forgot your password?</h1>
          <p className="af-subtitle">Enter the email tied to your account and we&apos;ll send a reset link.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="af-field">
              <label className="af-label" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                className={`af-input ${error ? 'af-input-error' : ''}`}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {error && <p className="af-error-text">{error}</p>}
            </div>

            <button type="submit" className="btn btn-primary af-submit" disabled={loading}>
              {loading ? <span className="af-spinner" /> : 'Send reset link'}
            </button>
          </form>

          <p className="af-footer-text">
            Remembered it after all? <a href="/login" className="af-link">Back to login</a>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
