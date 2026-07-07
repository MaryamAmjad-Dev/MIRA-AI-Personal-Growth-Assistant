/**
 * Premium glass card for AI-generated content sections.
 */
export default function AiCard({ title, children, className = '', as: Tag = 'article' }) {
  return (
    <Tag className={['ai-card', className].filter(Boolean).join(' ')}>
      {title ? <h3 className="ai-card-title">{title}</h3> : null}
      <div className="ai-card-inner ai-text">{children}</div>
    </Tag>
  );
}
