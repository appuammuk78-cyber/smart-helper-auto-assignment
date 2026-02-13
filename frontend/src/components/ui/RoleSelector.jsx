const ROLES = [
  { id: 'customer', label: 'Customer', icon: '👤' },
  { id: 'helper', label: 'Helper', icon: '🔧' },
  { id: 'admin', label: 'Admin', icon: '⚙️' },
];

export default function RoleSelector({ value, onChange, className = '' }) {
  return (
    <div className={className} role="group" aria-label="Select your role">
      <p className="text-sm font-medium text-gray-700 mb-3">Select your role</p>
      <div className="grid grid-cols-3 gap-3">
        {ROLES.map((role) => {
          const isSelected = value === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onChange(role.id)}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-2xl border-2
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                hover:border-blue-300
                ${isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-600'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${role.label}${isSelected ? ', selected' : ''}`}
            >
              <span className="text-2xl" aria-hidden>
                {role.icon}
              </span>
              <span className="text-sm font-medium">{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
