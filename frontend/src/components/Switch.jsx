export default function Switch({ on, onToggle, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      className={`ff-switch ${on ? 'ff-switch--on' : ''}`}
      onClick={onToggle}
    >
      <span className="ff-switch__knob" />
    </button>
  )
}
