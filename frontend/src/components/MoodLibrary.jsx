import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MOOD_LIBRARY } from '../constants/moods';
import { fetchCustomMoods, toggleFavoriteMood } from '../api/moods';
import { useAuth } from '../hooks/useAuth';
import MoodCategoryTabs from './MoodCategoryTabs';
import EmojiSearch from './EmojiSearch';

export default function MoodLibrary({ selectedMood, onSelect }) {
  const { user, updateUser } = useAuth();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [customMoods, setCustomMoods] = useState([]);

  useEffect(() => {
    fetchCustomMoods().then(setCustomMoods).catch(() => {});
  }, []);

  const allMoods = useMemo(() => [...MOOD_LIBRARY, ...customMoods], [customMoods]);

  const recentMoods = useMemo(() => {
    return (user?.recentMoods || [])
      .map((emoji) => allMoods.find((m) => m.emoji === emoji))
      .filter(Boolean);
  }, [user?.recentMoods, allMoods]);

  const favoriteMoods = useMemo(() => {
    return (user?.favoriteMoods || [])
      .map((emoji) => allMoods.find((m) => m.emoji === emoji))
      .filter(Boolean);
  }, [user?.favoriteMoods, allMoods]);

  const filtered = useMemo(() => {
    return allMoods.filter((m) => {
      const matchCat = category === 'all' || m.category === category;
      const matchSearch =
        !search ||
        m.name.includes(search.toLowerCase()) ||
        m.emoji.includes(search);
      return matchCat && matchSearch;
    });
  }, [allMoods, category, search]);

  const handleFavorite = async (e, mood) => {
    e.stopPropagation();
    const updated = await toggleFavoriteMood(mood.emoji);
    updateUser({ favoriteMoods: updated });
  };

  const isSelected = (mood) =>
    selectedMood?.emoji === mood.emoji || selectedMood?.name === mood.name;

  const renderMoodBtn = (mood) => (
    <motion.button
      key={`${mood.name}-${mood.emoji}`}
      type="button"
      className={`emoji-btn ${isSelected(mood) ? 'selected' : ''}`}
      onClick={() => onSelect(mood)}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={isSelected(mood) ? { borderColor: mood.color, boxShadow: `0 0 16px ${mood.color}40` } : {}}
    >
      <span className="emoji-btn-inner">{mood.emoji}</span>
      <span className="emoji-btn-label">{mood.name}</span>
      <span
        role="button"
        tabIndex={0}
        className={`mood-fav-star ${user?.favoriteMoods?.includes(mood.emoji) ? 'active' : ''}`}
        onClick={(e) => handleFavorite(e, mood)}
        onKeyDown={(e) => e.key === 'Enter' && handleFavorite(e, mood)}
      >
        ★
      </span>
    </motion.button>
  );

  return (
    <div className="mood-library">
      <p className="field-label">How are you feeling?</p>
      <EmojiSearch value={search} onChange={setSearch} />
      <MoodCategoryTabs active={category} onChange={setCategory} />

      {recentMoods.length > 0 && !search && category === 'all' && (
        <div className="mood-section">
          <h4>Recently Used</h4>
          <div className="emoji-grid">{recentMoods.map(renderMoodBtn)}</div>
        </div>
      )}

      {favoriteMoods.length > 0 && !search && category === 'all' && (
        <div className="mood-section">
          <h4>Favorites</h4>
          <div className="emoji-grid">{favoriteMoods.map(renderMoodBtn)}</div>
        </div>
      )}

      <div className="mood-section">
        <h4>All Moods</h4>
        <div className="emoji-grid mood-grid-scroll">{filtered.map(renderMoodBtn)}</div>
      </div>
    </div>
  );
}
