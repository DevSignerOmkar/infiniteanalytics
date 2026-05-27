import Button from './Button';
import Icon from './Icon';

const EmptyState = ({ title, description, actionLabel, onAction, icon }) => (
  <div className="text-center py-16 px-4">
    <div className="mx-auto w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
      <Icon name={icon || 'inbox'} className="text-outline" size={32} />
    </div>
    <h3 className="text-headline-sm font-bold text-on-surface mb-1">{title}</h3>
    <p className="text-body-sm text-on-surface-variant mb-6 max-w-sm mx-auto">{description}</p>
    {actionLabel && onAction && (
      <Button onClick={onAction}>{actionLabel}</Button>
    )}
  </div>
);

export default EmptyState;
