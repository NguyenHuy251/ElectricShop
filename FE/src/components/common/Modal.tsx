import React, { useEffect } from 'react';
import { COLORS } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, width = 560, footer }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClass = width <= 420 ? 'sm' : width <= 600 ? 'md' : 'lg';

  return (
    <div className="ui-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`ui-modal-shell ${sizeClass}`}>
        {/* Header */}
        <div className="ui-modal-head">
          <h3 className="ui-modal-title">{title}</h3>
          <button onClick={onClose} className="ui-modal-close">✕</button>
        </div>
        {/* Body */}
        <div className="ui-modal-body">{children}</div>
        {/* Footer */}
        {footer && (
          <div className="ui-modal-footer">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Modal;
