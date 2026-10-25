export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-visual" aria-hidden="true">
        <img
          src="https://picsum.photos/seed/cinebook-cinema/1400/1800"
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="auth-quote">
          <p className="display">Your seat is waiting.</p>
          <span>Book tickets, pick your seats, skip the queue.</span>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <h1 className="display">{title}</h1>
          <p className="muted auth-sub">{subtitle}</p>
          {children}
          <p className="auth-footer muted">{footer}</p>
        </div>
      </div>
    </div>
  );
}
