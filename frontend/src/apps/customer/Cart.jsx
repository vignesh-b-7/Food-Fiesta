import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './Cart.css'

const DELIVERY_FEE = 30
const TAX_RATE = 0.05

export default function Cart() {
  const { cart, updateQuantity, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        subtitle="Browse our restaurants and add a few dishes to get started."
        action={
          <Button variant="primary" onClick={() => navigate('/')}>
            Browse Restaurants
          </Button>
        }
      />
    )
  }

  const taxes = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + DELIVERY_FEE + taxes) * 100) / 100

  return (
    <div className="fade-in-up">
      <div className="user-page-header">
        <button className="user-page-header__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
        </button>
        <h1 className="user-page-header__title">Your Cart</h1>
      </div>

      <p className="cart-restaurant-name">from {cart.restaurantName}</p>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <PhotoTile src={item.imageUrl} alt={item.name} width={56} height={56} radius={10} />
            <div className="cart-item__info">
              <div className="cart-item__name">{item.name}</div>
              <div className="cart-item__price">₹{item.price} each</div>
            </div>
            <div className="menu-item__stepper">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <div className="cart-item__total">₹{(item.price * item.quantity).toFixed(0)}</div>
          </div>
        ))}
      </div>

      <button className="cart-clear" onClick={clearCart}>
        Clear cart
      </button>

      <div className="cart-summary">
        <h3 className="cart-summary__title">Bill Summary</h3>
        <div className="cart-summary__row">
          <span>Item Total</span>
          <span>₹{subtotal.toFixed(0)}</span>
        </div>
        <div className="cart-summary__row">
          <span>Delivery Fee</span>
          <span>₹{DELIVERY_FEE}</span>
        </div>
        <div className="cart-summary__row">
          <span>Taxes &amp; Charges</span>
          <span>₹{taxes.toFixed(0)}</span>
        </div>
        <div className="cart-summary__row cart-summary__row--total">
          <span>To Pay</span>
          <span>₹{total.toFixed(0)}</span>
        </div>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </Button>
    </div>
  )
}
