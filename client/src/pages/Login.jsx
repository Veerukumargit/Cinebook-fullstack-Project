import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search || ''}` : '/';

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={target} replace />;

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) v.email = 'Enter a valid email address';
    if (!form.password) v.password = 'Enter your password';
    setErrors(v);
    setFormError('');
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
    } catch (err) {
      setFormError(err.message || 'Could not log in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to book tickets and manage your bookings."
      footer={
        <>
          New to CineBook? <Link to="/signup" state={location.state}>Create an account</Link>
        </>
      }
    >
      {location.state?.message && !formError && <div className="notice">{location.state.message}</div>}
      {formError && (
        <div className="alert" role="alert">
          {formError}
        </div>
      )}

      <form onSubmit={submit} noValidate className="auth-form">
        <label className="field">
          <span>Email</span>
          <input
            className={`input ${errors.email ? 'invalid' : ''}`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={set('email')}
            autoFocus
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </label>

        <label className="field">
          <span>Password</span>
          <PasswordInput
            autoComplete="current-password"
            placeholder="Your password"
            value={form.password}
            onChange={set('password')}
            invalid={Boolean(errors.password)}
          />
          {errors.password && <small className="error-text">{errors.password}</small>}
        </label>

        <label className="check-row">
          <input type="checkbox" checked={form.remember} onChange={set('remember')} />
          <span>Keep me logged in for 30 days</span>
        </label>

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
}
