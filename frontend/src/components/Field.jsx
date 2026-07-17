export function TextField({ label, className = '', ...rest }) {
  return (
    <label className={`ff-field ${className}`}>
      {label && <span className="ff-field__label">{label}</span>}
      <input className="ff-input" {...rest} />
    </label>
  )
}

export function TextArea({ label, className = '', ...rest }) {
  return (
    <label className={`ff-field ${className}`}>
      {label && <span className="ff-field__label">{label}</span>}
      <textarea className="ff-textarea" {...rest} />
    </label>
  )
}

export function SelectField({ label, className = '', children, ...rest }) {
  return (
    <label className={`ff-field ${className}`}>
      {label && <span className="ff-field__label">{label}</span>}
      <select className="ff-select" {...rest}>
        {children}
      </select>
    </label>
  )
}
