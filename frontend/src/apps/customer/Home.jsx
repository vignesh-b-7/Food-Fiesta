import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Star, Clock, IndianRupee, UtensilsCrossed, Flame } from 'lucide-react'
import { getRestaurants, getMenu } from '../../api/endpoints'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import Card from '../../components/Card.jsx'
import Tag from '../../components/Tag.jsx'
import Button from '../../components/Button.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { TextField } from '../../components/Field.jsx'
import './customer.css'

export default function Home() {
  const [restaurants, setRestaurants] = useState(null)
  const [allDishes, setAllDishes] = useState(null)
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('All')
  const [dishQuery, setDishQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const navigate = useNavigate()
  const { cart, addItem, updateQuantity } = useCart()
  const { showToast } = useToast()

  useEffect(() => {
    getRestaurants().then(setRestaurants).catch(() => setRestaurants([]))
  }, [])

  useEffect(() => {
    if (!restaurants || restaurants.length === 0) return
    Promise.all(
      restaurants.map((r) =>
        getMenu(r.id).then((menu) =>
          Object.values(menu)
            .flat()
            .map((item) => ({ ...item, restaurantId: r.id, restaurantName: r.name })),
        ),
      ),
    )
      .then((lists) => setAllDishes(lists.flat()))
      .catch(() => setAllDishes([]))
  }, [restaurants])

  const cuisines = useMemo(() => {
    if (!restaurants) return ['All']
    return ['All', ...new Set(restaurants.map((r) => r.cuisine))]
  }, [restaurants])

  const filtered = useMemo(() => {
    if (!restaurants) return []
    return restaurants.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase())
      const matchesCuisine = cuisine === 'All' || r.cuisine === cuisine
      return matchesQuery && matchesCuisine
    })
  }, [restaurants, query, cuisine])

  const filteredDishes = useMemo(() => {
    if (!allDishes) return []
    return allDishes.filter((d) => {
      const matchesQuery =
        d.name.toLowerCase().includes(dishQuery.toLowerCase()) || d.restaurantName.toLowerCase().includes(dishQuery.toLowerCase())
      const matchesVeg = !vegOnly || d.veg
      return matchesQuery && matchesVeg
    })
  }, [allDishes, dishQuery, vegOnly])

  const quantityFor = (itemId) => cart.items.find((i) => i.id === itemId)?.quantity ?? 0

  const handleAdd = (dish) => {
    addItem({ id: dish.restaurantId, name: dish.restaurantName }, dish)
    showToast(`Added ${dish.name} to cart`, 'success', 1800)
  }

  return (
    <div className="fade-in-up">
      <div className="user-hero">
        <h1 className="user-hero__title">What are you craving today?</h1>
        <p className="user-hero__subtitle">Handpicked kitchens, plated with care, delivered warm.</p>
        <div className="user-hero__search-wrap">
          <Search size={16} className="user-hero__search-icon" />
          <TextField
            placeholder="Search restaurants or cuisines…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="user-hero__search"
          />
        </div>
      </div>

      <div className="user-chip-row">
        {cuisines.map((c) => (
          <button
            key={c}
            className={`user-chip ${cuisine === c ? 'user-chip--active' : ''}`}
            onClick={() => setCuisine(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {restaurants === null && (
        <div className="user-restaurant-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ff-skeleton" style={{ height: 220 }} />
          ))}
        </div>
      )}

      {restaurants !== null && filtered.length === 0 && (
        <EmptyState icon={Search} title="No restaurants found" subtitle="Try a different search term or cuisine filter." />
      )}

      {restaurants !== null && filtered.length > 0 && (
        <div className="user-restaurant-grid">
          {filtered.map((r) => (
            <Card key={r.id} hoverable className="user-restaurant-card" onClick={() => navigate(`/restaurant/${r.id}`)}>
              <PhotoTile src={r.imageUrl} alt={r.name} height={130} radius={0} className="user-restaurant-card__image" />
              <div className="user-restaurant-card__body">
                <div className="user-restaurant-card__top">
                  <h3 className="user-restaurant-card__name">{r.name}</h3>
                  <Tag variant="success" icon={<Star size={11} fill="currentColor" />}>
                    {r.rating.toFixed(1)}
                  </Tag>
                </div>
                <p className="user-restaurant-card__cuisine">{r.cuisine}</p>
                <div className="user-restaurant-card__meta">
                  <Tag variant="default" icon={<Clock size={11} />}>{r.deliveryTimeMinutes} min</Tag>
                  <Tag variant="default" icon={<IndianRupee size={11} />}>{r.avgCostForTwo} for two</Tag>
                  <Tag variant="accent" icon={<UtensilsCrossed size={11} />}>{r.menuItemCount} dishes</Tag>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="all-dishes-section">
        <div className="all-dishes-header">
          <div>
            <h2 className="all-dishes-title">All Dishes</h2>
            <p className="all-dishes-subtitle">
              {allDishes ? `${allDishes.length} dishes across all ${restaurants?.length ?? 8} restaurants` : 'Loading every dish…'}
            </p>
          </div>
          <div className="all-dishes-controls">
            <div className="user-hero__search-wrap all-dishes-search">
              <Search size={15} className="user-hero__search-icon" />
              <TextField
                placeholder="Search any dish or restaurant…"
                value={dishQuery}
                onChange={(e) => setDishQuery(e.target.value)}
                className="user-hero__search"
              />
            </div>
            <button className={`user-chip ${vegOnly ? 'user-chip--active' : ''}`} onClick={() => setVegOnly((v) => !v)}>
              Veg Only
            </button>
          </div>
        </div>

        {allDishes === null && (
          <div className="all-dishes-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ff-skeleton" style={{ height: 260 }} />
            ))}
          </div>
        )}

        {allDishes !== null && filteredDishes.length === 0 && (
          <EmptyState icon={Search} title="No dishes found" subtitle="Try a different search term or clear the veg filter." />
        )}

        {allDishes !== null && filteredDishes.length > 0 && (
          <div className="all-dishes-grid">
            {filteredDishes.map((dish) => {
              const qty = quantityFor(dish.id)
              return (
                <Card key={dish.id} className="dish-card">
                  <PhotoTile src={dish.imageUrl} alt={dish.name} height={140} radius={0} className="dish-card__image" />
                  <div className="dish-card__body">
                    <button className="dish-card__restaurant" onClick={() => navigate(`/restaurant/${dish.restaurantId}`)}>
                      {dish.restaurantName}
                    </button>
                    <div className="dish-card__top">
                      <Tag variant="default" className={dish.veg ? 'ff-tag--veg' : 'ff-tag--nonveg'}>
                        {dish.veg ? 'Veg' : 'Non-Veg'}
                      </Tag>
                      {dish.bestseller && (
                        <Tag variant="accent" icon={<Flame size={10} />}>
                          Bestseller
                        </Tag>
                      )}
                    </div>
                    <h4 className="dish-card__name">{dish.name}</h4>
                    <p className="dish-card__description">{dish.description}</p>
                    <div className="dish-card__footer">
                      <span className="menu-item__price">₹{dish.price}</span>
                      {dish.inStock ? (
                        qty > 0 ? (
                          <div className="menu-item__stepper">
                            <button onClick={() => updateQuantity(dish.id, qty - 1)}>−</button>
                            <span>{qty}</span>
                            <button onClick={() => updateQuantity(dish.id, qty + 1)}>+</button>
                          </div>
                        ) : (
                          <Button size="sm" variant="primary" onClick={() => handleAdd(dish)}>
                            Add +
                          </Button>
                        )
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
