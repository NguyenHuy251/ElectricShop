import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, error, leftIcon, style, ...rest }) => {
  return (
    <div className="ui-input-wrap">
      {label && (
        <label className="ui-input-label">{label}</label>
      )}
      <div className="ui-input-box">
        {leftIcon && (
          <span className="ui-input-icon">
            {leftIcon}
          </span>
        )}
        <input
          className={`ui-input-field ${leftIcon ? 'with-icon' : ''} ${error ? 'error' : ''}`}
          style={style}
          onFocus={(e) => {
            e.target.style.borderColor = '#2563eb';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
          }}
          {...rest}
        />
      </div>
      {error && <span className="ui-input-error">{error}</span>}
    </div>
  );
};

export default Input;
