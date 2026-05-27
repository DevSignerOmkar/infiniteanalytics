import { forwardRef } from 'react';

const Input = forwardRef(({
  label, error, className = '', id, ...props
}, ref) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={id} className="block text-label-md text-on-surface font-bold mb-sm">{label}</label>
    )}
    <input
      ref={ref}
      id={id}
      className={`w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
        error ? 'border-error focus:border-error focus:ring-error/20' : ''
      } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-error mt-1">{error}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
