import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Star, Clock, IndianRupee, Flame, UtensilsCrossed, Star as StarIcon } from 'lucide-react'
import { getRestaurant, getMenu, getReviews, addReview } from '../../api/endpoints'
import { useCart } from '../../context/CartContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import PhotoTile from '../../components/PhotoTile.jsx'
import Tag from '../../components/Tag.jsx'
import Card from '../../components/Card.jsx'
import Button from '../../components/Button.jsx'
import { TextArea } from '../../components/Field.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import './RestaurantDetail.css'

const SECTIONS = ['BREAKFAST', 'LUNCH', 'DINNER', 'SWEETS', 'EXTRAS']
const SECTION_LABELS = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SWEETS: 'Sweets',
  EXTRAS: 'Extras',
}

export default function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cart, addItem, updateQuantity } = useCart()
  const { showToast } = useToast()

  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState(null)
  const [reviews, setReviews] = useState([])
  const [activeSection, setActiveSection] = useState('BREAKFAST')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    getRestaurant(id).then(setRestaurant).catch(() => setRestaurant(false))
    getMenu(id).then(setMenu).catch(() => setMenu({}))
    getReviews(id).then(setReviews).catch(() => setReviews([]))
  }, [id])

  const quantityFor = (itemId) => cart.items.find((i) => i.id === itemId)?.quantity ?? 0

  const handleAdd = (item) => {
    addItem(restaurant, item)
    showToast(`Added ${item.name} to cart`, 'success', 1800)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!reviewText.trim()) return
    setSubmittingReview(true)
    try {
      const review = await addReview(id, { userName: 'You', rating: reviewRating, comment: reviewText.trim() })
      setReviews((prev) => [review, ...prev])
      setReviewText('')
      showToast('Thanks for your review!', 'success', 2200)
    } catch {
      showToast('Could not submit review right now', 'error', 2200)
    } finally {
      setSubmittingReview(false)
    }
  }

  if (restaurant === false) {
    return <EmptyState title="Restaurant not found" subtitle="It may have been removed or suspended." />
  }

  return (
    <div className="fade-in-up">
      <div className="user-page-header">
        <button className="user-page-header__back" onClick={() => navigate('/')}>
          <ArrowLeft size={17} />
        </button>
      </div>

      {!restaurant ? (
        <div className="ff-skeleton" style={{ height: 160, marginBottom: 24 }} />
      ) : (
        <div className="restaurant-banner">
          <PhotoTile src={restaurant.imageUrl} alt={restaurant.name} width={96} height={84} radius={12} />
          <div className="restaurant-banner__info">
            <h1 className="restaurant-banner__name">{restaurant.name}</h1>
            <p className="restaurant-banner__cuisine">{restaurant.cuisine} · {restaurant.address}</p>
            <div className="restaurant-banner__meta">
              <Tag variant="success" icon={<Star size={11} fill="currentColor" />}>{restaurant.rating.toFixed(1)}</Tag>
              <Tag variant="default" icon={<Clock size={11} />}>{restaurant.deliveryTimeMinutes} min</Tag>
              <Tag variant="default" icon={<IndianRupee size={11} />}>{restaurant.avgCostForTwo} for two</Tag>
              <Tag variant="accent" icon={<UtensilsCrossed size={11} />}>{restaurant.menuItemCount} dishes on menu</Tag>
            </div>
          </div>
        </div>
      )}

      <div className="user-chip-row restaurant-tabs">
        {SECTIONS.map((section) => (
          <button
            key={section}
            className={`user-chip ${activeSection === section ? 'user-chip--active' : ''}`}
            onClick={() => setActiveSection(section)}
          >
            {SECTION_LABELS[section]}
          </button>
        ))}
      </div>

      {!menu ? (
        <div className="menu-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ff-skeleton" style={{ height: 96 }} />
          ))}
        </div>
      ) : (
        <div className="menu-list">
          {(menu[activeSection] || []).length === 0 && (
            <EmptyState title="Nothing here yet" subtitle="This section is currently empty." />
          )}
          {(menu[activeSection] || []).map((item) => {
            const qty = quantityFor(item.id)
            return (
              <Card key={item.id} className="menu-item">
                <PhotoTile src={item.imageUrl} alt={item.name} width={72} height={72} radius={10} />
                <div className="menu-item__body">
                  <div className="menu-item__top">
                    <Tag variant="default" className={item.veg ? 'ff-tag--veg' : 'ff-tag--nonveg'}>
                      {item.veg ? 'Veg' : 'Non-Veg'}
                    </Tag>
                    {item.bestseller && <Tag variant="accent" icon={<Flame size={11} />}>Bestseller</Tag>}
                    {!item.inStock && <Tag variant="danger">Out of stock</Tag>}
                  </div>
                  <h4 className="menu-item__name">{item.name}</h4>
                  <p className="menu-item__description">{item.description}</p>
                  <div className="menu-item__footer">
                    <span className="menu-item__price">₹{item.price}</span>
                    {item.inStock ? (
                      qty > 0 ? (
                        <div className="menu-item__stepper">
                          <button onClick={() => updateQuantity(item.id, qty - 1)}>−</button>
                          <span>{qty}</span>
                          <button onClick={() => updateQuantity(item.id, qty + 1)}>+</button>
                        </div>
                      ) : (
                        <Button size="sm" variant="primary" onClick={() => handleAdd(item)}>
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

      <section className="reviews-section">
        <h3 className="reviews-section__title">Ratings &amp; Reviews</h3>
        <form className="review-form" onSubmit={handleSubmitReview}>
          <div className="review-form__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                className={`review-form__star ${n <= reviewRating ? 'review-form__star--active' : ''}`}
                onClick={() => setReviewRating(n)}
              >
                <StarIcon size={20} fill={n <= reviewRating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
          <TextArea
            placeholder="Share your experience with this restaurant…"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />
          <Button type="submit" variant="outline" size="sm" loading={submittingReview} disabled={!reviewText.trim()}>
            Post Review
          </Button>
        </form>

        <div className="reviews-list">
          {reviews.length === 0 && <p className="reviews-empty">No reviews yet — be the first to share your thoughts.</p>}
          {reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item__top">
                <span className="review-item__name">{r.userName}</span>
                <span className="review-item__stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} />
                  ))}
                </span>
              </div>
              <p className="review-item__comment">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {cart.items.length > 0 && cart.restaurantId === id && (
        <button className="cart-fab" onClick={() => navigate('/cart')}>
          View Cart · {cart.items.reduce((s, i) => s + i.quantity, 0)} items
        </button>
      )}
    </div>
  )
}
