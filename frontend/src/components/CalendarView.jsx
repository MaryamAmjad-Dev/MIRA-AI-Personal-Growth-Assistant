import { useEffect, useMemo, useState } from 'react';
import { fetchCalendar, fetchEntriesByDate } from '../api/journal';
import Card from './ui/Card';
import EntryCard from './EntryCard';
import { EntryListSkeleton } from './Loader';

export default function CalendarView() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() + 1 });
  const [days, setDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEntries, setDayEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCalendar(current.year, current.month)
      .then(setDays)
      .finally(() => setLoading(false));
  }, [current.year, current.month]);

  const dayMap = useMemo(() => {
    const map = {};
    days.forEach((d) => {
      map[d.date] = d;
    });
    return map;
  }, [days]);

  const calendarDays = useMemo(() => {
    const first = new Date(current.year, current.month - 1, 1);
    const last = new Date(current.year, current.month, 0);
    const startPad = first.getDay();
    const total = last.getDate();
    const cells = [];

    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= total; d++) {
      const dateKey = `${current.year}-${String(current.month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateKey, data: dayMap[dateKey] });
    }
    return cells;
  }, [current, dayMap]);

  const handleSelectDate = async (dateKey) => {
    setSelectedDate(dateKey);
    setDayLoading(true);
    try {
      const entries = await fetchEntriesByDate(dateKey);
      setDayEntries(entries);
    } finally {
      setDayLoading(false);
    }
  };

  const monthLabel = new Date(current.year, current.month - 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = () => {
    setCurrent((c) => {
      if (c.month === 1) return { year: c.year - 1, month: 12 };
      return { ...c, month: c.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrent((c) => {
      if (c.month === 12) return { year: c.year + 1, month: 1 };
      return { ...c, month: c.month + 1 };
    });
  };

  return (
    <div className="calendar-view">
      <Card className="calendar-card animate-in">
        <div className="calendar-header">
          <button type="button" className="btn btn-ghost btn-sm" onClick={prevMonth}>
            ←
          </button>
          <h3>{monthLabel}</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={nextMonth}>
            →
          </button>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {loading ? (
          <div className="calendar-grid skeleton-chart" />
        ) : (
          <div className="calendar-grid">
            {calendarDays.map((cell, i) =>
              cell ? (
                <button
                  key={cell.dateKey}
                  type="button"
                  className={`calendar-day ${cell.data ? 'has-entry' : ''} ${selectedDate === cell.dateKey ? 'selected' : ''}`}
                  onClick={() => handleSelectDate(cell.dateKey)}
                >
                  <span className="calendar-day-num">{cell.day}</span>
                  {cell.data && <span className="calendar-day-emoji">{cell.data.emoji}</span>}
                </button>
              ) : (
                <div key={`pad-${i}`} className="calendar-day empty" />
              )
            )}
          </div>
        )}
      </Card>

      {selectedDate && (
        <Card className="calendar-entries animate-in">
          <h3>
            Entries for{' '}
            {new Date(selectedDate).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          {dayLoading ? (
            <EntryListSkeleton count={2} />
          ) : dayEntries.length === 0 ? (
            <p className="empty-hint">No entries on this day.</p>
          ) : (
            <div className="entries-grid">
              {dayEntries.map((entry) => (
                <EntryCard key={entry._id} entry={entry} readOnly />
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
