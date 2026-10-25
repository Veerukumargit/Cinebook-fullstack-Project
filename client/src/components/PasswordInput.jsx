import { useState } from 'react';

export default function PasswordInput({ invalid, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="pw-wrap">
      <input
        {...props}
        type={show ? 'text' : 'password'}
        className={`input ${invalid ? 'invalid' : ''}`}
      />
      <button
        type="button"
        className="pw-toggle"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
