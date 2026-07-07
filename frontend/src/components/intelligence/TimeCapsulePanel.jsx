import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchCapsules, createCapsule, openCapsule } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function TimeCapsulePanel() {
  const { addToast } = useToast();
  const [capsules, setCapsules] = useState([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => fetchCapsules().then(setCapsules).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCapsule({ title, message, unlockDate });
      addToast('Time capsule sealed!');
      setMessage('');
      setTitle('');
      load();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const open = async (id) => {
    try {
      const c = await openCapsule(id);
      addToast('Capsule opened!');
      setCapsules((prev) => prev.map((x) => (x._id === id ? { ...x, locked: false, preview: c.message, canOpen: false } : x)));
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="intel-card time-capsule">
      <h3>⏳ Time Capsule Letters</h3>
      <form onSubmit={create} className="capsule-form">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="journal-textarea" placeholder="Letter to your future self..." value={message} onChange={(e) => setMessage(e.target.value)} required rows={4} />
        <Input label="Open after" type="date" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} required />
        <Button type="submit" disabled={loading}>Seal Capsule</Button>
      </form>
      <div className="capsule-list">
        {capsules.map((c) => (
          <motion.div key={c._id} className={`capsule-item ${c.locked ? 'locked' : 'opened'}`} layout>
            <div className="capsule-lock">{c.locked ? '🔒' : '📬'}</div>
            <div>
              <strong>{c.title}</strong>
              {c.locked ? (
                <p>{c.daysLeft > 0 ? `${c.daysLeft} days until unlock` : 'Ready to open!'}</p>
              ) : (
                <p className="capsule-preview">{c.preview}</p>
              )}
              {c.canOpen && (
                <button type="button" className="btn btn-primary btn-sm" onClick={() => open(c._id)}>Open Now</button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
