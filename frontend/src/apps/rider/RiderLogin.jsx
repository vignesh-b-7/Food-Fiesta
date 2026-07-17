import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bike, ArrowLeft } from 'lucide-react'
import { listDeliveryPartners } from '../../api/endpoints'
import { useSession } from '../../context/SessionContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useManagedPartner } from './ManagedPartnerContext.jsx'
import { TextField, SelectField } from '../../components/Field.jsx'
import Button from '../../components/Button.jsx'

export default function RiderLogin() {
  const [partners, setPartners] = useState([])
  const [partnerId, setPartnerIdField] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { enterPortal } = useSession()
  const { setPartnerId } = useManagedPartner()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    listDeliveryPartners().then((list) => {
      setPartners(list)
      if (list.length) setPartnerIdField(list[0].id)
    }).catch(() => setPartners([]))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const partner = partners.find((p) => p.id === partnerId)
    setLoading(true)
    try {
      await enterPortal('DELIVERY', partner ? partner.name : 'Delivery Partner')
      setPartnerId(partnerId)
      navigate('/rider')
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
            <Bike size={22} />
          </span>
          <span className="auth-card__brand-name">Rider Hub</span>
        </div>
        <h1 className="auth-card__title">Delivery Partner Login</h1>
        <p className="auth-card__subtitle">Go online, accept deliveries, and track your earnings.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <SelectField label="Rider Profile" required value={partnerId} onChange={(e) => setPartnerIdField(e.target.value)}>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.vehicle}
              </option>
            ))}
          </SelectField>
          <TextField
            label="Phone Number"
            type="tel"
            required
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

        <p className="auth-card__footnote">Demo build — any phone number and password will sign you in.</p>
      </div>
    </div>
  )
}
