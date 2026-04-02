import React from 'react';
import '../../assets/styles/components/ui-common.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  style,
  className,
  ...rest
}) => {
  return (
    <button
      className={[
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        fullWidth ? 'full-width' : '',
        loading ? 'loading' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="ui-button-loading">⏳</span> : children}
    </button>
  );
};

export default Button;
