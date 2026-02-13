import Card from './ui/Card';

export default function ServiceCard({ service, selected, onClick }) {
  const { icon, title, description } = service;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card
        hover
        className={
          selected
            ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 border-blue-200'
            : ''
        }
      >
        <div className="flex items-start gap-4">
          <span
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gray-100 text-2xl"
            aria-hidden
          >
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </button>
  );
}
