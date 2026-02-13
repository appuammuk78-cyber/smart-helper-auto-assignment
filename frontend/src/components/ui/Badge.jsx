export default function Badge({
  children,
  variant = 'default',
  pulse = false,
  className = '',
}) {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium';
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-emerald-100 text-emerald-800',
    primary: 'bg-blue-100 text-blue-800',
  };
  const pulseClass = pulse ? 'animate-pulse-soft' : '';

  return (
    <span
      className={`${base} ${variants[variant]} ${pulseClass} ${className}`}
    >
      {children}
    </span>
  );
}
