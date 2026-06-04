export default function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <div className="service-image-box">
        <img
          src={service.image}
          alt={service.name}
          className="service-img"
        />
      </div>

      <div className="service-content">
        <h3>{service.name || "Unnamed Service"}</h3>

        <p className="service-duration">
          <span>◷</span> {service.duration || "No duration"}
        </p>
        <p className="service-description">
  {service.description || "No description"}
</p>

        <h4 className="service-price">
          ₱{service.price ?? "0"}
        </h4>

       <div className="service-actions">
  

  <button
    className="service-btn"
    onClick={() =>
      onBook(service)
    }
  >
    BOOK NOW
  </button>
</div>
      </div>
    </div>
  );
}