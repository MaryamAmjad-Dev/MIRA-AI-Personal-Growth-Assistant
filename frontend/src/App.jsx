import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROUTES } from './constants/routes';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Loader from './components/Loader';
import { useTranslation } from 'react-i18next';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const JournalPage = lazy(() => import('./pages/JournalPage'));
const HabitsPage = lazy(() => import('./pages/HabitsPage'));
const PlannerPage = lazy(() => import('./pages/PlannerPage'));
const GoalsPage = lazy(() => import('./pages/GoalsPage'));
const AICoachPage = lazy(() => import('./pages/AICoachPage'));
const DailyCheckinPage = lazy(() => import('./pages/DailyCheckinPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TwinPage = lazy(() => import('./pages/TwinPage'));
const DecisionPage = lazy(() => import('./pages/DecisionPage'));
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const VaultPage = lazy(() => import('./pages/VaultPage'));
const DreamsPage = lazy(() => import('./pages/DreamsPage'));

function PageLoader() {
  const { t } = useTranslation();
  return (
    <div className="auth-loading">
      <Loader branded message={t('auth.loading')} />
    </div>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { t } = useTranslation();
  if (loading) return <div className="auth-loading"><Loader branded message={t('auth.loading')} /></div>;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return children;
}

function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <Navigate to={ROUTES.DASHBOARD} replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingPage />
    </Suspense>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path={ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path={ROUTES.RESET_PASSWORD} element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.JOURNAL} element={<JournalPage />} />
          <Route path={ROUTES.HABITS} element={<HabitsPage />} />
          <Route path={ROUTES.PLANNER} element={<PlannerPage />} />
          <Route path={ROUTES.GOALS} element={<GoalsPage />} />
          <Route path={ROUTES.COACH} element={<AICoachPage />} />
          <Route path={ROUTES.DAILY_CHECKIN} element={<DailyCheckinPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.TWIN} element={<TwinPage />} />
          <Route path={ROUTES.DECISION} element={<DecisionPage />} />
          <Route path={ROUTES.TIMELINE} element={<TimelinePage />} />
          <Route path={ROUTES.VAULT} element={<VaultPage />} />
          <Route path={ROUTES.DREAMS} element={<DreamsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
