import { useEffect, useState } from 'react'
import { Ticket } from 'lucide-react'
import { getComplaints, updateComplaintStatus } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Tag from '../../components/Tag.jsx'
import { SelectField } from '../../components/Field.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './admin.css'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED']
const STATUS_VARIANT = { OPEN: 'danger', IN_PROGRESS: 'accent', RESOLVED: 'success' }

export default function Complaints() {
  const [complaints, setComplaints] = useState(null)
  const { showToast } = useToast()

  const load = () => getComplaints().then(setComplaints).catch(() => setComplaints([]))

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (complaint, status) => {
    setComplaints((prev) => prev.map((c) => (c.id === complaint.id ? { ...c, status } : c)))
    try {
      await updateComplaintStatus(complaint.id, status)
      showToast(`Ticket ${complaint.id} marked ${status.replace('_', ' ').toLowerCase()}`, 'success', 2000)
    } catch {
      showToast('Could not update ticket status', 'error', 2200)
      load()
    }
  }

  if (!complaints) {
    return <div className="ff-skeleton" style={{ height: 300 }} />
  }

  return (
    <div className="fade-in-up">
      <h1 className="rd-section-title">Complaints &amp; Support Tickets</h1>

      {complaints.length === 0 && <EmptyState icon={Ticket} title="No tickets" subtitle="Support tickets raised by diners will show up here." />}

      {complaints.map((c) => (
        <Card key={c.id} className="admin-complaint-card">
          <div className="admin-complaint-card__top">
            <span className="admin-complaint-card__subject">{c.subject}</span>
            <Tag variant={STATUS_VARIANT[c.status] || 'default'}>{c.status.replace('_', ' ')}</Tag>
          </div>
          <div className="admin-complaint-card__meta">
            {c.userName} · {c.category} · Order {c.orderId || '—'}
          </div>
          <p className="admin-complaint-card__description">{c.description}</p>
          <div className="admin-complaint-card__footer">
            <SelectField value={c.status} onChange={(e) => handleStatusChange(c, e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </SelectField>
          </div>
        </Card>
      ))}
    </div>
  )
}
