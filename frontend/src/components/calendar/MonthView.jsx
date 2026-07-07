import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export default function MonthView({ current, setCurrent, moodDays, habits, tasks, onSelectDate }) {
  const start = startOfMonth(current);
  const end = endOfMonth(current);
  const days = eachDayOfInterval({ start, end });
  const moodMap = Object.fromEntries(moodDays.map((d) => [d.date, d]));

  return (
    <div className="month-view glass-card">
      <div className="calendar-header">
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1))}>←</button>
        <h3>{format(current, 'MMMM yyyy')}</h3>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1))}>→</button>
      </div>
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-grid month-grid">
        {Array.from({ length: start.getDay() }).map((_, i) => <div key={`p${i}`} className="calendar-day empty" />)}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const mood = moodMap[key];
          const hasTask = tasks.some((t) => t.dueDate && isSameDay(new Date(t.dueDate), day));
          const hasHabit = habits.some((h) => h.completedDates?.includes(key));
          return (
            <button key={key} type="button" className={`calendar-day ${mood ? 'has-entry' : ''}`} onClick={() => onSelectDate(day)}>
              <span className="calendar-day-num">{format(day, 'd')}</span>
              <div className="cal-indicators">
                {mood && <span>{mood.emoji}</span>}
                {hasHabit && <span className="dot habit-dot" />}
                {hasTask && <span className="dot task-dot" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
