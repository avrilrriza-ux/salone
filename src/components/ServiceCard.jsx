export default function ServiceCard({
  service,
  onBook,
}) {
  return (
    <div className="service-card">
      <div className="service-image">
        <img
          src={service.image}
          alt={service.name}
        />
      </div>

      <div className="service-icon">
        {service.icon}
      </div>

      <div className="service-content">
        <h3>{service.name}</h3>

        <p className="duration">
          ⏱ {service.duration}
        </p>

        <h4>₱{service.price}</h4>

        <button onClick={onBook}>
          Book Now
        </button>
      </div>
    </div>
  );
}