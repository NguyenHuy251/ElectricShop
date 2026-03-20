import React from 'react';
import { COLORS } from '../../constants';

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

  const btn = (active: boolean, disabled: boolean): React.CSSProperties => ({
    padding: '6px 12px', borderRadius: 6, border: `1px solid ${active ? COLORS.primary : COLORS.border}`,
    background: active ? COLORS.primary : COLORS.surface, color: active ? '#fff' : COLORS.text,
    cursor: disabled ? 'default' : 'pointer', fontWeight: active ? 600 : 400,
    opacity: disabled ? 0.4 : 1, minWidth: 36, textAlign: 'center',
  });

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
      <button style={btn(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dot-${i}`} style={{ padding: '6px 4px', color: COLORS.textLight }}>…</span>
        ) : (
          <button key={p} style={btn(p === page, false)} onClick={() => onChange(p as number)}>{p}</button>
        )
      )}
      <button style={btn(false, page === totalPages)} disabled={page === totalPages} onClick={() => onChange(page + 1)}>›</button>
    </div>
  );
};

export default Pagination;
