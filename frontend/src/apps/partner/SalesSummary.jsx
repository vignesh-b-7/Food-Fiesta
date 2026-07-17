import { useEffect, useState } from 'react'
import { getSalesSummary } from '../../api/endpoints'
import { useManagedRestaurant } from './ManagedRestaurantContext.jsx'
import Card from '../../components/Card.jsx'
import './partner.css'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SalesSummary() {
  const { restaurantId } = useManagedRestaurant()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    getSalesSummary(restaurantId)
      .then(setSummary)
      .catch(() => setSummary(null))
  }, [restaurantId])

  if (!summary) {
    return <div className="ff-skeleton" style={{ height: 300 }} />
  }

  const maxValue = Math.max(...summary.last7DaysRevenue, 1)

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Sales Summary</h1>

      <div className="rd-stats-grid">
        <Card className="rd-stat-card">
          <div className="rd-stat-card__value">{summary.totalOrders}</div>
          <div className="rd-stat-card__label">Total Orders</div>
        </Card>
        <Card className="rd-stat-card">
          <div className="rd-stat-card__value">₹{summary.totalRevenue.toFixed(0)}</div>
          <div className="rd-stat-card__label">Revenue (Delivered)</div>
        </Card>
        <Card className="rd-stat-card">
          <div className="rd-stat-card__value">₹{summary.avgOrderValue.toFixed(0)}</div>
          <div className="rd-stat-card__label">Avg Order Value</div>
        </Card>
        <Card className="rd-stat-card">
          <div className="rd-stat-card__value">{summary.ordersByStatus.DELIVERED || 0}</div>
          <div className="rd-stat-card__label">Completed</div>
        </Card>
      </div>

      <Card>
        <div style={{ padding: '20px 20px 0', fontWeight: 600, fontSize: 15 }}>Last 7 Days Revenue</div>
        <div className="rd-chart">
          {summary.last7DaysRevenue.map((value, i) => (
            <div className="rd-chart__bar-wrap" key={i}>
              <div className="rd-chart__bar" style={{ height: `${Math.max(6, (value / maxValue) * 100)}%` }} title={`₹${value}`} />
              <div className="rd-chart__label">{DAY_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
