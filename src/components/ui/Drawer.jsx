import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const Drawer = ({ isOpen, onClose, title, children }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 overlay-fade flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl drawer-transition flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-xl py-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
          <div>
            <h3 className="text-headline-md font-bold text-primary">{title}</h3>
          </div>
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-xl py-lg space-y-xl">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Drawer;
