import { useState, useEffect } from "react";
import { doc,collection, onSnapshot,} from "firebase/firestore";
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
  const [scheduleSettings, setScheduleSettings] =
  useState(null);

  const [staffs, setStaffs] = useState([]);
  

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      service: selectedService || "",
    }));
  }, [selectedService]);
useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(db, "settings", "schedule"),
    (snap) => {
      if (snap.exists()) {
        setScheduleSettings(
          snap.data()
        );
      }
    }
  );

  return () => unsubscribe();
}, []);
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

if (
  scheduleSettings?.openingTime &&
  scheduleSettings?.closingTime
) {
  const startHour = parseInt(
    scheduleSettings.openingTime.split(":")[0]
  );

  const endHour = parseInt(
    scheduleSettings.closingTime.split(":")[0]
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
}
const selectedDay = form.date
  ? new Date(form.date).toLocaleDateString(
      "en-US",
      { weekday: "long" }
    )
  : "";
  console.log("Date:", form.date);
console.log("Day:", selectedDay);
console.log(
  "Working Days:",
  scheduleSettings?.workingDays
);
const isOpenDay =
  form.date &&
  scheduleSettings?.workingDays?.includes(
    selectedDay
  );
  console.log("selectedDay:", selectedDay);
console.log("scheduleSettings:", scheduleSettings);
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
if (scheduleSettings) {
 

  if (
    !scheduleSettings.workingDays?.includes(
      selectedDay
    )
  ) {
    alert(
      `Salon is closed on ${selectedDay}`
    );
    return;
  }

  if (
    form.time <
      scheduleSettings.openingTime ||
    form.time >
      scheduleSettings.closingTime
  ) {
    alert(
      `Available hours are ${scheduleSettings.openingTime} - ${scheduleSettings.closingTime}`
    );

    return;
  }
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
        scheduleSettings?.workingDays?.includes(
          selectedDay
        )
          ? "green"
          : "red",
    }}
  >
    {scheduleSettings?.workingDays?.includes(
      selectedDay
    )
      ? `${selectedDay} is available`
      : `${selectedDay} is closed`}
  </p>
)}
{scheduleSettings && (
  <p
    style={{
      fontSize: "12px",
      color: "#666",
      marginTop: "5px",
    }}
  >
    Open:
    {" "}
    {scheduleSettings.workingDays?.join(", ")}
  </p>
)}
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
  availableTimes.map((time) => (
    <option
      key={time}
      value={time}
    >
      {time}
    </option>
  ))}
</select> 
              {scheduleSettings && (
  <p
    style={{
      fontSize: "12px",
      color: "#666",
      marginTop: "5px",
    }}
  >
    Available Hours:
    {" "}
    {scheduleSettings.openingTime}
    {" - "}
    {scheduleSettings.closingTime}
  </p>
)}
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