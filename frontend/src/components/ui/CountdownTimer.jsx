import { useEffect, useState } from 'react';

export default function CountdownTimer({
  initialSeconds = 10,
  onExpire,
  isRunning = true,
}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    setSeconds(initialSeconds);
    setHasExpired(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning || hasExpired) return;
    if (seconds <= 0) {
      setHasExpired(true);
      if (onExpire) onExpire();
      return;
    }

    const id = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [seconds, isRunning, hasExpired, onExpire]);

  const progress = (seconds / initialSeconds) * 100;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div className="relative flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${
            seconds <= 3 ? 'bg-red-500' : 'bg-amber-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className={seconds <= 3 ? 'text-red-500 font-semibold' : ''}>
        {seconds}s
      </span>
    </div>
  );
}

