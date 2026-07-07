import { APP_NAME } from '../constants/branding';

export default function EmptyState({ hasFilters }) {
  return (
    <div className="empty-state glass-card animate-in">
      <span className="empty-icon" aria-hidden="true">
        {hasFilters ? '🔎' : '📝'}
      </span>
      <h3>{hasFilters ? 'No matching entries' : `Your ${APP_NAME} journal is empty`}</h3>
      <p>
        {hasFilters
          ? 'Try adjusting your search or mood filter to find entries.'
          : 'Pick a mood and write your first entry to start your transformation journey.'}
      </p>
    </div>
  );
}
