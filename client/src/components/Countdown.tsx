import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Clock } from 'lucide-react';

interface CountdownProps {
  releaseDate: string;
}

const Countdown = ({ releaseDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const { themeClasses } = useTheme();

  useEffect(() => {
    const targetDate = new Date(releaseDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null); // the date has passed
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [releaseDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className={`mt-6 p-4 rounded-xl border ${themeClasses.border}/50 bg-black/40 inline-block`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-5 h-5 ${themeClasses.textSecondary}`} />
        <h3 className={`font-semibold ${themeClasses.textPrimary}`}>Releasing In</h3>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{timeLeft.days}</span>
          <span className={`text-xs ${themeClasses.textSecondary}`}>Days</span>
        </div>
        <div className={`text-2xl font-bold ${themeClasses.textSecondary}`}>:</div>
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{timeLeft.hours.toString().padStart(2, '0')}</span>
          <span className={`text-xs ${themeClasses.textSecondary}`}>Hours</span>
        </div>
        <div className={`text-2xl font-bold ${themeClasses.textSecondary}`}>:</div>
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
          <span className={`text-xs ${themeClasses.textSecondary}`}>Mins</span>
        </div>
        <div className={`text-2xl font-bold ${themeClasses.textSecondary}`}>:</div>
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-bold ${themeClasses.textPrimary}`}>{timeLeft.seconds.toString().padStart(2, '0')}</span>
          <span className={`text-xs ${themeClasses.textSecondary}`}>Secs</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
