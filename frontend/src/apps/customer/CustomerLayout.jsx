import { Link, NavLink } from 'react-router-dom'
import { UtensilsCrossed, ShoppingCart, MoreHorizontal } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import MarqueeBanner from './MarqueeBanner.jsx'
import './customer.css'

export default function CustomerLayout({ children }) {
  const { itemCount } = useCart()

  return (
    <div className="customer-layout">
      <div className="customer-navbar-wrap">
        <MarqueeBanner />
        <header className="customer-header">
          <Link to="/" className="customer-header__brand">
            <UtensilsCrossed size={24} />
            <span>Food Fiesta</span>
          </Link>

          <nav className="customer-header__nav">
            <NavLink to="/" end className={({ isActive }) => `customer-header__link ${isActive ? 'customer-header__link--active' : ''}`}>
              Browse
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `customer-header__link ${isActive ? 'customer-header__link--active' : ''}`}>
              My Orders
            </NavLink>
          </nav>

          <Link to="/cart" className="customer-header__cart">
            <ShoppingCart size={18} />
            {itemCount > 0 && <span className="customer-header__cart-badge">{itemCount}</span>}
          </Link>
        </header>
      </div>

      <main className="customer-main">{children}</main>

      <div className="customer-footer-section">
        <MarqueeBanner />
        <footer className="customer-footer">
          <span>© {new Date().getFullYear()} Food Fiesta — prototype build</span>
          <Link to="/dev" className="customer-footer__dev-link">
            <MoreHorizontal size={13} />
            switch role (dev)
          </Link>
        </footer>
      </div>
    </div>
  )
}
