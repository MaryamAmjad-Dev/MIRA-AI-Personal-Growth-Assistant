export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <header className={`section-header ${className}`.trim()}>
      <div className="section-header-text">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </header>
  );
}
