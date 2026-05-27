const Card = ({ children, className = '', padding = true, ...props }) => (
  <div
    className={`bg-white rounded-xl border border-outline-variant/30 custom-shadow ${padding ? 'p-lg' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
