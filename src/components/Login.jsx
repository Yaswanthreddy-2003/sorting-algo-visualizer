import React, { useState } from 'react';
import './Login.css';

const desertImg = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; // royalty-free desert at dusk

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agree: false,
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.agree) {
      setError('Please fill all fields and agree to the Terms & Conditions.');
      return;
    }
    onLogin(form.email);
  };

  return (
    <div className="split-auth-bg">
      {/* Left Panel - only background image now */}
      <div className="split-auth-left" style={{ backgroundImage: `url('${desertImg}')` }}>
        {/* Visual only, no logo, no button, no dots */}
      </div>
      {/* Right Panel */}
      <div className="split-auth-right">
        <form className="split-auth-form" onSubmit={handleSubmit}>
          <h2 className="split-auth-title">Create an account</h2>
          <div className="split-auth-link-row">
            Already have an account? <a href="#" className="split-auth-link">Log in</a>
          </div>
          {error && <div className="split-auth-error">{error}</div>}
          <div className="split-auth-row">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className="split-auth-input half"
              autoComplete="given-name"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className="split-auth-input half"
              autoComplete="family-name"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="split-auth-input"
            autoComplete="email"
          />
          <div className="split-auth-password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="split-auth-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/><circle fill="#fff" cx="12" cy="12" r="2.5"/></svg>
              ) : (
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 5c-7 0-10 7-10 7s3 7 10 7c2.21 0 4.21-.5 6-1.35l-1.45-1.45C15.36 17.13 13.74 17.5 12 17.5c-5.05 0-8.13-4.13-8.94-5.5C3.87 10.63 6.95 6.5 12 6.5c1.74 0 3.36.37 4.55 1.3l1.45-1.45C16.21 5.5 14.21 5 12 5zm10.19 16.19l-1.41 1.41-2.54-2.54C16.21 20.5 14.21 21 12 21c-7 0-10-7-10-7s3-7 10-7c2.21 0 4.21.5 6 1.35l2.54-2.54 1.41 1.41-2.54 2.54C20.13 10.63 23.21 14.76 24 16.13c-.81 1.37-3.89 5.5-8.94 5.5-1.74 0-3.36-.37-4.55-1.3l-2.54 2.54z"/></svg>
              )}
            </button>
          </div>
          <label className="split-auth-checkbox">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            I agree to the <a href="#" className="split-auth-terms-link">Terms & Conditions</a>
          </label>
          <button className="split-auth-btn" type="submit">Create account</button>
          <div className="split-auth-divider">
            <span>Or register with</span>
          </div>
          <div className="split-auth-social-row">
            <button className="split-auth-social google" type="button">
              <svg width="18" height="18" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.64 2.7 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.16 17.61 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.56-.14-3.06-.41-4.5H24v9h12.4c-.54 2.9-2.18 5.36-4.64 7.04l7.19 5.6C43.93 37.14 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.64A14.5 14.5 0 0 1 9.5 24c0-1.62.28-3.19.78-4.64l-7.98-6.2A23.93 23.93 0 0 0 0 24c0 3.77.9 7.34 2.5 10.5l8.17-5.86z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.59l-7.19-5.6c-2.01 1.35-4.6 2.14-7.96 2.14-6.39 0-11.87-3.66-13.33-8.86l-8.17 5.86C6.73 42.52 14.82 48 24 48z"/></g></svg>
              Google
            </button>
            <button className="split-auth-social apple" type="button">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.04 0-.08 0-.12-.01-.01-.04-.01-.09-.01-.13 0-1.13.92-2.06 2.06-2.06.04 0 .08 0 .12.01.01.04.01.09.01.12zm3.13 4.36c-1.13-.04-2.08.63-2.62.63-.54 0-1.38-.61-2.28-.59-.88.02-1.7.52-2.16 1.32-.92 1.6-.24 3.97.66 5.27.44.64.97 1.36 1.67 1.33.67-.03.93-.43 1.74-.43.8 0 1.04.43 1.75.42.72-.01 1.18-.65 1.62-1.29.51-.74.72-1.46.73-1.5-.02-.01-1.41-.54-1.43-2.13-.01-1.33 1.08-1.97 1.13-2zm-3.13-2.36c.01 0 .01 0 0 0zm-2.13 6.36c-.02-.01-.04-.01-.06-.01-.02 0-.04 0-.06.01-.01.01-.01.01-.01.02s0 .01.01.02c.02.01.04.01.06.01.02 0 .04 0 .06-.01.01-.01.01-.01.01-.02s0-.01-.01-.02zm-2.13 6.36c.01 0 .01 0 0 0zm-2.13-2.36c.01 0 .01 0 0 0z"/></svg>
              Apple
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
