export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="field-label">{label}</label>}
      <input className={`input ${error ? 'input-error' : ''}`} {...props} />
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
}
