export default function ResponsiveGrid({
  children,
  className = '',
  cols = { mobile: 1, tablet: 2, desktop: 3 },
}) {
  const style = {
    '--grid-cols-mobile': cols.mobile ?? 1,
    '--grid-cols-tablet': cols.tablet ?? 2,
    '--grid-cols-desktop': cols.desktop ?? 3,
  };

  return (
    <div className={`responsive-grid ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
