import BrandLogo from './brand/BrandLogo';
import ButterflyAura from './brand/ButterflyAura';
import { useBrandVariant } from '../hooks/useBrandVariant';

export function Spinner({ size = 'md' }) {
  return <div className={`spinner spinner-${size}`} role="status" aria-label="Loading" />;
}

export function EntrySkeleton() {
  return (
    <div className="entry-card glass-card skeleton-entry">
      <div className="skeleton-line skeleton-line-sm" />
      <div className="skeleton-line skeleton-line-lg" />
      <div className="skeleton-line skeleton-line-md" />
    </div>
  );
}

export function EntryListSkeleton({ count = 3 }) {
  return (
    <div className="entries-grid">
      {Array.from({ length: count }).map((_, i) => (
        <EntrySkeleton key={i} />
      ))}
    </div>
  );
}

export default function Loader({ message = 'Loading...', branded = false }) {
  const brandVariant = useBrandVariant();

  if (branded) {
    return (
      <div className="loader auth-loading">
        <ButterflyAura intensity="soft" />
        <div className="loader-brand">
          <BrandLogo variant={brandVariant} />
        </div>
        <Spinner size="lg" />
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="loader">
      <Spinner size="lg" />
      <p>{message}</p>
    </div>
  );
}
