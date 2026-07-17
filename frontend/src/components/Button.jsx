export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'ff-btn',
    `ff-btn--${variant}`,
    `ff-btn--${size}`,
    fullWidth ? 'ff-btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading && <span className="ff-btn__spinner" />}
      {children}
    </button>
  )
}
