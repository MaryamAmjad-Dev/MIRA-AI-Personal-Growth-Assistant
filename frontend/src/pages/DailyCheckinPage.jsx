import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { fetchDailyCheckin, submitDailyCheckin } from '../api/ai';
import { useToast } from '../context/ToastContext';

export default function DailyCheckinPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    feeling: '',
    sleepQuality: 5,
    energyLevel: 5,
    stressLevel: 5,
    todayGoal: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDailyCheckin().then((data) => {
      if (data) {
        setForm({
          feeling: data.feeling || '',
          sleepQuality: data.sleepQuality || 5,
          energyLevel: data.energyLevel || 5,
          stressLevel: data.stressLevel || 5,
          todayGoal: data.todayGoal || '',
        });
        setResult(data);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await submitDailyCheckin(form);
      setResult(data);
      addToast(t('checkin.saved'));
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="page daily-checkin-page">
      <PageHeader title={t('checkin.title')} subtitle={t('checkin.subtitle')} />

      <Card className="checkin-form-card animate-in">
        <form onSubmit={handleSubmit} className="checkin-form">
          <Input label={t('checkin.feeling')} value={form.feeling} onChange={(e) => set('feeling', e.target.value)} required />
          <label className="field-label">{t('checkin.sleepQuality')}: {form.sleepQuality}/10</label>
          <input type="range" min="1" max="10" value={form.sleepQuality} onChange={(e) => set('sleepQuality', +e.target.value)} className="range-input" />
          <label className="field-label">{t('checkin.energyLevel')}: {form.energyLevel}/10</label>
          <input type="range" min="1" max="10" value={form.energyLevel} onChange={(e) => set('energyLevel', +e.target.value)} className="range-input" />
          <label className="field-label">{t('checkin.stressLevel')}: {form.stressLevel}/10</label>
          <input type="range" min="1" max="10" value={form.stressLevel} onChange={(e) => set('stressLevel', +e.target.value)} className="range-input" />
          <Input label={t('checkin.todayGoal')} value={form.todayGoal} onChange={(e) => set('todayGoal', e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? t('checkin.analyzing') : t('checkin.submit')}</Button>
        </form>
      </Card>

      {result?.wellnessScore != null && (
        <Card className="checkin-result animate-in">
          <div className="checkin-score">
            <span className="ai-score">{result.wellnessScore}</span>
            <span>{t('checkin.wellnessScore')}</span>
          </div>
          <p className="checkin-advice">{result.advice}</p>
          {result.aiInsights?.length > 0 && (
            <ul>{result.aiInsights.map((i) => <li key={i}>{i}</li>)}</ul>
          )}
        </Card>
      )}
    </div>
  );
}
