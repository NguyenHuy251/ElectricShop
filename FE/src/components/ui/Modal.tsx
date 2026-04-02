import React, { useEffect } from 'react';
import '../../assets/styles/components/ui-common.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="ui-modal-overlay" onClick={onClose}>
      <div className={`ui-modal-content ${size}`} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="ui-modal-head">
            <h3 className="ui-modal-title">{title}</h3>
            <button onClick={onClose} className="ui-modal-close">
              ✕
            </button>
          </div>
        )}
        <div className="ui-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
