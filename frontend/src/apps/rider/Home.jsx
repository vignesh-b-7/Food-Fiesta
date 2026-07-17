import { useCallback, useEffect, useState } from 'react'
import { Package, Moon, Star } from 'lucide-react'
import {
  getDeliveryPartner,
  setPartnerOnline,
  getAvailableOrders,
  acceptDeliveryOrder,
  getOrder,
  updateOrderStatus,
} from '../../api/endpoints'
import { useManagedPartner } from './ManagedPartnerContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import Switch from '../../components/Switch.jsx'
import Tag from '../../components/Tag.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './rider.css'

const NEXT_STATUS = {
  READY_FOR_PICKUP: { next: 'PICKED_UP', label: 'Mark Picked Up' },
  PICKED_UP: { next: 'ON_THE_WAY', label: 'Start Delivery (On the Way)' },
  ON_THE_WAY: { next: 'DELIVERED', label: 'Mark Delivered' },
}

export default function Home() {
  const { partnerId } = useManagedPartner()
  const { showToast } = useToast()
  const [partner, setPartner] = useState(null)
  const [activeOrder, setActiveOrder] = useState(null)
  const [available, setAvailable] = useState([])
  const [dismissed, setDismissed] = useState([])
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const p = await getDeliveryPartner(partnerId)
      setPartner(p)
      if (p.activeOrderId) {
        const order = await getOrder(p.activeOrderId)
        setActiveOrder(order)
      } else {
        setActiveOrder(null)
        if (p.online) {
          const orders = await getAvailableOrders()
          setAvailable(orders)
        } else {
          setAvailable([])
        }
      }
    } catch {
      // transient network hiccup, next poll will retry
    }
  }, [partnerId])

  useEffect(() => {
    load()
    const interval = setInterval(load, 4000)
    return () => clearInterval(interval)
  }, [load])

  const handleToggleOnline = async () => {
    try {
      await setPartnerOnline(partnerId, !partner.online)
      load()
    } catch {
      showToast('Could not update your status', 'error', 2200)
    }
  }

  const handleAccept = async (order) => {
    setBusy(true)
    try {
      await acceptDeliveryOrder(partnerId, order.id)
      showToast(`Accepted order ${order.id}`, 'success', 2000)
      load()
    } catch {
      showToast('This order was just taken by another partner', 'error', 2500)
      load()
    } finally {
      setBusy(false)
    }
  }

  const handleAdvance = async () => {
    const step = NEXT_STATUS[activeOrder.status]
    if (!step) return
    setBusy(true)
    try {
      const updated = await updateOrderStatus(activeOrder.id, step.next, partnerId)
      setActiveOrder(updated)
      if (step.next === 'DELIVERED') {
        showToast('Delivery completed — earnings updated!', 'success', 2500)
      }
      load()
    } catch {
      showToast('Could not update delivery status', 'error', 2200)
    } finally {
      setBusy(false)
    }
  }

  if (!partner) {
    return <div className="ff-skeleton" style={{ height: 200 }} />
  }

  const visibleRequests = available.filter((o) => !dismissed.includes(o.id))

  return (
    <div className="fade-in-up">
      <div className="dp-status-bar">
        <div className="dp-status-bar__left">
          <Switch on={partner.online} onToggle={handleToggleOnline} />
          <div>
            <div className="dp-status-bar__label">{partner.online ? "You're Online" : "You're Offline"}</div>
            <div className="dp-status-bar__hint">
              {partner.online ? 'Looking for delivery requests nearby' : 'Go online to start receiving requests'}
            </div>
          </div>
        </div>
        <Tag variant={partner.online ? 'success' : 'default'} icon={<Star size={11} fill="currentColor" />}>
          {partner.rating.toFixed(1)} · {partner.completedDeliveries} trips
        </Tag>
      </div>

      {activeOrder ? (
        <Card className="dp-active-card">
          <div className="dp-active-card__header">
            <div>
              <div className="dp-active-card__restaurant">{activeOrder.restaurantName}</div>
              <div className="dp-active-card__id">Order {activeOrder.id}</div>
            </div>
            <Tag variant="accent">₹{activeOrder.totalAmount.toFixed(0)}</Tag>
          </div>

          <div className="dp-route">
            <div className="dp-route__point">
              <span className="dp-route__dot dp-route__dot--pickup" />
              <div>
                <div className="dp-route__label">Pickup</div>
                <div className="dp-route__value">{activeOrder.restaurantName}</div>
              </div>
            </div>
            <div className="dp-route__line" style={{ marginLeft: 5 }} />
            <div className="dp-route__point">
              <span className="dp-route__dot dp-route__dot--drop" />
              <div>
                <div className="dp-route__label">Drop</div>
                <div className="dp-route__value">{activeOrder.deliveryAddress}</div>
              </div>
            </div>
          </div>

          {NEXT_STATUS[activeOrder.status] ? (
            <Button variant="primary" fullWidth loading={busy} onClick={handleAdvance}>
              {NEXT_STATUS[activeOrder.status].label}
            </Button>
          ) : (
            <Tag variant="success">Delivered</Tag>
          )}
        </Card>
      ) : partner.online ? (
        <>
          <h3 className="rd-section-title">Incoming Requests</h3>
          {visibleRequests.length === 0 && (
            <EmptyState icon={Package} title="No requests right now" subtitle="New delivery requests will appear here as soon as a restaurant packs an order." />
          )}
          {visibleRequests.map((order) => (
            <Card key={order.id} className="dp-request-card">
              <div className="dp-request-card__top">
                <span className="dp-request-card__restaurant">{order.restaurantName}</span>
                <Tag variant="accent">₹{order.totalAmount.toFixed(0)}</Tag>
              </div>
              <div className="dp-request-card__address">Deliver to: {order.deliveryAddress}</div>
              <div className="dp-request-card__actions">
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={() => setDismissed((prev) => [...prev, order.id])}
                >
                  Reject
                </Button>
                <Button variant="primary" size="sm" fullWidth loading={busy} onClick={() => handleAccept(order)}>
                  Accept
                </Button>
              </div>
            </Card>
          ))}
        </>
      ) : (
        <EmptyState icon={Moon} title="You're currently offline" subtitle="Flip the switch above when you're ready to start accepting deliveries." />
      )}
    </div>
  )
}
