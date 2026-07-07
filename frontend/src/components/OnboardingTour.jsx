import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { updateProfile } from '../api/user';
import { APP_NAME, BRAND_SIGNATURE } from '../constants/branding';

const STEPS = [
  { title: `Welcome to ${APP_NAME}`, text: `Your premium AI wellness platform by ${BRAND_SIGNATURE} — journaling, habits, goals, and personal growth.` },
  { title: 'Track Your Moods', text: 'Choose from 26+ moods across positive, neutral, and negative categories.' },
  { title: 'Build Habits & Goals', text: 'Use the habit tracker and goal system to build lasting routines.' },
  { title: 'Meet MIRA AI', text: 'Get personalized insights based on your mood and activity patterns.' },
];

export default function OnboardingTour() {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(!user?.preferences?.onboardingComplete);

  if (!visible) return null;

  const finish = async () => {
    await updateProfile({ preferences: { ...user.preferences, onboardingComplete: true } });
    updateUser({ preferences: { ...user.preferences, onboardingComplete: true } });
    setVisible(false);
  };

  return (
    <AnimatePresence>
      <motion.div className="onboarding-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div className="onboarding-card glass-card" key={step} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <span className="onboarding-step">{step + 1}/{STEPS.length}</span>
          <h2>{STEPS[step].title}</h2>
          <p>{STEPS[step].text}</p>
          <div className="onboarding-actions">
            <button type="button" className="btn btn-ghost" onClick={finish}>Skip</button>
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={finish}>Get Started</button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
