import { format, startOfWeek, addDays } from 'date-fns';

export default function WeekView({ current, moodDays, habits, onSelectDate }) {
  const weekStart = startOfWeek(current);
  const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const moodMap = Object.fromEntries(moodDays.map((d) => [d.date, d]));

  return (
    <div className="week-view glass-card">
      <div className="week-grid">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const mood = moodMap[key];
          const habitCount = habits.filter((h) => h.completedDates?.includes(key)).length;
          return (
            <button key={key} type="button" className="week-day-col" onClick={() => onSelectDate(day)}>
              <span className="week-day-label">{format(day, 'EEE d')}</span>
              {mood && <span className="week-mood">{mood.emoji}</span>}
              {habitCount > 0 && <span className="week-habits">{habitCount} habits ✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
