import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'foodfiesta.cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { restaurantId: null, restaurantName: null, items: [] }
  } catch {
    return { restaurantId: null, restaurantName: null, items: [] }
  }
}

const CHECKOUT_KEY = 'foodfiesta.checkout'

function loadCheckout() {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_KEY)
    return raw ? JSON.parse(raw) : { deliveryAddress: '', couponCode: '' }
  } catch {
    return { deliveryAddress: '', couponCode: '' }
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)
  const [checkout, setCheckout] = useState(loadCheckout)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    sessionStorage.setItem(CHECKOUT_KEY, JSON.stringify(checkout))
  }, [checkout])

  const setDeliveryAddress = (deliveryAddress) => setCheckout((prev) => ({ ...prev, deliveryAddress }))
  const setCouponCode = (couponCode) => setCheckout((prev) => ({ ...prev, couponCode }))

  const addItem = (restaurant, menuItem) => {
    setCart((prev) => {
      const isNewRestaurant = prev.restaurantId && prev.restaurantId !== restaurant.id
      const baseItems = isNewRestaurant ? [] : prev.items
      const existing = baseItems.find((i) => i.id === menuItem.id)
      const items = existing
        ? baseItems.map((i) => (i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...baseItems, { id: menuItem.id, name: menuItem.name, price: menuItem.price, imageUrl: menuItem.imageUrl, quantity: 1 }]
      return { restaurantId: restaurant.id, restaurantName: restaurant.name, items }
    })
  }

  const updateQuantity = (itemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const items = prev.items.filter((i) => i.id !== itemId)
        return items.length ? { ...prev, items } : { restaurantId: null, restaurantName: null, items: [] }
      }
      return { ...prev, items: prev.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)) }
    })
  }

  const removeItem = (itemId) => updateQuantity(itemId, 0)

  const clearCart = () => setCart({ restaurantId: null, restaurantName: null, items: [] })

  const itemCount = useMemo(() => cart.items.reduce((sum, i) => sum + i.quantity, 0), [cart.items])
  const subtotal = useMemo(() => cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart.items])

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        checkout,
        setDeliveryAddress,
        setCouponCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
