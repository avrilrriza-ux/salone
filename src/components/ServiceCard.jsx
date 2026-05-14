export default function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p>{service.duration}</p>
      <h4>₱{service.price}</h4>
      <button onClick={onBook}>Book Now</button>
    </div>
  );
}