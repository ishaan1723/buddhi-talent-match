import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthLayout from '../components/AuthLayout';
import { resetPassword, passwordStrength } from '../utils/auth';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(password);

  const validate = () => {
    const next = {};
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords don\u2019t match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!token) {
      setFormError('This reset link is missing its token. Request a new one.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setFormError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline={<>One new password. <em>Back in seconds.</em></>}
      subhead="Choose something strong you haven't used elsewhere."
    >
      <Head>
        <title>Reset Password | AI Shop International</title>
      </Head>

      <div className="af-mobile-brand">
        <img src="/logo.png" alt="" />
        <span>AI Shop <em>International</em></span>
      </div>

      {success ? (
        <div className="af-success-panel">
          <div className="af-success-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M4 13l5 5L20 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2>Password updated</h2>
          <p>Your password has been changed successfully. You can now log in with your new password.</p>
          <a href="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Go to login</a>
        </div>
      ) : (
        <>
          <span className="af-eyebrow">SET A NEW PASSWORD</span>
          <h1 className="af-title">Reset your password</h1>
          <p className="af-subtitle">This link can only be used once and expires after 30 minutes.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="af-field">
              <label className="af-label" htmlFor="password">New password</label>
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
              <label className="af-label" htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className={`af-input ${errors.confirmPassword ? 'af-input-error' : ''}`}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="af-error-text">{errors.confirmPassword}</p>}
            </div>

            {formError && (
              <p className="af-error-text" style={{ marginTop: '-8px', marginBottom: '16px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" /><path d="M12 7v6M12 16.5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {formError}
              </p>
            )}

            <button type="submit" className="btn btn-primary af-submit" disabled={loading}>
              {loading ? <span className="af-spinner" /> : 'Reset password'}
            </button>
          </form>

          <p className="af-footer-text">
            <a href="/login" className="af-link">Back to login</a>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
