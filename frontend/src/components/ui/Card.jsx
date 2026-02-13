export default function Card({ children, className = '', hover = false, padding = true }) {
  const base =
    'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden';
  const hoverClass = hover
    ? 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5'
    : '';
  const pad = padding ? 'p-5' : '';

  return (
    <div className={`${base} ${hoverClass} ${pad} ${className}`}>
      {children}
    </div>
  );
}
