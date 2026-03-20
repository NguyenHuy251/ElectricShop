import React from 'react';
import { COLORS } from '../../constants';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text = 'Đang tải...' }) => {
  const wrapper: React.CSSProperties = fullScreen
    ? { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(255,255,255,0.85)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }
    : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 };

  return (
    <div style={wrapper}>
      <div style={{
        width: 44, height: 44,
        border: `4px solid ${COLORS.border}`,
        borderTop: `4px solid ${COLORS.primary}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ marginTop: 12, color: COLORS.textSecondary, fontSize: 14 }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loading;
