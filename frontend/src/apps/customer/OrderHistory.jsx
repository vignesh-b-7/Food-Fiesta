import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { listOrders } from '../../api/endpoints'
import { useSession } from '../../context/SessionContext.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import Tag from '../../components/Tag.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './OrderHistory.css'

const STATUS_VARIANT = {
  PLACED: 'default',
  PREPARING: 'accent',
  READY_FOR_PICKUP: 'accent',
  PICKED_UP: 'accent',
  ON_THE_WAY: 'accent',
  DELIVERED: 'success',
  REJECTED: 'danger',
}

const STATUS_LABEL = {
  PLACED: 'Placed',
  PREPARING: 'Preparing',
  READY_FOR_PICKUP: 'Ready for Pickup',
  PICKED_UP: 'Picked Up',
  ON_THE_WAY: 'On the Way',
  DELIVERED: 'Delivered',
  REJECTED: 'Rejected',
}

export default function OrderHistory() {
  const { session } = useSession()
  const navigate = useNavigate()
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    listOrders({ userId: session.userId }).then(setOrders).catch(() => setOrders([]))
  }, [session.userId])

  return (
    <div className="fade-in-up">
      <div className="user-page-header">
        <h1 className="user-page-header__title">My Orders</h1>
      </div>

      {orders === null && (
        <div className="order-history-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="ff-skeleton" style={{ height: 100 }} />
          ))}
        </div>
      )}

      {orders !== null && orders.length === 0 && (
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          subtitle="Once you place an order this session, it'll show up here."
          action={
            <Button variant="primary" onClick={() => navigate('/')}>
              Browse Restaurants
            </Button>
          }
        />
      )}

      {orders !== null && orders.length > 0 && (
        <div className="order-history-list">
          {orders.map((order) => (
            <Card key={order.id} className="order-history-card">
              <PhotoTile src={order.restaurantImageUrl} alt={order.restaurantName} width={54} height={54} radius={10} />
              <div className="order-history-card__body">
                <div className="order-history-card__top">
                  <span className="order-history-card__name">{order.restaurantName}</span>
                  <Tag variant={STATUS_VARIANT[order.status] || 'default'}>{STATUS_LABEL[order.status] || order.status}</Tag>
                </div>
                <div className="order-history-card__meta">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} items · ₹{order.totalAmount.toFixed(0)} · {order.id}
                </div>
              </div>
              {order.status !== 'DELIVERED' && order.status !== 'REJECTED' ? (
                <Button size="sm" variant="primary" onClick={() => navigate(`/track/${order.id}`)}>
                  Track
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => navigate(`/confirmation/${order.id}`)}>
                  View
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
