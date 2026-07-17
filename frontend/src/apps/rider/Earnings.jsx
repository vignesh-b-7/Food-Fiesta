import { useEffect, useState } from 'react'
import { getDeliveryPartner } from '../../api/endpoints'
import { useManagedPartner } from './ManagedPartnerContext.jsx'
import Card from '../../components/Card.jsx'
import './rider.css'

export default function Earnings() {
  const { partnerId } = useManagedPartner()
  const [partner, setPartner] = useState(null)

  useEffect(() => {
    getDeliveryPartner(partnerId).then(setPartner).catch(() => setPartner(null))
  }, [partnerId])

  if (!partner) {
    return <div className="ff-skeleton" style={{ height: 260 }} />
  }

  const total = partner.baseEarnings + partner.incentiveEarnings + partner.tipEarnings

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Earnings</h1>

      <div className="dp-earnings-hero">
        <div className="dp-earnings-hero__value">₹{total.toFixed(0)}</div>
        <div className="dp-earnings-hero__label">Total earnings this session · {partner.completedDeliveries} deliveries completed</div>
      </div>

      <div className="dp-earnings-grid">
        <Card className="dp-earnings-card">
          <div className="dp-earnings-card__value">₹{partner.baseEarnings.toFixed(0)}</div>
          <div className="dp-earnings-card__label">Base Pay</div>
        </Card>
        <Card className="dp-earnings-card">
          <div className="dp-earnings-card__value">₹{partner.incentiveEarnings.toFixed(0)}</div>
          <div className="dp-earnings-card__label">Incentives</div>
        </Card>
        <Card className="dp-earnings-card">
          <div className="dp-earnings-card__value">₹{partner.tipEarnings.toFixed(0)}</div>
          <div className="dp-earnings-card__label">Customer Tips</div>
        </Card>
        <Card className="dp-earnings-card">
          <div className="dp-earnings-card__value">{partner.completedDeliveries}</div>
          <div className="dp-earnings-card__label">Completed Deliveries</div>
        </Card>
      </div>
    </div>
  )
}
