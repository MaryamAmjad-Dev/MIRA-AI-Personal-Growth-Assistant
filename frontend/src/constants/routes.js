export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  DASHBOARD: '/dashboard',
  JOURNAL: '/journal',
  HABITS: '/habits',
  PLANNER: '/planner',
  GOALS: '/goals',
  COACH: '/coach',
  DAILY_CHECKIN: '/daily-checkin',
  REPORTS: '/reports',
  CALENDAR: '/calendar',
  ANALYTICS: '/analytics',
  TWIN: '/twin',
  DECISION: '/decision',
  TIMELINE: '/timeline',
  VAULT: '/vault',
  DREAMS: '/dreams',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, labelKey: 'nav.dashboard', icon: '🏠' },
  { path: ROUTES.JOURNAL, labelKey: 'nav.journal', icon: '📔' },
  { path: ROUTES.HABITS, labelKey: 'nav.habits', icon: '✅' },
  { path: ROUTES.PLANNER, labelKey: 'nav.planner', icon: '📋' },
  { path: ROUTES.GOALS, labelKey: 'nav.goals', icon: '🎯' },
  { path: ROUTES.COACH, labelKey: 'nav.coach', icon: '🤖' },
  { path: ROUTES.DAILY_CHECKIN, labelKey: 'nav.dailyCheckin', icon: '🌅' },
  { path: ROUTES.REPORTS, labelKey: 'nav.reports', icon: '📑' },
  { path: ROUTES.CALENDAR, labelKey: 'nav.calendar', icon: '📅' },
  { path: ROUTES.ANALYTICS, labelKey: 'nav.analytics', icon: '📊' },
  { path: ROUTES.PROFILE, labelKey: 'nav.profile', icon: '👤' },
  { path: ROUTES.SETTINGS, labelKey: 'nav.settings', icon: '⚙️' },
];

export const INTELLIGENCE_NAV_ITEMS = [
  { path: ROUTES.TWIN, labelKey: 'nav.digitalTwin', icon: '🧬' },
  { path: ROUTES.DECISION, labelKey: 'nav.decisionRoom', icon: '⚖️' },
  { path: ROUTES.TIMELINE, labelKey: 'nav.lifeTimeline', icon: '📜' },
  { path: ROUTES.VAULT, labelKey: 'nav.privateVault', icon: '🔐' },
  { path: ROUTES.DREAMS, labelKey: 'nav.dreamJournal', icon: '🌙' },
];

export const HABIT_CATEGORIES = [
  { id: 'health', label: 'Health', icon: '💪' },
  { id: 'fitness', label: 'Fitness', icon: '🏃' },
  { id: 'learning', label: 'Learning', icon: '📚' },
  { id: 'hydration', label: 'Hydration', icon: '💧' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'sleep', label: 'Sleep', icon: '😴' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
];
