import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { passwordIssue } from '../api/auth.js';

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

export default function Signup() {
  const { user, signup } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const from = location.state?.from;
  const target = from ? `${from.pathname}${from.search || ''}` : '/';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={target} replace />;

  const set = (key) => (e) => {
    let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    if (key === 'phone') value = value.replace(/\D/g, '').slice(0, 10);
    setForm((f) => ({ ...f, [key]: value }));
  };

  const score = strength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    const v = {};
    if (form.name.trim().length < 2) v.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) v.email = 'Enter a valid email address';
    if (!/^[6-9]\d{9}$/.test(form.phone)) v.phone = 'Enter a valid 10-digit mobile number';
    const issue = passwordIssue(form.password);
    if (issue) v.password = issue;
    if (form.confirm !== form.password) v.confirm = 'Passwords do not match';
    if (!form.terms) v.terms = 'Please accept the terms to continue';
    setErrors(v);
    setFormError('');
    if (Object.keys(v).length) return;

    setBusy(true);
    try {
      const u = await signup(form);
      toast.success(`Account created. Welcome, ${u.name.split(' ')[0]}!`);
    } catch (err) {
      setFormError(err.message || 'Could not create your account.');
    } finally {
      setBusy(false);
    }
  };

  const text = (key, label, props = {}) => (
    <label className="field">
      <span>{label}</span>
      <input
        className={`input ${errors[key] ? 'invalid' : ''}`}
        value={form[key]}
        onChange={set(key)}
        {...props}
      />
      {errors[key] && <small className="error-text">{errors[key]}</small>}
    </label>
  );

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up in a minute and start booking."
      footer={
        <>
          Already have an account? <Link to="/login" state={location.state}>Log in</Link>
        </>
      }
    >
      {formError && (
        <div className="alert" role="alert">
          {formError}
        </div>
      )}

      <form onSubmit={submit} noValidate className="auth-form">
        {text('name', 'Full name', { autoComplete: 'name', placeholder: 'Your name', autoFocus: true })}
        {text('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
        {text('phone', 'Mobile number', {
          inputMode: 'numeric',
          autoComplete: 'tel',
          placeholder: '10-digit number',
        })}

        <label className="field">
          <span>Password</span>
          <PasswordInput
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={form.password}
            onChange={set('password')}
            invalid={Boolean(errors.password)}
          />
          {form.password && (
            <div className="strength" aria-live="polite">
              <div className="strength-bars">
                {[1, 2, 3, 4].map((n) => (
                  <i key={n} className={n <= score ? `on s${score}` : ''} />
                ))}
              </div>
              <small>{LABELS[score]}</small>
            </div>
          )}
          {errors.password && <small className="error-text">{errors.password}</small>}
        </label>

        <label className="field">
          <span>Confirm password</span>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirm}
            onChange={set('confirm')}
            invalid={Boolean(errors.confirm)}
          />
          {errors.confirm && <small className="error-text">{errors.confirm}</small>}
        </label>

        <label className="check-row">
          <input type="checkbox" checked={form.terms} onChange={set('terms')} />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>
        {errors.terms && <small className="error-text">{errors.terms}</small>}

        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  );
}
