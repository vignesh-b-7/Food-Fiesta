import { ClipboardList, ChefHat, PackageCheck, Bike, PartyPopper, Check, X } from 'lucide-react'

const STEPS = [
  { key: 'PLACED', label: 'Placed', Icon: ClipboardList },
  { key: 'PREPARING', label: 'Preparing', Icon: ChefHat },
  { key: 'PICKED_UP', label: 'Picked Up', Icon: PackageCheck },
  { key: 'ON_THE_WAY', label: 'On the Way', Icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', Icon: PartyPopper },
]

// READY_FOR_PICKUP is an internal restaurant-side state that visually still
// reads as "Preparing" to the diner watching the tracker.
const STATUS_TO_INDEX = {
  PLACED: 0,
  PREPARING: 1,
  READY_FOR_PICKUP: 1,
  PICKED_UP: 2,
  ON_THE_WAY: 3,
  DELIVERED: 4,
}

export default function StatusStepper({ status }) {
  if (status === 'REJECTED') {
    return (
      <div className="ff-stepper">
        <div className="ff-stepper__step ff-stepper__step--rejected">
          <div className="ff-stepper__dot" style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff' }}>
            <X size={16} strokeWidth={2.5} />
          </div>
          <div className="ff-stepper__label">Order Rejected</div>
        </div>
      </div>
    )
  }

  const activeIndex = STATUS_TO_INDEX[status] ?? 0

  return (
    <div className="ff-stepper">
      {STEPS.map((step, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : ''
        const StepIcon = step.Icon
        return (
          <div key={step.key} className={`ff-stepper__step ${state ? `ff-stepper__step--${state}` : ''}`}>
            <div className="ff-stepper__line" />
            <div className="ff-stepper__dot">
              {index < activeIndex ? <Check size={16} strokeWidth={2.5} /> : <StepIcon size={16} strokeWidth={2} />}
            </div>
            <div className="ff-stepper__label">{step.label}</div>
          </div>
        )
      })}
    </div>
  )
}

export { STATUS_TO_INDEX }
