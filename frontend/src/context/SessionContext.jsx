import { createContext, useContext, useEffect, useState } from 'react'
import { login as loginRequest } from '../api/endpoints'

const SessionContext = createContext(null)

const STORAGE_KEY = 'foodfiesta.session'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [session])

  const enterPortal = async (role, name) => {
    const data = await loginRequest(name, role)
    setSession(data)
    return data
  }

  const exitPortal = () => setSession(null)

  return (
    <SessionContext.Provider value={{ session, enterPortal, exitPortal }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
