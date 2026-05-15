import { useState, useEffect } from "react";

export default function BookingForm({
  services,
  addBooking,
  selectedService,
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
      service: "",
      date: "",
      time: "",
      staff: "",
    });
  }

  return (
    <section className="form-section">
      <div className="form-card">

        <p className="eyebrow">
          Book Appointment
        </p>

        <form onSubmit={handleSubmit}>

          <label>Customer Name</label>

          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Enter your name"
          />

          <label>Service</label>

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
          >
            <option value="">
              Select service
            </option>

            {services.map((service, index) => (
              <option
                key={index}
                value={service.name}
              >
                {service.name}
              </option>
            ))}
          </select>

          <label>Date</label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <label>Time</label>

          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
          />

          <label>Preferred Staff</label>

          <select
            name="staff"
            value={form.staff}
            onChange={handleChange}
          >
            <option value="">
              No preference
            </option>

            <option value="Staff A">
              Staff A
            </option>

            <option value="Staff B">
              Staff B
            </option>

            <option value="Staff C">
              Staff C
            </option>
          </select>

          <button
            className="primary-btn"
            type="submit"
          >
            Submit Booking
          </button>

        </form>
      </div>
    </section>
  );
}