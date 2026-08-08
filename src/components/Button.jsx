import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim()
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
