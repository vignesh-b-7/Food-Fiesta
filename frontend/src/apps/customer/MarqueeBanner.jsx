const WORDS = [
  'Fresh Ingredients',
  'Hot & Ready',
  'Fast Delivery',
  'Authentic Flavors',
  'Home-style Cooking',
  'Spice Market Favorites',
  '260+ Dishes',
  'Order Now',
  'Made with Love',
  '8 Restaurants, One App',
]

export default function MarqueeBanner() {
  return (
    <div className="marquee-banner">
      <div className="marquee-banner__track">
        {[...WORDS, ...WORDS].map((word, i) => (
          <span className="marquee-banner__item" key={i}>
            {word}
            <span className="marquee-banner__dot">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
