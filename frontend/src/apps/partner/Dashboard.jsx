import { useCallback, useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { getRestaurantOrders, updateOrderStatus } from '../../api/endpoints'
import { useManagedRestaurant } from './ManagedRestaurantContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Tag from '../../components/Tag.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './partner.css'

const STATUS_INFO = {
  PLACED: { label: 'New Order', variant: 'accent' },
  PREPARING: { label: 'Preparing', variant: 'accent' },
  READY_FOR_PICKUP: { label: 'Waiting for Rider', variant: 'default' },
  PICKED_UP: { label: 'Picked Up', variant: 'default' },
  ON_THE_WAY: { label: 'Out for Delivery', variant: 'default' },
  DELIVERED: { label: 'Delivered', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
}

const ACTIVE_STATUSES = ['PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'ON_THE_WAY']

export default function Dashboard() {
  const { restaurantId } = useManagedRestaurant()
  const { showToast } = useToast()
  const [orders, setOrders] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    getRestaurantOrders(restaurantId)
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [restaurantId])

  useEffect(() => {
    load()
    const interval = setInterval(load, 5000)
    return () => clearInterval(interval)
  }, [load])

  const act = async (order, status, successMessage) => {
    setBusyId(order.id)
    try {
      await updateOrderStatus(order.id, status)
      showToast(successMessage, 'success', 2000)
      load()
    } catch {
      showToast('Could not update the order. Please try again.', 'error', 2500)
    } finally {
      setBusyId(null)
    }
  }

  if (orders === null) {
    return (
      <div className="rd-order-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="ff-skeleton" style={{ height: 180 }} />
        ))}
      </div>
    )
  }

  const active = orders.filter((o) => ACTIVE_STATUSES.includes(o.status))
  const completed = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status)).slice(0, 8)

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Today's Orders</h1>

      {active.length === 0 && (
        <EmptyState icon={ClipboardList} title="No active orders" subtitle="New orders from diners will show up here in real time." />
      )}

      <div className="rd-order-grid">
        {active.map((order) => {
          const info = STATUS_INFO[order.status]
          return (
            <Card key={order.id} className="rd-order-card">
              <div className="rd-order-card__header">
                <div>
                  <div className="rd-order-card__id">{order.id}</div>
                  <div className="rd-order-card__customer">{order.userName}</div>
                </div>
                <Tag variant={info.variant}>{info.label}</Tag>
              </div>

              <div className="rd-order-card__items">
                {order.items.map((item) => (
                  <span key={item.menuItemId}>
                    {item.quantity} × {item.name}
                  </span>
                ))}
              </div>

              <div className="rd-order-card__total">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(0)}</span>
              </div>

              {order.status === 'PLACED' && (
                <div className="rd-order-card__actions">
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    loading={busyId === order.id}
                    onClick={() => act(order, 'REJECTED', `Order ${order.id} rejected`)}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    loading={busyId === order.id}
                    onClick={() => act(order, 'PREPARING', `Order ${order.id} accepted`)}
                  >
                    Accept
                  </Button>
                </div>
              )}

              {order.status === 'PREPARING' && (
                <Button
                  variant="secondary"
                  size="sm"
                  fullWidth
                  loading={busyId === order.id}
                  onClick={() => act(order, 'READY_FOR_PICKUP', `Order ${order.id} marked ready for pickup`)}
                >
                  Mark Ready for Pickup
                </Button>
              )}

              {order.status === 'READY_FOR_PICKUP' && (
                <p className="rd-order-card__customer">Waiting for a delivery partner to accept this order…</p>
              )}

              {(order.status === 'PICKED_UP' || order.status === 'ON_THE_WAY') && (
                <p className="rd-order-card__customer">
                  {order.deliveryPartnerName ? `${order.deliveryPartnerName} is delivering this order.` : 'Out for delivery.'}
                </p>
              )}
            </Card>
          )
        })}
      </div>

      {completed.length > 0 && (
        <>
          <h2 className="rd-section-title">Recent Activity</h2>
          <div className="rd-order-grid">
            {completed.map((order) => {
              const info = STATUS_INFO[order.status]
              return (
                <Card key={order.id} className="rd-order-card">
                  <div className="rd-order-card__header">
                    <div>
                      <div className="rd-order-card__id">{order.id}</div>
                      <div className="rd-order-card__customer">{order.userName}</div>
                    </div>
                    <Tag variant={info.variant}>{info.label}</Tag>
                  </div>
                  <div className="rd-order-card__total">
                    <span>Total</span>
                    <span>₹{order.totalAmount.toFixed(0)}</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
