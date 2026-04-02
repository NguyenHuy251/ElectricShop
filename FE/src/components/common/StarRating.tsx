import React from 'react';
import '../../assets/styles/components/ui-common.css';

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

  const sizeClass = size <= 13 ? 'size-13' : size <= 16 ? 'size-16' : 'size-18';

  return (
    <span className={`common-star-rating ${sizeClass}`}>
      {stars.map(({ key, filled, half }) => (
        <span key={key} className="common-star-item">
          {filled ? (
            <span className="common-star-filled">★</span>
          ) : half ? (
            <span className="common-star-half">
              <span className="common-star-empty">★</span>
              <span className="common-star-half-fill common-star-filled">★</span>
            </span>
          ) : (
            <span className="common-star-empty">★</span>
          )}
        </span>
      ))}
      {showValue && (
        <span className="common-star-value">
          {rating.toFixed(1)}{reviewCount !== undefined && ` (${reviewCount})`}
        </span>
      )}
    </span>
  );
};

export default StarRating;
