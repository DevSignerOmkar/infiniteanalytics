import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
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

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-2xl transform transition-all`}>
        <div className="flex items-center justify-between px-xl py-lg border-b border-outline-variant">
          <h2 className="text-headline-md font-bold text-on-surface">{title}</h2>
          <button onClick={onClose} className="p-sm text-on-surface-variant hover:bg-surface-container-high rounded-full transition-all">
            <Icon name="close" />
          </button>
        </div>
        <div className="px-xl py-lg">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
