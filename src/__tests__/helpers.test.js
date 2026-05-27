import {
  calculateItemTotal,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  isOverdue,
  getDaysOverdue,
  formatCurrency,
  formatDate,
} from '../utils/helpers';

describe('Invoice Calculations', () => {
  test('calculateItemTotal multiplies quantity by rate', () => {
    expect(calculateItemTotal(3, 100)).toBe(300);
    expect(calculateItemTotal(0, 100)).toBe(0);
    expect(calculateItemTotal(1, 99.99)).toBe(99.99);
  });

  test('calculateSubtotal sums item totals', () => {
    const items = [
      { quantity: 2, rate: 100 },
      { quantity: 3, rate: 50 },
    ];
    expect(calculateSubtotal(items)).toBe(350);
  });

  test('calculateTax applies percentage correctly', () => {
    expect(calculateTax(1000, 10)).toBe(100);
    expect(calculateTax(1000, 0)).toBe(0);
    expect(calculateTax(250, 8.5)).toBe(21.25);
  });

  test('calculateTotal adds subtotal and tax', () => {
    expect(calculateTotal(1000, 100)).toBe(1100);
    expect(calculateTotal(0, 0)).toBe(0);
  });
});

describe('Invoice Filtering', () => {
  test('isOverdue returns true for past due dates with non-paid status', () => {
    expect(isOverdue('2020-01-01', 'pending')).toBe(true);
    expect(isOverdue('2020-01-01', 'overdue')).toBe(true);
  });

  test('isOverdue returns false for paid invoices regardless of date', () => {
    expect(isOverdue('2020-01-01', 'paid')).toBe(false);
  });

  test('isOverdue returns false for future dates', () => {
    expect(isOverdue('2099-12-31', 'pending')).toBe(false);
  });
});

describe('Late Invoice Detection', () => {
  test('getDaysOverdue returns positive number for past dates', () => {
    const days = getDaysOverdue('2020-01-01');
    expect(days).toBeGreaterThan(0);
  });

  test('getDaysOverdue returns 0 for future dates', () => {
    expect(getDaysOverdue('2099-12-31')).toBe(0);
  });
});

describe('Form Validation', () => {
  test('calculateItemTotal handles zero values', () => {
    expect(calculateItemTotal(0, 0)).toBe(0);
  });

  test('calculateSubtotal handles empty items array', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('Utility Functions', () => {
  test('formatCurrency formats INR correctly', () => {
    expect(formatCurrency(1000)).toBe('₹1,000.00');
    expect(formatCurrency(0)).toBe('₹0.00');
    expect(formatCurrency(99.5)).toBe('₹99.50');
  });

  test('formatDate formats date strings', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});
