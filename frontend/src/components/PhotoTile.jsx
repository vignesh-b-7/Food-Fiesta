import { useState } from 'react'
import { UtensilsCrossed } from 'lucide-react'

export default function PhotoTile({ src, alt = '', width, height, radius, className = '', style = {} }) {
  const [failed, setFailed] = useState(false)

  const dimensionStyle = {
    width: width ?? '100%',
    height: height ?? '100%',
    borderRadius: radius,
    ...style,
  }

  if (!src || failed) {
    return (
      <div className={`ff-photo-tile ff-photo-tile--fallback ${className}`} style={dimensionStyle}>
        <UtensilsCrossed size={Math.min(32, (height || 64) * 0.4)} strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <div className={`ff-photo-tile ${className}`} style={dimensionStyle}>
      <img src={src} alt={alt} onError={() => setFailed(true)} loading="lazy" />
    </div>
  )
}
