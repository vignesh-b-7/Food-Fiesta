import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import { getOrder } from '../../api/endpoints'
import Button from '../../components/Button.jsx'
import Spinner from '../../components/Spinner.jsx'
import './Confirmation.css'

export default function Confirmation() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    getOrder(orderId).then(setOrder).catch(() => setOrder(false))
  }, [orderId])

  if (order === null) {
    return (
      <div className="confirmation-loading">
        <Spinner size={40} />
      </div>
    )
  }

  if (order === false) {
    return <div className="confirmation-loading">Order not found.</div>
  }

  return (
    <div className="confirmation-page fade-in-up">
      <div className="confirmation-badge">
        <PartyPopper size={48} strokeWidth={1.5} />
      </div>
      <h1 className="confirmation-title">Order Confirmed!</h1>
      <p className="confirmation-subtitle">
        {order.restaurantName} is getting your order ready. Estimated delivery in {order.estimatedDeliveryMinutes} minutes.
      </p>

      <div className="confirmation-card">
        <div className="confirmation-card__row">
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>
        <div className="confirmation-card__row">
          <span>Transaction ID</span>
          <strong>{order.transactionId}</strong>
        </div>
        <div className="confirmation-card__row">
          <span>Payment Method</span>
          <strong>{order.paymentMethod.replace(/_/g, ' ')}</strong>
        </div>
        <hr className="confirmation-card__divider" />
        {order.items.map((item) => (
          <div className="confirmation-card__row confirmation-card__row--item" key={item.menuItemId}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
        <hr className="confirmation-card__divider" />
        <div className="confirmation-card__row">
          <span>Item Total</span>
          <span>₹{order.itemsTotal.toFixed(0)}</span>
        </div>
        <div className="confirmation-card__row">
          <span>Delivery Fee</span>
          <span>₹{order.deliveryFee.toFixed(0)}</span>
        </div>
        <div className="confirmation-card__row">
          <span>Taxes</span>
          <span>₹{order.taxes.toFixed(0)}</span>
        </div>
        {order.discount > 0 && (
          <div className="confirmation-card__row confirmation-card__row--discount">
            <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
            <span>−₹{order.discount.toFixed(0)}</span>
          </div>
        )}
        <div className="confirmation-card__row confirmation-card__row--total">
          <span>Total Paid</span>
          <span>₹{order.totalAmount.toFixed(0)}</span>
        </div>
      </div>

      <div className="confirmation-actions">
        <Button variant="outline" onClick={() => navigate('/')}>
          Back to Home
        </Button>
        <Button variant="primary" onClick={() => navigate(`/track/${order.id}`)}>
          Track Order
        </Button>
      </div>
    </div>
  )
}
