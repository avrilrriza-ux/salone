import { useState, useEffect } from "react";
import { collection, onSnapshot,} from "firebase/firestore";
import { db } from "../firebase";

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
  

  const [staffs, setStaffs] = useState([]);
  const workingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const openingTime = "09:00";
const closingTime = "18:00";

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      service: selectedService || "",
    }));
  }, [selectedService]);

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (user) => user.role === "STAFF"
        );

      setStaffs(data);
    }
  );

  return () => unsubscribe();
}, []);
const availableTimes = [];

const startHour = parseInt(
  openingTime.split(":")[0]
);

const endHour = parseInt(
  closingTime.split(":")[0]
);

for (
  let hour = startHour;
  hour <= endHour;
  hour++
) {
  availableTimes.push(
    `${String(hour).padStart(2, "0")}:00`
  );
}
const selectedDay = form.date
  ? new Date(form.date).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    )
  : "";
  console.log("Date:", form.date);
console.log("Day:", selectedDay);

const isOpenDay =
  form.date &&
  workingDays.includes(selectedDay);
  console.log("selectedDay:", selectedDay);

console.log("isOpenDay:", isOpenDay);
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

    const selectedDateTime = new Date(
  `${form.date}T${form.time}`
);

const now = new Date();

if (selectedDateTime < now) {
  alert(
    "You cannot book an appointment in the past."
  );
  
  return;
}
if (!workingDays.includes(selectedDay)) {
  alert(
    `Salon is closed on ${selectedDay}`
  );
  return;
}

if (
  form.time < openingTime ||
  form.time > closingTime
) {
  alert(
    `Available hours are ${openingTime} - ${closingTime}`
  );
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
  min={
    new Date()
      .toISOString()
      .split("T")[0]
  }
  onChange={handleChange}
/>
{form.date && (
  <p
    style={{
      fontSize: "12px",
      marginTop: "5px",
      color:
       workingDays.includes(
  selectedDay
)
         
          ? "green"
          : "red",
    }}
  >
    {workingDays.includes(
  selectedDay
)
      ? `${selectedDay} is available`
      : `${selectedDay} is closed`}
  </p>
)}
<p
  style={{
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
  }}
>
  Open: {workingDays.join(", ")}
</p>
            </div>

            <div className="booking-group">
              <label>Time</label>
            <select
  name="time"
  value={form.time}
  onChange={handleChange}
>
  <option value="">
    Select Time
  </option>

  {isOpenDay &&
  availableTimes.map((time) => {
    const hour = parseInt(
      time.split(":")[0]
    );

    const displayTime =
      hour === 0
        ? "12:00 AM"
        : hour < 12
        ? `${hour}:00 AM`
        : hour === 12
        ? "12:00 PM"
        : `${hour - 12}:00 PM`;

    return (
      <option
        key={time}
        value={time}
      >
        {displayTime}
      </option>
    );
  })}
</select> 
            <p
  style={{
    fontSize: "12px",
    color: "#666",
    marginTop: "5px",
  }}
>
  Available Hours:
  {" "}
  {openingTime}
  {" - "}
  {closingTime}
</p>
            </div>


            <div className="booking-group">
              <label>Preferred Staff</label>
              <select
                name="staff"
                value={form.staff}
                onChange={handleChange}
              >
                <option value="">
  No preference
</option>

{staffs.map((staff) => (
  <option
    key={staff.id}
    value={staff.fullName}
  >
    {staff.fullName}
  </option>
))}
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