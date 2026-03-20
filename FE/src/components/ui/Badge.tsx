import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = '#fff', bg = '#2563eb' }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 600,
      color,
      background: bg,
    }}
  >
    {children}
  </span>
);

export default Badge;
