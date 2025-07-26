import React from 'react';
import './index.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default React.forwardRef<HTMLButtonElement, ButtonProps>(
  function AnimationButton({ children, className, ...props }, ref) {
    return (
      <div className="button-container">
        <button
          ref={ref}
          className={`animation-button btn btn-white btn-animated ${className || ''}`}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);
