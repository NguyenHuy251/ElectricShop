import React from 'react';
import { COLORS } from '../../constants';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating, max = 5, size = 16, showValue = false, reviewCount,
}) => {
  const stars = Array.from({ length: max }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half   = !filled && i < rating;
    return { key: i, filled, half };
  });

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {stars.map(({ key, filled, half }) => (
        <span key={key} style={{ fontSize: size, lineHeight: 1 }}>
          {filled ? (
            <span style={{ color: COLORS.star }}>★</span>
          ) : half ? (
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ color: COLORS.border }}>★</span>
              <span style={{ position: 'absolute', left: 0, top: 0, width: '50%', overflow: 'hidden', color: COLORS.star }}>★</span>
            </span>
          ) : (
            <span style={{ color: COLORS.border }}>★</span>
          )}
        </span>
      ))}
      {showValue && (
        <span style={{ fontSize: size - 2, color: COLORS.textSecondary, marginLeft: 4 }}>
          {rating.toFixed(1)}{reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </span>
  );
};

export default StarRating;
