import Container from './Container';

export default function PageWrapper({ children, className = '' }) {
  return (
    <div className={`page-wrapper ${className}`.trim()}>
      <Container>{children}</Container>
    </div>
  );
}
