import { createContext, useContext, useEffect, useState } from 'react'

const ManagedPartnerContext = createContext(null)
const STORAGE_KEY = 'foodfiesta.managedPartnerId'

export function ManagedPartnerProvider({ children }) {
  const [partnerId, setPartnerIdState] = useState(() => localStorage.getItem(STORAGE_KEY))

  useEffect(() => {
    if (partnerId) {
      localStorage.setItem(STORAGE_KEY, partnerId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [partnerId])

  const setPartnerId = (id) => setPartnerIdState(id)
  const clearPartner = () => setPartnerIdState(null)

  return (
    <ManagedPartnerContext.Provider value={{ partnerId, setPartnerId, clearPartner }}>
      {children}
    </ManagedPartnerContext.Provider>
  )
}

export function useManagedPartner() {
  const ctx = useContext(ManagedPartnerContext)
  if (!ctx) throw new Error('useManagedPartner must be used within ManagedPartnerProvider')
  return ctx
}
