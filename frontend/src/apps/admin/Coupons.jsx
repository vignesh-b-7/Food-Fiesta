import { useEffect, useState } from 'react'
import { getAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../api/endpoints'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import Switch from '../../components/Switch.jsx'
import { TextField, TextArea } from '../../components/Field.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { Ticket } from 'lucide-react'
import './admin.css'

const emptyForm = {
  code: '',
  description: '',
  discountPercent: '',
  maxDiscount: '',
  minOrderValue: '',
  active: true,
}

export default function Coupons() {
  const [coupons, setCoupons] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const { showToast } = useToast()

  const load = () => getAdminCoupons().then(setCoupons).catch(() => setCoupons([]))

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setForm(emptyForm)
    setEditingId(null)
    setModalOpen(true)
  }

  const openEdit = (coupon) => {
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountPercent: String(coupon.discountPercent),
      maxDiscount: String(coupon.maxDiscount),
      minOrderValue: String(coupon.minOrderValue),
      active: coupon.active,
    })
    setEditingId(coupon.id)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      discountPercent: Number(form.discountPercent),
      maxDiscount: Number(form.maxDiscount),
      minOrderValue: Number(form.minOrderValue),
    }
    try {
      if (editingId) {
        await updateCoupon(editingId, payload)
        showToast('Coupon updated', 'success', 2000)
      } else {
        await createCoupon(payload)
        showToast('Coupon created', 'success', 2000)
      }
      setModalOpen(false)
      load()
    } catch {
      showToast('Could not save the coupon', 'error', 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (coupon) => {
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c)))
    try {
      await updateCoupon(coupon.id, {
        code: coupon.code,
        description: coupon.description,
        discountPercent: coupon.discountPercent,
        maxDiscount: coupon.maxDiscount,
        minOrderValue: coupon.minOrderValue,
        active: !coupon.active,
      })
    } catch {
      showToast('Could not update coupon', 'error', 2200)
      load()
    }
  }

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return
    try {
      await deleteCoupon(coupon.id)
      showToast('Coupon deleted', 'info', 2000)
      load()
    } catch {
      showToast('Could not delete the coupon', 'error', 2200)
    }
  }

  if (!coupons) {
    return <div className="ff-skeleton" style={{ height: 300 }} />
  }

  return (
    <div className="fade-in-up">
      <div className="admin-toolbar">
        <h1 className="rd-section-title" style={{ marginBottom: 0 }}>
          Coupons &amp; Offers
        </h1>
        <Button variant="primary" onClick={openAdd}>
          + New Coupon
        </Button>
      </div>

      {coupons.length === 0 && <EmptyState icon={Ticket} title="No coupons yet" subtitle="Create your first offer to attract more diners." />}

      {coupons.map((coupon) => (
        <Card key={coupon.id} className="admin-coupon-card">
          <div className="admin-coupon-card__code">{coupon.code}</div>
          <div className="admin-coupon-card__body">
            <div className="admin-coupon-card__description">{coupon.description}</div>
            <div className="admin-coupon-card__meta">
              {coupon.discountPercent}% off · up to ₹{coupon.maxDiscount} · min order ₹{coupon.minOrderValue}
            </div>
          </div>
          <Switch on={coupon.active} onToggle={() => handleToggleActive(coupon)} />
          <Button size="sm" variant="ghost" onClick={() => openEdit(coupon)}>
            Edit
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(coupon)}>
            Delete
          </Button>
        </Card>
      ))}

      {modalOpen && (
        <div className="rd-modal-backdrop" onClick={() => setModalOpen(false)}>
          <form className="rd-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3 className="rd-modal__title">{editingId ? 'Edit Coupon' : 'New Coupon'}</h3>
            <TextField
              label="Coupon Code"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
            <TextArea
              label="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="rd-modal__row">
              <TextField
                label="Discount %"
                type="number"
                required
                value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })}
              />
              <TextField
                label="Max Discount (₹)"
                type="number"
                required
                value={form.maxDiscount}
                onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
              />
            </div>
            <TextField
              label="Minimum Order Value (₹)"
              type="number"
              required
              value={form.minOrderValue}
              onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
            />
            <label className="rd-checkbox">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active
            </label>
            <div className="rd-modal__actions">
              <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={saving}>
                Save Coupon
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
