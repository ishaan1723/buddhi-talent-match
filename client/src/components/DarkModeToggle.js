import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggle = () => {
    if (isDark) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button 
      onClick={toggle} 
      className="btn-dark-mode" 
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
    >
      {isDark ? '☀️' : '🌙'}
      <style jsx>{`
        .btn-dark-mode {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .btn-dark-mode:hover {
          background: var(--paper-line);
        }
      `}</style>
    </button>
  );
}
