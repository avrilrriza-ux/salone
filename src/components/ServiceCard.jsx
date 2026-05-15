export default function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <img src={service.image} alt={service.name} />

      <div className="service-content">
        <h3>{service.name}</h3>

        <p className="service-duration">
          <span>◷</span> {service.duration}
        </p>

        <h4 className="service-price">
          ₱{service.price}
        </h4>

        <button className="service-btn" onClick={onBook}>
          BOOK NOW
        </button>
      </div>
    </div>
  );
}