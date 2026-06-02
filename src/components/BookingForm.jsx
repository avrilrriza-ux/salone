import { useState, useEffect } from "react";

export default function BookingForm({
  services,
  addBooking,
  selectedService,
  leftImage,
}) {
  const [form, setForm] = useState({
    customerName: "",
    service: selectedService || "",
    date: "",
    time: "",
    staff: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      service: selectedService || "",
    }));
  }, [selectedService]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !form.customerName ||
      !form.service ||
      !form.date ||
      !form.time
    ) {
      alert("Please complete the required fields.");
      return;
    }

    addBooking(form);

    setForm({
      customerName: "",
      service: selectedService || "",
      date: "",
      time: "",
      staff: "",
    });
  }

  return (
    <section className="booking-section">
      <div className="booking-wrapper">
        <div className="booking-left">
          <img
            src={leftImage}
            alt="Salon pampering"
            className="booking-side-image"
          />
        </div>

        <div className="booking-right">
          <div className="booking-top">
            <h2 className="booking-main-title">
              Schedule your salon visit
            </h2>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-group">
              <label>Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            <div className="booking-group">
              <label>Service</label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
              >
                <option value="">Select service</option>

                {services.map((service) => (
                  <option key={service.id || service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="booking-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </div>

            <div className="booking-group">
              <label>Preferred Staff</label>
              <select
                name="staff"
                value={form.staff}
                onChange={handleChange}
              >
                <option value="">No preference</option>
                <option value="Staff A">Staff A</option>
                <option value="Staff B">Staff B</option>
                <option value="Staff C">Staff C</option>
              </select>
            </div>

            <button className="booking-btn" type="submit">
              Submit Booking
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}