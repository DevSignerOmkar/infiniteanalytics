import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary text-on-primary hover:opacity-90 shadow-lg shadow-primary/20',
  secondary: 'bg-white border border-outline-variant text-on-surface hover:bg-surface-container-low',
  danger: 'bg-error-container/20 text-error hover:bg-error-container/40',
  ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-low',
  success: 'bg-primary-container text-on-primary-container hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-label-md',
  md: 'px-md py-sm text-label-md',
  lg: 'px-lg py-md text-body-md',
};

const Button = forwardRef(({
  children, variant = 'primary', size = 'md', className = '', disabled = false, loading = false, ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading && (
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    )}
    {children}
  </button>
));

Button.displayName = 'Button';
export default Button;
