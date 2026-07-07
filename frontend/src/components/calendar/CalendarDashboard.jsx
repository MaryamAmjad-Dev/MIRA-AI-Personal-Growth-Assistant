import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fetchCalendar, fetchEntriesByDate } from '../../api/journal';
import { fetchHabits } from '../../api/habits';
import { fetchTasks } from '../../api/tasks';
import MonthView from './MonthView';
import WeekView from './WeekView';

export default function CalendarDashboard() {
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(new Date());
  const [moodDays, setMoodDays] = useState([]);
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);

  useEffect(() => {
    fetchCalendar(current.getFullYear(), current.getMonth() + 1).then(setMoodDays);
    fetchHabits().then(setHabits);
    fetchTasks().then(setTasks);
  }, [current]);

  const selectDate = async (date) => {
    setSelectedDate(date);
    const entries = await fetchEntriesByDate(format(date, 'yyyy-MM-dd'));
    setDayEntries(entries);
  };

  return (
    <div className="calendar-dashboard">
      <div className="calendar-view-tabs">
        {['day', 'week', 'month'].map((v) => (
          <button key={v} type="button" className={`filter-tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {view === 'month' && (
        <MonthView current={current} setCurrent={setCurrent} moodDays={moodDays} habits={habits} tasks={tasks} onSelectDate={selectDate} />
      )}
      {view === 'week' && (
        <WeekView current={current} moodDays={moodDays} habits={habits} onSelectDate={selectDate} />
      )}
      {view === 'day' && selectedDate && (
        <div className="day-view glass-card">
          <h3>{format(selectedDate, 'EEEE, MMMM d')}</h3>
          {dayEntries.map((e) => (
            <div key={e._id} className="day-event mood-event">{e.mood?.emoji || e.emoji} {e.text.slice(0, 60)}</div>
          ))}
        </div>
      )}

      {selectedDate && view !== 'day' && (
        <div className="calendar-day-detail glass-card animate-in">
          <h3>{format(selectedDate, 'MMMM d, yyyy')}</h3>
          {dayEntries.length === 0 ? <p className="empty-hint">No events</p> : dayEntries.map((e) => (
            <div key={e._id} className="day-event">{e.mood?.emoji || e.emoji} {e.text.slice(0, 80)}</div>
          ))}
          {tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selectedDate)).map((t) => (
            <div key={t._id} className="day-event task-event">📋 {t.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
