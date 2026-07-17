import { Link } from 'react-router-dom'
import { ChefHat, Bike, LayoutDashboard, ArrowLeft } from 'lucide-react'

const LINKS = [
  { to: '/partner/login', label: 'Restaurant Partner login', Icon: ChefHat },
  { to: '/rider/login', label: 'Delivery Partner login', Icon: Bike },
  { to: '/admin/login', label: 'Admin login', Icon: LayoutDashboard },
]

export default function DevSwitcher() {
  return (
    <div style={devStyles.page}>
      <div style={devStyles.card}>
        <Link to="/" style={devStyles.back}>
          <ArrowLeft size={13} />
          Back to customer app
        </Link>
        <h1 style={devStyles.title}>Dev role switcher</h1>
        <p style={devStyles.subtitle}>
          Internal convenience only — not part of the product. In a real deployment none of this would be linked from
          anywhere public.
        </p>
        <div style={devStyles.list}>
          {LINKS.map((link) => (
            <Link key={link.to} to={link.to} style={devStyles.link}>
              <link.Icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

const devStyles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f2f2f2',
    fontFamily: 'monospace',
  },
  card: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: 6,
    padding: 28,
    width: '100%',
    maxWidth: 360,
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    margin: '0 0 6px',
    color: '#333',
  },
  subtitle: {
    fontSize: 11.5,
    color: '#999',
    lineHeight: 1.5,
    margin: '0 0 18px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '9px 12px',
    borderRadius: 4,
    background: '#f7f7f7',
    color: '#333',
    fontSize: 12.5,
    border: '1px solid #eee',
  },
}
