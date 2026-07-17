export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="ff-empty fade-in-up">
      {Icon && (
        <div className="ff-empty__glyph">
          <Icon size={40} strokeWidth={1.5} />
        </div>
      )}
      {title && <div className="ff-empty__title">{title}</div>}
      {subtitle && <div className="ff-empty__subtitle">{subtitle}</div>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  )
}
