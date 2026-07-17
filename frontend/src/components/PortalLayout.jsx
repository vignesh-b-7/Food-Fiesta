import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useSession } from '../context/SessionContext.jsx'
import Button from './Button.jsx'
import './PortalLayout.css'

export default function PortalLayout({ icon: Icon, title, navItems, rightSlot, loginPath, children }) {
  const { session, exitPortal } = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    exitPortal()
    navigate(loginPath)
  }

  return (
    <div className="portal-layout">
      <header className="portal-header">
        <div className="portal-header__brand">
          {Icon && <Icon size={26} className="portal-header__icon" />}
          <div>
            <div className="portal-header__title">{title}</div>
            <div className="portal-header__user">{session?.name}</div>
          </div>
        </div>

        <nav className="portal-header__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `portal-header__link ${isActive ? 'portal-header__link--active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="portal-header__actions">
          {rightSlot}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={15} style={{ marginRight: 4 }} />
            Log Out
          </Button>
        </div>
      </header>

      <main className="portal-main">{children}</main>
    </div>
  )
}
