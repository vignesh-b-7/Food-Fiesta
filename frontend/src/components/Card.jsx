export default function Card({ children, hoverable = false, className = '', style, onClick }) {
  const classes = ['ff-card', hoverable ? 'ff-card--hoverable' : '', className].filter(Boolean).join(' ')
  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  )
}
