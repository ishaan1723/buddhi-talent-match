/**
 * Google / LinkedIn buttons are intentionally stubbed: no OAuth app
 * credentials are configured for this project yet. They're visible so the
 * design reads as complete, but disabled with a "Coming soon" flag rather
 * than silently failing. Wire these up to real OAuth apps later and swap
 * the onClick handlers for actual redirects.
 */
export default function SocialAuthRow({ onStubClick }) {
  return (
    <div className="af-social-row">
      <button type="button" className="af-social-btn" onClick={onStubClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3c-1.08.72-2.46 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.97H1.24v3.11A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.25 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.24a12 12 0 0 0 0 10.75l4.01-3.11z" />
          <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.24 6.63l4.01 3.1C6.2 6.87 8.86 4.75 12 4.75z" />
        </svg>
        Google
        <span className="af-soon">SOON</span>
      </button>
      <button type="button" className="af-social-btn" onClick={onStubClick}>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#0A66C2" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
        </svg>
        LinkedIn
        <span className="af-soon">SOON</span>
      </button>
    </div>
  );
}
