import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthLayout from '../components/AuthLayout';

import { signup, saveSession, passwordStrength } from '../utils/auth';

export default function Signup() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState('company');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialNote, setSocialNote] = useState(false);

  const strength = passwordStrength(password);

  const validate = () => {
    const next = {};
    if (fullName.trim().length < 2) next.fullName = 'Enter your full name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.';
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords don\u2019t match.';
    if (!agreedToTerms) next.terms = 'You must accept the Terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await signup({ fullName, email, password, accountType });
      saveSession(data, true);
      router.push('/');
    } catch (err) {
      setFormError(err.message || 'Could not create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Enterprise AI hiring, <em>without the noise.</em></>}
      subhead="Create an account to post roles or apply as a vetted AI/ML specialist."
    >
      <Head>
        <title>Sign Up | AI Shop International</title>
      </Head>

      <div className="af-mobile-brand">
        <img src="/logo.png" alt="" />
        <span>AI Shop <em>International</em></span>
      </div>

      <span className="af-eyebrow">GET STARTED</span>
      <h1 className="af-title">Create your account</h1>
      <p className="af-subtitle">Already have an account? <a href="/login" className="af-link" style={{ display: 'inline' }}>Log in</a>.</p>



      <form onSubmit={handleSubmit} noValidate>
        <div className="af-role-toggle" role="radiogroup" aria-label="Account type">
          <button
            type="button"
            className={`af-role-option ${accountType === 'company' ? 'af-role-active' : ''}`}
            onClick={() => setAccountType('company')}
            role="radio"
            aria-checked={accountType === 'company'}
          >
            <strong>Company</strong>
            <span>I want to hire AI talent</span>
          </button>
          <button
            type="button"
            className={`af-role-option ${accountType === 'freelancer' ? 'af-role-active' : ''}`}
            onClick={() => setAccountType('freelancer')}
            role="radio"
            aria-checked={accountType === 'freelancer'}
          >
            <strong>Freelancer</strong>
            <span>I want to get matched</span>
          </button>
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="fullName">Full name</label>
          <input
            id="fullName"
            type="text"
            className={`af-input ${errors.fullName ? 'af-input-error' : ''}`}
            placeholder="Jane Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
          {errors.fullName && <p className="af-error-text">{errors.fullName}</p>}
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            className={`af-input ${errors.email ? 'af-input-error' : ''}`}
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className="af-error-text">{errors.email}</p>}
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="password">Password</label>
          <div className="af-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`af-input ${errors.password ? 'af-input-error' : ''}`}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              style={{ paddingRight: 60 }}
            />
            <button type="button" className="af-toggle-visibility" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {errors.password && <p className="af-error-text">{errors.password}</p>}
          {password.length > 0 && (
            <div className="af-strength">
              <div className="af-strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={strength.score >= i ? `af-active-${strength.score}` : ''} />
                ))}
              </div>
              <span className="af-strength-label">{strength.label}</span>
            </div>
          )}
        </div>

        <div className="af-field">
          <label className="af-label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            className={`af-input ${errors.confirmPassword ? 'af-input-error' : ''}`}
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="af-error-text">{errors.confirmPassword}</p>}
        </div>

        <div className="af-field">
          <label className="af-checkbox">
            <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
            I agree to the <a href="/terms" className="af-link" style={{ display: 'inline' }}>Terms of Service</a> and <a href="/privacy" className="af-link" style={{ display: 'inline' }}>Privacy Policy</a>
          </label>
          {errors.terms && <p className="af-error-text">{errors.terms}</p>}
        </div>

        {formError && (
          <p className="af-error-text" style={{ marginTop: '-8px', marginBottom: '16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary af-submit" disabled={loading}>
          {loading ? <span className="af-spinner" /> : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}
