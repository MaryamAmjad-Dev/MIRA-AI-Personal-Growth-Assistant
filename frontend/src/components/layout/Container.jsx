export default function Container({ children, className = '', size = 'default' }) {
  return (
    <div className={`layout-container layout-container-${size} ${className}`.trim()}>
      {children}
    </div>
  );
}
