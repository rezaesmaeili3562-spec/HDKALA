import { StarIcon } from './Icons';
import { faNum } from '../utils/format';

// نمایش امتیاز با ستاره
export default function RatingStars({ rating = 0, count, size = 14, showCount = true }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-1" aria-label={`امتیاز ${faNum(rating)} از ۵`}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <StarIcon
            key={i}
            size={size}
            className={i <= filled ? 'text-accent-400' : 'text-slate-300 dark:text-slate-600'}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {faNum(rating)}
          {typeof count === 'number' && ` (${faNum(count)} نظر)`}
        </span>
      )}
    </div>
  );
}
