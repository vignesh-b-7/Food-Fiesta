import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeft } from 'lucide-react'
import { useSession } from '../../context/SessionContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { TextField } from '../../components/Field.jsx'
import Button from '../../components/Button.jsx'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { enterPortal } = useSession()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await enterPortal('ADMIN', email.split('@')[0] || 'Admin')
      navigate('/admin')
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
            <LayoutDashboard size={22} />
          </span>
          <span className="auth-card__brand-name">Admin Console</span>
        </div>
        <h1 className="auth-card__title">Admin Sign In</h1>
        <p className="auth-card__subtitle">Restricted access — platform operations only.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            required
            placeholder="admin@foodfiesta.com"
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
