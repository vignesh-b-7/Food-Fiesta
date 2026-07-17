import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Bike } from 'lucide-react'
import { getDeliveryPartner } from '../../api/endpoints'
import { useSession } from '../../context/SessionContext.jsx'
import PortalLayout from '../../components/PortalLayout.jsx'
import { ManagedPartnerProvider, useManagedPartner } from './ManagedPartnerContext.jsx'
import RiderLogin from './RiderLogin.jsx'
import Home from './Home.jsx'
import Earnings from './Earnings.jsx'

function RiderGated() {
  const { session } = useSession()
  const { partnerId } = useManagedPartner()
  const [partner, setPartner] = useState(null)

  useEffect(() => {
    if (partnerId) {
      getDeliveryPartner(partnerId).then(setPartner).catch(() => setPartner(null))
    }
  }, [partnerId])

  if (!session || session.role !== 'DELIVERY' || !partnerId) {
    return <Navigate to="/rider/login" replace />
  }

  return (
    <PortalLayout
      icon={Bike}
      title={partner?.name || 'Delivery Partner'}
      loginPath="/rider/login"
      navItems={[
        { to: '/rider', label: 'Deliveries', end: true },
        { to: '/rider/earnings', label: 'Earnings' },
      ]}
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="earnings" element={<Earnings />} />
      </Routes>
    </PortalLayout>
  )
}

export default function RiderApp() {
  return (
    <ManagedPartnerProvider>
      <Routes>
        <Route path="login" element={<RiderLogin />} />
        <Route path="*" element={<RiderGated />} />
      </Routes>
    </ManagedPartnerProvider>
  )
}
