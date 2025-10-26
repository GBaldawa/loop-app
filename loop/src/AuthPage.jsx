import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const AuthPage = ({ isLogin = false }) => {
  const [isSignup, setIsSignup] = useState(!isLogin);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`${isSignup ? 'Signed up' : 'Logged in'} successfully!`);
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          <ArrowLeft size={24} color="#4B5563" />
        </button>
        <h1 style={styles.title}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {isSignup && (
          <div style={styles.inputContainer}>
            <User size={20} color="#9CA3AF" style={styles.inputIcon} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        )}

        <div style={styles.inputContainer}>
          <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputContainer}>
          <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{ ...styles.input, paddingRight: '2.5rem' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            {showPassword ? (
              <EyeOff size={20} color="#9CA3AF" />
            ) : (
              <Eye size={20} color="#9CA3AF" />
            )}
          </button>
        </div>

        {!isSignup && (
          <div style={styles.forgotPassword}>
            <Link to="#" style={styles.link}>
              Forgot Password?
            </Link>
          </div>
        )}

        <button type="submit" style={styles.submitButton}>
          {isSignup ? 'Sign Up' : 'Log In'}
        </button>

        <div style={styles.switchAuth}>
          <span style={styles.switchText}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            style={styles.switchButton}
          >
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerText}>or continue with</span>
      </div>

      <div style={styles.socialButtons}>
        {[
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
            alt: 'Google',
          },
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
            alt: 'Facebook',
          },
          {
            src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
            alt: 'GitHub',
          },
        ].map(({ src, alt }) => (
          <button key={alt} style={styles.socialButton} type="button">
            <img src={src} alt={alt} style={styles.socialIcon} />
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    maxWidth: '28rem',
    margin: '0 auto',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: '2rem',
    position: 'relative',
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '1rem',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    borderRadius: '0.75rem',
    border: '1px solid #E5E7EB',
    fontSize: '1rem',
    color: '#111827',
    backgroundColor: '#F9FAFB',
    outline: 'none',
  },
  passwordToggle: {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '1.5rem',
  },
  link: {
    color: '#9333EA',
    fontSize: '0.875rem',
    fontWeight: '500',
    textDecoration: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '0.875rem',
    backgroundColor: '#9333EA',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.5rem',
  },
  switchAuth: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6B7280',
  },
  switchText: {
    marginRight: '0.5rem',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#9333EA',
    fontWeight: '600',
    cursor: 'pointer',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '2rem 0',
  },
  dividerText: {
    padding: '0 1rem',
    color: '#9CA3AF',
    fontSize: '0.875rem',
    backgroundColor: '#fff',
  },
  socialButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  socialButton: {
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    border: '1px solid #E5E7EB',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  socialIcon: {
    width: '1.5rem',
    height: '1.5rem',
  },
};

export default AuthPage;
