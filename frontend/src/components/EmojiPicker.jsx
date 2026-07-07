import MoodLibrary from './MoodLibrary';

export default function EmojiPicker({ selectedMood, selectedEmoji, onSelect }) {
  const mood = selectedMood || (selectedEmoji ? { emoji: selectedEmoji } : null);

  return (
    <MoodLibrary
      selectedMood={mood}
      onSelect={(m) => onSelect(m)}
    />
  );
}
