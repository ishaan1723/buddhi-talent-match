import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthLayout from '../components/AuthLayout';
import SocialAuthRow from '../components/SocialAuthRow';
import { login, saveSession } from '../utils/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialNote, setSocialNote] = useState(false);

  const validate = () => {
    const next = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await login({ email, password, rememberMe });
      saveSession(data, rememberMe);
      router.push('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>Where AI teams find their <em>next hire.</em></>}
      subhead="Sign in to review matches, manage postings, and connect with vetted AI talent."
    >
      <Head>
        <title>Log In | AI Shop International</title>
      </Head>

      <div className="af-mobile-brand">
        <img src="/logo.png" alt="" />
        <span>AI Shop <em>International</em></span>
      </div>

      <span className="af-eyebrow">WELCOME BACK</span>
      <h1 className="af-title">Log in to your account</h1>
      <p className="af-subtitle">New to AI Shop International? <a href="/signup" className="af-link" style={{ display: 'inline' }}>Create an account</a>.</p>

      <SocialAuthRow onStubClick={() => setSocialNote(true)} />
      {socialNote && (
        <p className="af-error-text" style={{ color: 'var(--text-muted)', marginTop: '-12px', marginBottom: '18px' }}>
          Social login is coming soon — use email &amp; password for now.
        </p>
      )}

      <div className="af-divider">OR CONTINUE WITH EMAIL</div>

      <form onSubmit={handleSubmit} noValidate>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ paddingRight: 60 }}
            />
            <button type="button" className="af-toggle-visibility" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          {errors.password && <p className="af-error-text">{errors.password}</p>}
        </div>

        <div className="af-row-between">
          <label className="af-checkbox">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            Remember me
          </label>
          <a href="/forgot-password" className="af-link">Forgot password?</a>
        </div>

        {formError && (
          <p className="af-error-text" style={{ marginTop: '-8px', marginBottom: '16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-primary af-submit" disabled={loading}>
          {loading ? <span className="af-spinner" /> : 'Log in'}
        </button>
      </form>

      <p className="af-footer-text">
        Are you an AI freelancer? <a href="/freelancer" className="af-link">Apply here</a> instead.
      </p>
    </AuthLayout>
  );
}
