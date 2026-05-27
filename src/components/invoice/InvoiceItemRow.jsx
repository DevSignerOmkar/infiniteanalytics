import { memo } from 'react';
import Icon from '../ui/Icon';
import { formatCurrency } from '../../utils/helpers';

const InvoiceItemRow = memo(({ item, index, onChange, onRemove, isRemovable }) => {
  const total = (item.quantity * item.rate).toFixed(2);

  return (
    <div className="line-item-row grid grid-cols-1 md:grid-cols-12 gap-md items-center group bg-surface-bright/50 p-md rounded-lg border border-transparent hover:border-outline-variant/20 transition-all">
      <div className="col-span-6">
        <input
          className="w-full bg-transparent border-none p-0 text-body-md focus:ring-0 font-medium outline-none"
          placeholder="Item name"
          value={item.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
        />
      </div>
      <div className="col-span-2 flex justify-center">
        <input
          className="w-16 bg-surface-container border border-outline-variant rounded-md px-sm py-xs text-center text-body-md outline-none focus:border-primary transition-colors"
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onChange(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
        />
      </div>
      <div className="col-span-2">
        <div className="flex items-center gap-xs justify-end">
          <span className="text-outline">₹</span>
          <input
            className="w-24 bg-transparent border-none p-0 text-right text-body-md focus:ring-0 outline-none"
            type="number"
            min="0"
            step="0.01"
            value={item.rate}
            onChange={(e) => onChange(index, 'rate', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="col-span-2 text-right font-semibold text-on-surface flex items-center justify-end gap-sm">
        {formatCurrency(total)}
        {isRemovable && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="delete-btn opacity-0 text-error hover:bg-error-container/20 p-1 rounded transition-opacity"
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>
    </div>
  );
});

InvoiceItemRow.displayName = 'InvoiceItemRow';
export default InvoiceItemRow;
