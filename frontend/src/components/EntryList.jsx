import EntryCard from './EntryCard';
import EmptyState from './EmptyState';
import { groupEntriesByDate } from '../utils/dateUtils';

export default function EntryList({
  entries,
  onEdit,
  onDeleteRequest,
  onFavorite,
  deletingId,
  hasFilters,
}) {
  if (entries.length === 0) {
    return <EmptyState hasFilters={hasFilters} />;
  }

  const groups = groupEntriesByDate(entries);

  return (
    <section className="entry-list">
      {groups.map((group) => (
        <div key={group.dateKey} className="entry-group">
          <h3 className="entry-group-label">{group.label}</h3>
          <div className="entries-grid">
            {group.entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onFavorite={onFavorite}
                deleting={deletingId === entry._id}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
