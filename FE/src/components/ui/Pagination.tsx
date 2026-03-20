import React from 'react';

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
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={btnStyle(false)}
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={i} style={{ padding: '0 4px', color: '#6b7280' }}>...</span>
        ) : (
          <button key={p} onClick={() => onChange(p as number)} style={btnStyle(p === page)}>
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={btnStyle(false)}
      >
        ›
      </button>
    </div>
  );
};

const btnStyle = (active: boolean): React.CSSProperties => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  border: active ? 'none' : '1px solid #e5e7eb',
  background: active ? '#2563eb' : '#fff',
  color: active ? '#fff' : '#374151',
  fontWeight: active ? 700 : 400,
  cursor: 'pointer',
  fontSize: '14px',
});

export default Pagination;
