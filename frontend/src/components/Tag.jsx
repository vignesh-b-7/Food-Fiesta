export default function Tag({ children, variant = 'default', icon, className = '' }) {
  const classes = ['ff-tag', `ff-tag--${variant}`, className].filter(Boolean).join(' ')
  return (
    <span className={classes}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  )
}
