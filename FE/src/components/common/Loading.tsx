import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, text = 'Đang tải...' }) => {
  return (
    <div className={`common-loading ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="common-loading-spinner" />
      <p className="common-loading-text">{text}</p>
    </div>
  );
};

export default Loading;
