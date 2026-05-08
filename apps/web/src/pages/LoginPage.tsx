import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Eye, EyeOff, Phone, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reveal } from '../components/ui/Reveal';
import { API_BASE } from '../config/api';

const countryCodes = [
  { code: '+91', country: 'India' },
  { code: '+1', country: 'USA' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
  { code: '+61', country: 'Australia' },
];

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? `${API_BASE}/api/login` : `${API_BASE}/api/register`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const role = typeof data.role === 'string' ? data.role : data.username === 'admin' || formData.username === 'admin' ? 'admin' : 'user';

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('username', data.username || formData.username);
        navigate('/');
      } else {
        setError(data.message || 'Action failed');
      }
    } catch (err) {
      setError('Connection failed. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="section-padding flex-center min-h-screen">
        <div className="container-custom">
          <div className="login-card-wrapper">
            <Reveal>
              <div className="login-card glass">
                <div className="login-header">
                  <div className="login-icon-wrap">
                    <Lock className="login-icon" size={24} />
                  </div>
                  <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                  <p>{mode === 'login' ? 'Enter your credentials to access your account' : 'Fill in the details to join DigitBuild'}</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="form-fields-grid"
                    >
                      {mode === 'register' && (
                        <>
                          <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrap">
                              <User className="input-icon" size={18} />
                              <input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrap">
                              <Mail className="input-icon" size={18} />
                              <input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="phone-input-group">
                              <div className="country-select-wrap">
                                <select id="countryCode" value={formData.countryCode} onChange={handleInputChange}>
                                  {countryCodes.map((c) => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                  ))}
                                </select>
                                <ChevronDown className="select-arrow" size={14} />
                              </div>
                              <div className="input-wrap flex-1">
                                <Phone className="input-icon" size={18} />
                                <input id="phone" type="tel" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} required />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrap">
                          <User className="input-icon" size={18} />
                          <input id="username" type="text" placeholder="Email address" value={formData.username} onChange={handleInputChange} required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrap">
                          <Lock className="input-icon" size={18} />
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {error && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="form-error">
                      {error}
                    </motion.p>
                  )}

                  <button type="submit" className={`btn btn-lg btn-block ${isLoading ? 'btn-loading' : ''}`} disabled={isLoading}>
                    {isLoading ? (mode === 'login' ? 'Signing in...' : 'Creating...') : (mode === 'login' ? 'Sign In' : 'Sign Up')}
                  </button>
                </form>

                <div className="login-footer">
                  <p>
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      className="text-primary cursor-pointer btn-link"
                      onClick={() => {
                        setMode(mode === 'login' ? 'register' : 'login');
                        setError(null);
                      }}
                    >
                      {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
