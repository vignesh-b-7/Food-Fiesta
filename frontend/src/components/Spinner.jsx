export default function Spinner({ size = 22, color }) {
  return (
    <span
      className="ff-spinner"
      style={{
        width: size,
        height: size,
        borderTopColor: color,
      }}
    />
  )
}
