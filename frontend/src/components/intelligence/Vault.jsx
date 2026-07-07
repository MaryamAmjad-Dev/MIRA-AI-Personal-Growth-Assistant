import { useEffect, useState } from 'react';
import { fetchVaultEntries, createVaultEntry, unlockVaultEntry, deleteVaultEntry } from '../../api/intelligence';
import { useToast } from '../../context/ToastContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function Vault() {
  const { addToast } = useToast();
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [unlockPass, setUnlockPass] = useState('');
  const [unlocked, setUnlocked] = useState(null);
  const [unlockId, setUnlockId] = useState(null);

  const load = () => fetchVaultEntries().then(setEntries).catch(() => {});
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await createVaultEntry({ title, content, passphrase });
      addToast('Entry encrypted and locked in vault');
      setTitle('');
      setContent('');
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const unlock = async () => {
    try {
      const data = await unlockVaultEntry(unlockId, unlockPass);
      setUnlocked(data);
      addToast('Vault unlocked');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="intel-card vault-panel">
      <h3>🔐 Private Vault</h3>
      <p className="intel-sub">AES-256 encrypted entries — only you can unlock with your passphrase</p>
      <form onSubmit={create} className="vault-form">
        <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className="journal-textarea" placeholder="Private thoughts..." value={content} onChange={(e) => setContent(e.target.value)} required rows={4} />
        <Input label="Vault Passphrase" type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} required />
        <Button type="submit">Lock in Vault</Button>
      </form>
      <div className="vault-list">
        {entries.map((e) => (
          <div key={e._id} className="vault-item">
            <span>🔒</span>
            <div>
              <strong>{e.title}</strong>
              <small>{new Date(e.createdAt).toLocaleDateString()}</small>
              {unlockId === e._id ? (
                <div className="vault-unlock-row">
                  <input type="password" className="input" placeholder="Passphrase" value={unlockPass} onChange={(ev) => setUnlockPass(ev.target.value)} />
                  <Button onClick={unlock}>Unlock</Button>
                </div>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setUnlockId(e._id)}>Unlock</button>
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => deleteVaultEntry(e._id).then(load)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {unlocked && (
        <div className="vault-unlocked glass-card animate-in">
          <h4>{unlocked.title}</h4>
          <p>{unlocked.content}</p>
        </div>
      )}
    </div>
  );
}
