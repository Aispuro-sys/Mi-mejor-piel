import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  icon, 
  onClick, 
  href,
  className = '',
  ...props 
}) {
  const classes = `btn btn-${variant} ${className}`.trim();
  
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </a>
    );
  }
  
  return (
    <button type="button" className={classes} onClick={onClick} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
}
