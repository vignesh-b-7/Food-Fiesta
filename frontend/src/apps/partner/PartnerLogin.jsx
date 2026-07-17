import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ArrowLeft } from 'lucide-react'
import { getAdminRestaurants } from '../../api/endpoints'
import { useSession } from '../../context/SessionContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useManagedRestaurant } from './ManagedRestaurantContext.jsx'
import { TextField, SelectField } from '../../components/Field.jsx'
import Button from '../../components/Button.jsx'

export default function PartnerLogin() {
  const [restaurants, setRestaurants] = useState([])
  const [restaurantId, setRestaurantIdField] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { enterPortal } = useSession()
  const { setRestaurantId } = useManagedRestaurant()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getAdminRestaurants().then((list) => {
      setRestaurants(list)
      if (list.length) setRestaurantIdField(list[0].id)
    }).catch(() => setRestaurants([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const restaurant = restaurants.find((r) => r.id === restaurantId)
    setLoading(true)
    try {
      await enterPortal('RESTAURANT', restaurant ? `${restaurant.name} Team` : email.split('@')[0] || 'Restaurant Partner')
      setRestaurantId(restaurantId)
      navigate('/partner')
    } catch {
      showToast('Could not reach the Food Fiesta server. Is the backend running on :8080?', 'error', 4500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in-up">
        <a href="/" className="auth-card__back">
          <ArrowLeft size={13} />
          Back to Food Fiesta
        </a>
        <div className="auth-card__brand">
          <span className="auth-card__brand-icon">
            <ChefHat size={22} />
          </span>
          <span className="auth-card__brand-name">Partner Hub</span>
        </div>
        <h1 className="auth-card__title">Restaurant Partner Login</h1>
        <p className="auth-card__subtitle">Manage your orders, menu, and sales from one place.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <SelectField label="Restaurant" required value={restaurantId} onChange={(e) => setRestaurantIdField(e.target.value)}>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Email"
            type="email"
            required
            placeholder="owner@restaurant.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} className="auth-card__submit">
            Sign In
          </Button>
        </form>

        <p className="auth-card__footnote">Demo build — any email and password will sign you in.</p>
      </div>
    </div>
  )
}
