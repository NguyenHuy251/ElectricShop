import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}

const resolveBadgeClass = (color: string, bg: string): string => {
  if (color === '#059669' && bg === '#ecfdf5') return 'ui-badge--status-ok';
  if (color === '#dc2626' && bg === '#fef2f2') return 'ui-badge--status-off';
  if (color === '#1d4ed8' && bg === '#eff6ff') return 'ui-badge--role-employee';
  if (color === '#dc2626' && bg === '#fef2f2') return 'ui-badge--role-admin';
  if (color === '#059669' && bg === '#ecfdf5') return 'ui-badge--role-user';
  return 'ui-badge--default';
};

const Badge: React.FC<BadgeProps> = ({ children, color = '#fff', bg = '#2563eb' }) => (
  <span className={`ui-badge ${resolveBadgeClass(color, bg)}`}>
    {children}
  </span>
);

export default Badge;
