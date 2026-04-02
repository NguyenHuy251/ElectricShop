import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, total, pageSize, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="ui-pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="ui-pagination-btn"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} className="ui-pagination-dot">...</span>
        ) : (
          <button key={p} onClick={() => onChange(p as number)} className={`ui-pagination-btn ${p === page ? 'active' : ''}`}>
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="ui-pagination-btn"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
