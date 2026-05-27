import { forwardRef } from 'react';

const Select = forwardRef(({
  label, error, options = [], className = '', id, placeholder = 'Select...', ...props
}, ref) => (
  <div className="space-y-1">
    {label && (
      <label htmlFor={id} className="block text-label-md text-on-surface mb-sm">{label}</label>
    )}
    <select
      ref={ref}
      id={id}
      className={`w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-error mt-1">{error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
