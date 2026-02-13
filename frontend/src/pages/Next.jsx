import { Link } from 'react-router-dom';

export default function Next() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md">
        <h1 className="text-xl font-semibold text-gray-900">You're all set</h1>
        <p className="mt-2 text-gray-500">
          This is a placeholder page. Check the console for the submitted data.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
