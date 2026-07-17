import { useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSession } from '../../context/SessionContext.jsx'
import CustomerLayout from './CustomerLayout.jsx'
import Spinner from '../../components/Spinner.jsx'
import Home from './Home.jsx'
import RestaurantDetail from './RestaurantDetail.jsx'
import Cart from './Cart.jsx'
import Checkout from './Checkout.jsx'
import Payment from './Payment.jsx'
import Confirmation from './Confirmation.jsx'
import OrderTracking from './OrderTracking.jsx'
import OrderHistory from './OrderHistory.jsx'

export default function CustomerApp() {
  const { session, enterPortal } = useSession()
  const [ready, setReady] = useState(session?.role === 'USER')
  const started = useRef(false)

  useEffect(() => {
    if (session?.role === 'USER') {
      setReady(true)
      return
    }
    if (started.current) return
    started.current = true
    enterPortal('USER', '').finally(() => setReady(true))
  }, [session, enterPortal])

  if (!ready) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
        <Spinner size={40} />
      </div>
    )
  }

  return (
    <CustomerLayout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="restaurant/:id" element={<RestaurantDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<Payment />} />
        <Route path="confirmation/:orderId" element={<Confirmation />} />
        <Route path="track/:orderId" element={<OrderTracking />} />
        <Route path="orders" element={<OrderHistory />} />
      </Routes>
    </CustomerLayout>
  )
}
