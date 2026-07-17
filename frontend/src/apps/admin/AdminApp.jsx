import { Navigate, Route, Routes } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { useSession } from '../../context/SessionContext.jsx'
import PortalLayout from '../../components/PortalLayout.jsx'
import AdminLogin from './AdminLogin.jsx'
import Dashboard from './Dashboard.jsx'
import Restaurants from './Restaurants.jsx'
import Coupons from './Coupons.jsx'
import Complaints from './Complaints.jsx'

function AdminGated() {
  const { session } = useSession()

  if (!session || session.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <PortalLayout
      icon={LayoutDashboard}
      title="Admin Console"
      loginPath="/admin/login"
      navItems={[
        { to: '/admin', label: 'Dashboard', end: true },
        { to: '/admin/restaurants', label: 'Restaurants' },
        { to: '/admin/coupons', label: 'Coupons' },
        { to: '/admin/complaints', label: 'Complaints' },
      ]}
    >
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="complaints" element={<Complaints />} />
      </Routes>
    </PortalLayout>
  )
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="*" element={<AdminGated />} />
    </Routes>
  )
}
