import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bike } from 'lucide-react'
import { getOrder, updateOrderStatus, listDeliveryPartners, acceptDeliveryOrder } from '../../api/endpoints'
import StatusStepper from '../../components/StatusStepper.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import Button from '../../components/Button.jsx'
import Spinner from '../../components/Spinner.jsx'
import './OrderTracking.css'

const SEQUENCE = {
  PLACED: { to: 'PREPARING', delay: 4500 },
  PREPARING: { to: 'READY_FOR_PICKUP', delay: 6000 },
  READY_FOR_PICKUP: { to: 'PICKED_UP', delay: 5500, assignPartner: true },
  PICKED_UP: { to: 'ON_THE_WAY', delay: 4500 },
  ON_THE_WAY: { to: 'DELIVERED', delay: 6000 },
}

const STATUS_MESSAGES = {
  PLACED: 'Your order has been sent to the restaurant.',
  PREPARING: 'The kitchen is cooking up your order with care.',
  READY_FOR_PICKUP: 'Your order is packed and waiting for a delivery partner.',
  PICKED_UP: 'Your delivery partner has picked up your order.',
  ON_THE_WAY: 'Your order is on its way to you.',
  DELIVERED: 'Delivered! We hope you enjoy your meal.',
  REJECTED: 'This order was rejected by the restaurant.',
}

export default function OrderTracking() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const timerRef = useRef(null)
  const stoppedRef = useRef(false)

  useEffect(() => {
    stoppedRef.current = false

    async function tick() {
      if (stoppedRef.current) return
      let latest
      try {
        latest = await getOrder(orderId)
      } catch {
        return
      }
      if (stoppedRef.current) return
      setOrder(latest)

      if (latest.status === 'DELIVERED' || latest.status === 'REJECTED') return

      const step = SEQUENCE[latest.status]
      const delay = step ? step.delay : 3000

      timerRef.current = setTimeout(async () => {
        if (stoppedRef.current) return
        try {
          const current = await getOrder(orderId)
          if (step && current.status === latest.status) {
            if (step.assignPartner) {
              const partners = await listDeliveryPartners()
              const free = partners.find((p) => p.online && !p.activeOrderId) || partners[0]
              if (free) {
                try {
                  await acceptDeliveryOrder(free.id, orderId)
                } catch {
                  // already accepted elsewhere - fine, continue
                }
                await updateOrderStatus(orderId, step.to, free.id)
              }
            } else {
              await updateOrderStatus(orderId, step.to)
            }
          }
        } catch {
          // ignore transient errors, next tick will resync
        }
        tick()
      }, delay)
    }

    tick()

    return () => {
      stoppedRef.current = true
      clearTimeout(timerRef.current)
    }
  }, [orderId])

  if (!order) {
    return (
      <div className="tracking-loading">
        <Spinner size={40} />
      </div>
    )
  }

  return (
    <div className="fade-in-up tracking-page">
      <div className="user-page-header">
        <button className="user-page-header__back" onClick={() => navigate('/orders')}>
          <ArrowLeft size={17} />
        </button>
        <h1 className="user-page-header__title">Track Order</h1>
      </div>

      <div className="tracking-restaurant">
        <PhotoTile src={order.restaurantImageUrl} alt={order.restaurantName} width={56} height={56} radius={10} />
        <div>
          <div className="tracking-restaurant__name">{order.restaurantName}</div>
          <div className="tracking-restaurant__id">Order {order.id}</div>
        </div>
      </div>

      <div className="tracking-card">
        <StatusStepper status={order.status} />
        <p className="tracking-message">{STATUS_MESSAGES[order.status]}</p>
      </div>

      {order.deliveryPartnerName && order.status !== 'DELIVERED' && (
        <div className="tracking-partner">
          <span className="tracking-partner__avatar">
            <Bike size={20} />
          </span>
          <div>
            <div className="tracking-partner__name">{order.deliveryPartnerName}</div>
            <div className="tracking-partner__role">Your delivery partner</div>
          </div>
        </div>
      )}

      <div className="tracking-items">
        <h3 className="tracking-items__title">Order Summary</h3>
        {order.items.map((item) => (
          <div className="tracking-items__row" key={item.menuItemId}>
            <span>
              {item.quantity} × {item.name}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(0)}</span>
          </div>
        ))}
        <div className="tracking-items__row tracking-items__row--total">
          <span>Total Paid</span>
          <span>₹{order.totalAmount.toFixed(0)}</span>
        </div>
      </div>

      <Button variant="outline" fullWidth onClick={() => navigate('/orders')}>
        View All Orders
      </Button>
    </div>
  )
}
