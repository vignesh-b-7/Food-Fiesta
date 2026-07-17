import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { getActiveCoupons } from '../../api/endpoints'
import { TextField } from '../../components/Field.jsx'
import Button from '../../components/Button.jsx'
import Card from '../../components/Card.jsx'
import Tag from '../../components/Tag.jsx'
import './Checkout.css'

const PRESET_ADDRESSES = [
  { label: 'Home', value: '204, Lake View Apartments, Koramangala 5th Block, Bengaluru - 560095' },
  { label: 'Work', value: 'WeWork Galaxy, 3rd Floor, Residency Road, Bengaluru - 560025' },
]

export default function Checkout() {
  const { cart, checkout, setDeliveryAddress, setCouponCode, subtotal } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState(checkout.deliveryAddress || '')
  const [phone, setPhone] = useState('98765 43210')
  const [instructions, setInstructions] = useState('')
  const [couponInput, setCouponInput] = useState(checkout.couponCode || '')
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    if (cart.items.length === 0) navigate('/cart')
  }, [cart.items.length, navigate])

  useEffect(() => {
    getActiveCoupons().then(setCoupons).catch(() => setCoupons([]))
  }, [])

  const handleContinue = (e) => {
    e.preventDefault()
    setDeliveryAddress(address.trim())
    setCouponCode(couponInput.trim())
    navigate('/payment')
  }

  return (
    <div className="fade-in-up">
      <div className="user-page-header">
        <button className="user-page-header__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
        </button>
        <h1 className="user-page-header__title">Checkout</h1>
      </div>

      <form className="checkout-form" onSubmit={handleContinue}>
        <Card className="checkout-section">
          <h3 className="checkout-section__title">Delivery Address</h3>
          <div className="checkout-preset-row">
            {PRESET_ADDRESSES.map((preset) => (
              <button type="button" key={preset.label} className="user-chip" onClick={() => setAddress(preset.value)}>
                <MapPin size={12} style={{ marginRight: 4, verticalAlign: -2 }} />
                {preset.label}
              </button>
            ))}
          </div>
          <TextField
            label="Full Address"
            required
            placeholder="Flat / House no., Street, Area, City, Pincode"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <TextField
            label="Contact Number"
            required
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            label="Delivery Instructions (optional)"
            placeholder="E.g. Ring the bell twice, leave at the door…"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </Card>

        <Card className="checkout-section">
          <h3 className="checkout-section__title">Apply Coupon</h3>
          <div className="checkout-coupon-input">
            <TextField
              placeholder="Enter coupon code"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            />
          </div>
          <div className="checkout-coupon-list scrollbar-thin">
            {coupons.map((c) => (
              <button
                type="button"
                key={c.id}
                className={`coupon-chip ${couponInput === c.code ? 'coupon-chip--active' : ''}`}
                onClick={() => setCouponInput(c.code)}
              >
                <Tag variant="accent">{c.code}</Tag>
                <span>{c.description}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="checkout-section">
          <h3 className="checkout-section__title">Order Summary</h3>
          <p className="checkout-summary-line">
            {cart.items.reduce((s, i) => s + i.quantity, 0)} items from {cart.restaurantName} · ₹{subtotal.toFixed(0)}
          </p>
        </Card>

        <Button type="submit" variant="primary" size="lg" fullWidth>
          Continue to Payment
        </Button>
      </form>
    </div>
  )
}
