import { useCallback, useEffect, useState } from 'react';
import {
  createEntry,
  deleteEntry,
  fetchEntries,
  toggleFavorite,
  updateEntry,
} from '../api/journal';
import { useToast } from '../context/ToastContext';

export function useJournal(filters = {}) {
  const { addToast } = useToast();
  const search = filters.search || '';
  const emoji = filters.emoji || '';
  const tag = filters.tag || '';
  const favorites = filters.favorites || false;

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEntries({ search, emoji, tag, favorites });
      setEntries(data);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [search, emoji, tag, favorites, addToast]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const saveEntry = async (entryData) => {
    try {
      setSaving(true);
      await createEntry(entryData);
      addToast('Entry saved successfully!');
      await loadEntries();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const editEntry = async (id, data) => {
    try {
      setUpdating(true);
      await updateEntry(id, data);
      addToast('Entry updated successfully!');
      await loadEntries();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const removeEntry = async (id) => {
    try {
      setDeletingId(id);
      await deleteEntry(id);
      addToast('Entry deleted successfully!');
      await loadEntries();
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  const favoriteEntry = async (id) => {
    try {
      await toggleFavorite(id);
      await loadEntries();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return {
    entries,
    loading,
    saving,
    updating,
    deletingId,
    saveEntry,
    editEntry,
    removeEntry,
    favoriteEntry,
    reload: loadEntries,
  };
}
