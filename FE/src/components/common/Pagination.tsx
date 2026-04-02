import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="common-pagination">
      <button
        className={`common-pagination-btn ${page === 1 ? 'disabled' : ''}`}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} className="common-pagination-dot muted">…</span>
        ) : (
          <button
            key={p}
            className={`common-pagination-btn ${p === page ? 'active' : ''}`}
            onClick={() => onChange(p as number)}
          >
            {p}
          </button>
        )
      )}
      <button
        className={`common-pagination-btn ${page === totalPages ? 'disabled' : ''}`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
