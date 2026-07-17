import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getAdminRestaurants, setRestaurantStatus } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import Tag from '../../components/Tag.jsx'
import Switch from '../../components/Switch.jsx'
import './admin.css'

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(null)
  const { showToast } = useToast()

  const load = () => getAdminRestaurants().then(setRestaurants).catch(() => setRestaurants([]))

  useEffect(() => {
    load()
  }, [])

  const handleToggle = async (restaurant) => {
    const nextStatus = restaurant.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    setRestaurants((prev) => prev.map((r) => (r.id === restaurant.id ? { ...r, status: nextStatus } : r)))
    try {
      await setRestaurantStatus(restaurant.id, nextStatus)
      showToast(`${restaurant.name} ${nextStatus === 'ACTIVE' ? 'approved' : 'suspended'}`, nextStatus === 'ACTIVE' ? 'success' : 'info', 2200)
    } catch {
      showToast('Could not update restaurant status', 'error', 2500)
      load()
    }
  }

  if (!restaurants) {
    return <div className="ff-skeleton" style={{ height: 400 }} />
  }

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Restaurants</h1>
      <Card>
        {restaurants.map((r) => (
          <div className="admin-table-row" key={r.id}>
            <PhotoTile src={r.imageUrl} alt={r.name} width={44} height={44} radius={8} />
            <div className="admin-table-row__main">
              <div className="admin-table-row__title">{r.name}</div>
              <div className="admin-table-row__subtitle">
                {r.cuisine} · <Star size={11} fill="currentColor" style={{ verticalAlign: -1 }} /> {r.rating.toFixed(1)} · {r.address}
              </div>
            </div>
            <Tag variant={r.status === 'ACTIVE' ? 'success' : 'danger'}>{r.status === 'ACTIVE' ? 'Active' : 'Suspended'}</Tag>
            <Switch on={r.status === 'ACTIVE'} onToggle={() => handleToggle(r)} />
          </div>
        ))}
      </Card>
    </div>
  )
}
