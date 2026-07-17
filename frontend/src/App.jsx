import { Route, Routes } from 'react-router-dom'
import CustomerApp from './apps/customer/CustomerApp.jsx'
import PartnerApp from './apps/partner/PartnerApp.jsx'
import RiderApp from './apps/rider/RiderApp.jsx'
import AdminApp from './apps/admin/AdminApp.jsx'
import DevSwitcher from './apps/DevSwitcher.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/dev" element={<DevSwitcher />} />
      <Route path="/partner/*" element={<PartnerApp />} />
      <Route path="/rider/*" element={<RiderApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<CustomerApp />} />
    </Routes>
  )
}
