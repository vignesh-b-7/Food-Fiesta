import { useEffect, useState } from 'react'
import { Receipt, Users, Wallet, UtensilsCrossed, Bike, Ticket } from 'lucide-react'
import { getAdminStats } from '../../api/endpoints'
import Card from '../../components/Card.jsx'
import './admin.css'

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today']

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    getAdminStats().then(setStats).catch(() => setStats(null))
  }, [])

  if (!stats) {
    return <div className="ff-skeleton" style={{ height: 400 }} />
  }

  const maxTrend = Math.max(...stats.weeklyOrderTrend, 1)

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Platform Overview</h1>

      <div className="admin-stats-grid">
        <Card className="admin-stat-card">
          <Receipt size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">{stats.totalOrders}</span>
          <span className="admin-stat-card__label">Total Orders</span>
        </Card>
        <Card className="admin-stat-card">
          <Users size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">{stats.activeUsers}</span>
          <span className="admin-stat-card__label">Active Users</span>
        </Card>
        <Card className="admin-stat-card">
          <Wallet size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">₹{stats.totalRevenue.toFixed(0)}</span>
          <span className="admin-stat-card__label">Revenue (Delivered)</span>
        </Card>
        <Card className="admin-stat-card">
          <UtensilsCrossed size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">{stats.activeRestaurants}</span>
          <span className="admin-stat-card__label">Active Restaurants</span>
        </Card>
        <Card className="admin-stat-card">
          <Bike size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">{stats.onlineDeliveryPartners}</span>
          <span className="admin-stat-card__label">Riders Online</span>
        </Card>
        <Card className="admin-stat-card">
          <Ticket size={20} className="admin-stat-card__icon" />
          <span className="admin-stat-card__value">{stats.pendingComplaints}</span>
          <span className="admin-stat-card__label">Open Complaints</span>
        </Card>
      </div>

      <Card className="admin-panel">
        <h3 className="admin-panel__title">Top Restaurants by Revenue</h3>
        {stats.topRestaurants.map((r) => (
          <div className="admin-top-row" key={r.id}>
            <span className="admin-top-row__name">{r.name}</span>
            <span className="admin-top-row__meta">
              {r.orders} orders · ₹{r.revenue.toFixed(0)}
            </span>
          </div>
        ))}
      </Card>

      <Card className="admin-panel">
        <h3 className="admin-panel__title">Orders Trend (7 days)</h3>
        <div className="rd-chart">
          {stats.weeklyOrderTrend.map((value, i) => (
            <div className="rd-chart__bar-wrap" key={i}>
              <div className="rd-chart__bar" style={{ height: `${Math.max(6, (value / maxTrend) * 100)}%` }} title={`${value} orders`} />
              <div className="rd-chart__label">{DAY_LABELS[i]}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
