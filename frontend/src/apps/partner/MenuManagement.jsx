import { useCallback, useEffect, useState } from 'react'
import { Flame } from 'lucide-react'
import { getMenu, addMenuItem, updateMenuItem, toggleMenuItemStock, deleteMenuItem } from '../../api/endpoints'
import { useManagedRestaurant } from './ManagedRestaurantContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import Tag from '../../components/Tag.jsx'
import Switch from '../../components/Switch.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import { TextField, TextArea, SelectField } from '../../components/Field.jsx'
import './partner.css'

const SECTIONS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SWEETS', 'EXTRAS']
const SECTION_LABELS = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SWEETS: 'Sweets',
  EXTRAS: 'Extras',
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24) || 'food'
}

function autoPhotoUrl(name) {
  return `https://loremflickr.com/480/360/food,${slugify(name)}?lock=${Date.now()}`
}

const emptyForm = {
  name: '',
  description: '',
  section: 'BREAKFAST',
  price: '',
  imageUrl: '',
  veg: true,
  inStock: true,
  bestseller: false,
}

export default function MenuManagement() {
  const { restaurantId } = useManagedRestaurant()
  const { showToast } = useToast()
  const [menu, setMenu] = useState(null)
  const [modalItem, setModalItem] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    getMenu(restaurantId)
      .then(setMenu)
      .catch(() => setMenu({}))
  }, [restaurantId])

  useEffect(() => {
    load()
  }, [load])

  const openAdd = (section) => {
    setForm({ ...emptyForm, section })
    setModalItem('new')
  }

  const openEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description,
      section: item.section,
      price: String(item.price),
      imageUrl: item.imageUrl,
      veg: item.veg,
      inStock: item.inStock,
      bestseller: item.bestseller,
    })
    setModalItem(item.id)
  }

  const closeModal = () => setModalItem(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      imageUrl: form.imageUrl.trim() || autoPhotoUrl(form.name),
    }
    try {
      if (modalItem === 'new') {
        await addMenuItem(restaurantId, payload)
        showToast('Menu item added', 'success', 2000)
      } else {
        await updateMenuItem(restaurantId, modalItem, payload)
        showToast('Menu item updated', 'success', 2000)
      }
      closeModal()
      load()
    } catch {
      showToast('Could not save the menu item', 'error', 2500)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleStock = async (item) => {
    setMenu((prev) => ({
      ...prev,
      [item.section]: prev[item.section].map((i) => (i.id === item.id ? { ...i, inStock: !i.inStock } : i)),
    }))
    try {
      await toggleMenuItemStock(restaurantId, item.id)
    } catch {
      showToast('Could not update stock status', 'error', 2200)
      load()
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.name}" from the menu?`)) return
    try {
      await deleteMenuItem(restaurantId, item.id)
      showToast('Menu item removed', 'info', 2000)
      load()
    } catch {
      showToast('Could not remove the item', 'error', 2200)
    }
  }

  return (
    <div className="fade-in-up">
      <div className="rd-menu-toolbar">
        <h1 className="rd-section-title" style={{ marginBottom: 0 }}>
          Menu Management
        </h1>
      </div>

      {menu === null ? (
        <div className="ff-skeleton" style={{ height: 300 }} />
      ) : (
        SECTIONS.map((section) => (
          <div key={section} className="rd-menu-section">
            <div className="rd-menu-toolbar">
              <h3 className="rd-menu-section__title">{SECTION_LABELS[section]}</h3>
              <Button size="sm" variant="outline" onClick={() => openAdd(section)}>
                + Add Item
              </Button>
            </div>
            {(menu[section] || []).length === 0 && <p className="rd-order-card__customer">No items in this section yet.</p>}
            {(menu[section] || []).map((item) => (
              <Card key={item.id} className="rd-menu-item">
                <PhotoTile src={item.imageUrl} alt={item.name} width={48} height={48} radius={8} />
                <div className="rd-menu-item__body">
                  <div className="rd-menu-item__name">
                    {item.name} {item.bestseller && <Tag variant="accent" icon={<Flame size={11} />}>Bestseller</Tag>}
                  </div>
                  <div className="rd-menu-item__price">
                    ₹{item.price} · {item.veg ? 'Veg' : 'Non-Veg'}
                  </div>
                </div>
                <div className="rd-menu-item__actions">
                  <Switch on={item.inStock} onToggle={() => handleToggleStock(item)} />
                  <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(item)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ))
      )}

      {modalItem && (
        <div className="rd-modal-backdrop" onClick={closeModal}>
          <form className="rd-modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3 className="rd-modal__title">{modalItem === 'new' ? 'Add Menu Item' : 'Edit Menu Item'}</h3>
            <TextField
              label="Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextArea
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <div className="rd-modal__row">
              <SelectField label="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>
                {SECTIONS.map((s) => (
                  <option key={s} value={s}>
                    {SECTION_LABELS[s]}
                  </option>
                ))}
              </SelectField>
              <TextField
                label="Price (₹)"
                type="number"
                min="1"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <TextField
              label="Photo URL (optional — auto-generated if left blank)"
              placeholder="https://loremflickr.com/480/360/..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <div className="rd-modal__checkboxes">
              <label className="rd-checkbox">
                <input type="checkbox" checked={form.veg} onChange={(e) => setForm({ ...form, veg: e.target.checked })} />
                Vegetarian
              </label>
              <label className="rd-checkbox">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
                In Stock
              </label>
              <label className="rd-checkbox">
                <input
                  type="checkbox"
                  checked={form.bestseller}
                  onChange={(e) => setForm({ ...form, bestseller: e.target.checked })}
                />
                Bestseller
              </label>
            </div>
            <div className="rd-modal__actions">
              <Button variant="ghost" type="button" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={saving}>
                Save Item
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
