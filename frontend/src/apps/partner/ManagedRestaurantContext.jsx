import { createContext, useContext, useEffect, useState } from 'react'

const ManagedRestaurantContext = createContext(null)
const STORAGE_KEY = 'foodfiesta.managedRestaurantId'

export function ManagedRestaurantProvider({ children }) {
  const [restaurantId, setRestaurantIdState] = useState(() => localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (restaurantId) {
      localStorage.setItem(STORAGE_KEY, restaurantId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [restaurantId])

  const setRestaurantId = (id) => setRestaurantIdState(id)
  const clearRestaurant = () => setRestaurantIdState(null)

  return (
    <ManagedRestaurantContext.Provider value={{ restaurantId, setRestaurantId, clearRestaurant }}>
      {children}
    </ManagedRestaurantContext.Provider>
  )
}

export function useManagedRestaurant() {
  const ctx = useContext(ManagedRestaurantContext)
  if (!ctx) throw new Error('useManagedRestaurant must be used within ManagedRestaurantProvider')
  return ctx
}
