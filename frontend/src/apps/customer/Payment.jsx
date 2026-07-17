import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Wallet, Smartphone, IndianRupee, Zap, CreditCard, Landmark, Banknote, Lock, Check } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import { useSession } from '../../context/SessionContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { placeOrder } from '../../api/endpoints'
import Button from '../../components/Button.jsx'
import Spinner from '../../components/Spinner.jsx'
import { TextField, SelectField } from '../../components/Field.jsx'
import './Payment.css'

const METHODS = [
  { key: 'GOOGLE_PAY', label: 'Google Pay', Icon: Wallet, color: '#4285F4' },
  { key: 'PHONE_PE', label: 'PhonePe', Icon: Smartphone, color: '#5f259f' },
  { key: 'PAYTM', label: 'Paytm', Icon: IndianRupee, color: '#00b9f1' },
  { key: 'BHIM_UPI', label: 'BHIM UPI', Icon: Zap, color: '#e8a93a' },
  { key: 'CARD', label: 'Credit / Debit Card', Icon: CreditCard, color: '#b3231c' },
  { key: 'NET_BANKING', label: 'Net Banking', Icon: Landmark, color: '#0f6b5c' },
  { key: 'COD', label: 'Cash on Delivery', Icon: Banknote, color: '#7a1710' },
]

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank']

const DELIVERY_FEE = 30
const TAX_RATE = 0.05

export default function Payment() {
  const { cart, checkout, subtotal, clearCart } = useCart()
  const { session } = useSession()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [selected, setSelected] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [bank, setBank] = useState(BANKS[0])

  useEffect(() => {
    if (cart.items.length === 0) navigate('/cart')
  }, [cart.items.length, navigate])

  const taxes = subtotal * TAX_RATE
  const total = subtotal + DELIVERY_FEE + taxes

  const formReady = () => {
    if (selected === 'CARD') return cardNumber.trim().length >= 12 && cardExpiry.trim() && cardCvv.trim().length >= 3
    return true
  }

  const handlePay = async () => {
    setProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1800))
    try {
      const order = await placeOrder({
        userId: session.userId,
        userName: session.name,
        restaurantId: cart.restaurantId,
        items: cart.items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
        deliveryAddress: checkout.deliveryAddress || 'Address on file',
        paymentMethod: selected,
        couponCode: checkout.couponCode || null,
      })
      clearCart()
      navigate(`/confirmation/${order.id}`)
    } catch (err) {
      setProcessing(false)
      showToast('Payment could not be processed. Please try again.', 'error', 3500)
    }
  }

  if (processing) {
    return (
      <div className="payment-processing fade-in-up">
        <Spinner size={54} />
        <h2 className="payment-processing__title">Processing your payment…</h2>
        <p className="payment-processing__subtitle">Please don't close this window.</p>
      </div>
    )
  }

  return (
    <div className="fade-in-up payment-page">
      <div className="user-page-header">
        <button className="user-page-header__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
        </button>
        <h1 className="user-page-header__title">Payment</h1>
      </div>

      <div className="payment-total-banner">
        <span>Amount Payable</span>
        <strong>₹{total.toFixed(0)}</strong>
      </div>

      <h3 className="payment-section-title">Select a payment method</h3>
      <div className="payment-methods">
        {METHODS.map((method) => (
          <button
            key={method.key}
            className={`payment-tile ${selected === method.key ? 'payment-tile--active' : ''}`}
            onClick={() => setSelected(method.key)}
          >
            <span className="payment-tile__icon" style={{ background: method.color }}>
              <method.Icon size={18} color="#fff" />
            </span>
            <span className="payment-tile__label">{method.label}</span>
            {selected === method.key && <Check size={17} className="payment-tile__check" />}
          </button>
        ))}
      </div>

      {selected === 'CARD' && (
        <div className="payment-card-form fade-in-up">
          <TextField
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <div className="payment-card-form__row">
            <TextField label="Expiry" placeholder="MM/YY" maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
            <TextField label="CVV" placeholder="123" maxLength={3} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} />
          </div>
          <p className="payment-mock-note">
            <Lock size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
            This is a mock form for demo purposes — no card data is validated or stored.
          </p>
        </div>
      )}

      {selected === 'NET_BANKING' && (
        <div className="payment-card-form fade-in-up">
          <SelectField label="Select your bank" value={bank} onChange={(e) => setBank(e.target.value)}>
            {BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </SelectField>
        </div>
      )}

      {selected === 'COD' && (
        <p className="payment-mock-note fade-in-up">
          <Banknote size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
          Pay in cash to your delivery partner when your order arrives.
        </p>
      )}

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={!selected || !formReady()}
        onClick={handlePay}
        className="payment-continue-btn"
      >
        {selected ? `Pay ₹${total.toFixed(0)}` : 'Select a payment method'}
      </Button>
    </div>
  )
}
