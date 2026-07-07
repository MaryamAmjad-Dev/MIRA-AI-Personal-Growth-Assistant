import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import EntryForm from '../components/EntryForm';
import EntryList from '../components/EntryList';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import { TagFilter } from '../components/TagInput';
import EditEntryModal from '../components/EditEntryModal';
import ConfirmModal from '../components/ConfirmModal';
import { EntryListSkeleton } from '../components/Loader';
import { useJournal } from '../hooks/useJournal';
import { useStats } from '../hooks/useStats';

export default function JournalPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { reload: reloadStats } = useStats();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filters = useMemo(
    () => ({
      search: debouncedSearch,
      emoji: moodFilter,
      tag: tagFilter,
      favorites: favoritesOnly,
    }),
    [debouncedSearch, moodFilter, tagFilter, favoritesOnly]
  );

  const {
    entries,
    loading,
    saving,
    updating,
    deletingId,
    saveEntry,
    editEntry,
    removeEntry,
    favoriteEntry,
  } = useJournal(filters);

  const hasFilters = Boolean(debouncedSearch || moodFilter || tagFilter || favoritesOnly);

  const handleSave = async (data) => {
    await saveEntry(data);
    reloadStats();
  };

  const handleUpdate = async (id, data) => {
    await editEntry(id, data);
    setEditingEntry(null);
    reloadStats();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await removeEntry(deleteTarget._id);
    setDeleteTarget(null);
    reloadStats();
  };

  return (
    <div className="page">
      <PageHeader title={t('journal.title')} subtitle={t('journal.subtitle')} />

      <EntryForm onSave={handleSave} saving={saving} />

      <section className="journal-controls glass-card animate-in">
        <SearchBar value={search} onChange={setSearch} />
        <FilterTabs activeFilter={moodFilter} onFilterChange={setMoodFilter} />
        <TagFilter activeTag={tagFilter} onChange={setTagFilter} />
        <button
          type="button"
          className={`favorites-filter ${favoritesOnly ? 'active' : ''}`}
          onClick={() => setFavoritesOnly(!favoritesOnly)}
        >
          ★ {t('journal.favorites')}
        </button>
      </section>

      {loading ? (
        <EntryListSkeleton count={4} />
      ) : (
        <EntryList
          entries={entries}
          onEdit={setEditingEntry}
          onDeleteRequest={setDeleteTarget}
          onFavorite={favoriteEntry}
          deletingId={deletingId}
          hasFilters={hasFilters}
        />
      )}

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onSave={handleUpdate}
          onClose={() => setEditingEntry(null)}
          saving={updating}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={t('journal.deleteTitle')}
          message={t('journal.deleteMessage')}
          confirmLabel={t('common.delete')}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deletingId === deleteTarget._id}
        />
      )}
    </div>
  );
}
