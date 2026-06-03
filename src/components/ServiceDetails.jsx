export default function ServiceDetails({
  service,
  goBack,
}) {
  if (!service) return null;

  return (
    <section className="service-details-page">
      <button onClick={goBack}>
        ← Back
      </button>

      <img
        src={service.image}
        alt={service.name}
        style={{
          width: "400px",
          borderRadius: "12px",
        }}
      />

      <h1>{service.name}</h1>

      <p>{service.description}</p>

      <h2>₱{service.price}</h2>
    </section>
  );
}