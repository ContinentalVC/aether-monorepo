import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any; // Allow additional props
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    type = 'button',
    ...restProps 
  } = props || {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...restProps}
      style={{
        padding: size === 'small' ? '8px 16px' : size === 'large' ? '16px 32px' : '12px 24px',
        backgroundColor: variant === 'primary' ? '#007bff' : variant === 'secondary' ? '#6c757d' : 'transparent',
        color: variant === 'outline' ? '#007bff' : 'white',
        border: variant === 'outline' ? '1px solid #007bff' : 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...restProps.style, // Allow style overrides
      }}
    >
      {children}
    </button>
  );
}; 