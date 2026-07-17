import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ChefHat } from 'lucide-react'
import { getRestaurant } from '../../api/endpoints'
import { useSession } from '../../context/SessionContext.jsx'
import PortalLayout from '../../components/PortalLayout.jsx'
import { ManagedRestaurantProvider, useManagedRestaurant } from './ManagedRestaurantContext.jsx'
import PartnerLogin from './PartnerLogin.jsx'
import Dashboard from './Dashboard.jsx'
import MenuManagement from './MenuManagement.jsx'
import SalesSummary from './SalesSummary.jsx'

function PartnerGated() {
  const { session } = useSession()
  const { restaurantId } = useManagedRestaurant()
  const [restaurant, setRestaurant] = useState(null)

  useEffect(() => {
    if (restaurantId) {
      getRestaurant(restaurantId).then(setRestaurant).catch(() => setRestaurant(null))
    }
  }, [restaurantId])

  if (!session || session.role !== 'RESTAURANT' || !restaurantId) {
    return <Navigate to="/partner/login" replace />
  }

  return (
    <PortalLayout
      icon={ChefHat}
      title={restaurant?.name || 'Restaurant Partner'}
      loginPath="/partner/login"
      navItems={[
        { to: '/partner', label: 'Orders', end: true },
        { to: '/partner/menu', label: 'Menu' },
        { to: '/partner/sales', label: 'Sales' },
      ]}
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="menu" element={<MenuManagement />} />
        <Route path="sales" element={<SalesSummary />} />
      </Routes>
    </PortalLayout>
  )
}

export default function PartnerApp() {
  return (
    <ManagedRestaurantProvider>
      <Routes>
        <Route path="login" element={<PartnerLogin />} />
        <Route path="*" element={<PartnerGated />} />
      </Routes>
    </ManagedRestaurantProvider>
  )
}
