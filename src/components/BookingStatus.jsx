import { useState } from "react";

export default function BookingStatus({ bookings }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const selectedDateString = selectedDate
    .toLocaleDateString("en-CA");

  const filteredBookings = bookings.filter(
    (booking) => booking.date === selectedDateString
  );

  function prevMonth() {
    setCurrentDate(
      new Date(currentYear, currentMonth - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(currentYear, currentMonth + 1, 1)
    );
  }

  function getStatusClass(status) {
    return status ? status.toLowerCase() : "pending";
  }

  return (
    <section className="calendar-status-section">
      <div className="calendar-status-wrapper">
        {/* LEFT SIDE */}
        <div className="calendar-panel">
          <p className="calendar-subtitle">
            APPOINTMENTS
          </p>

          <h1 className="calendar-title">
            Booking Calendar
          </h1>

          <div className="calendar-box">
            <div className="calendar-header">
              <button
                className="calendar-nav-btn"
                onClick={prevMonth}
              >
                ←
              </button>

              <h2>
                {monthNames[currentMonth]} {currentYear}
              </h2>

              <button
                className="calendar-nav-btn"
                onClick={nextMonth}
              >
                →
              </button>
            </div>

            <div className="calendar-grid">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div
                  key={day}
                  className="calendar-day"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDay }).map(
                (_, index) => (
                  <div key={`empty-${index}`}></div>
                )
              )}

              {Array.from({ length: daysInMonth }).map(
                (_, index) => {
                  const day = index + 1;

                  const isActive =
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentMonth &&
                    selectedDate.getFullYear() === currentYear;

                  return (
                    <button
                      key={day}
                      className={`calendar-date ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() =>
                        setSelectedDate(
                          new Date(
                            currentYear,
                            currentMonth,
                            day
                          )
                        )
                      }
                    >
                      {day}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="appointments-panel">
          <div className="appointments-header">
            <h2>
              Upcoming Appointments
            </h2>

            <p>
              Selected Date:{" "}
              <span>{selectedDate.toDateString()}</span>
            </p>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-calendar-booking">
              <h3>No bookings for this date</h3>

              <p>
                Your appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="appointment-card"
                >
                  <div className="appointment-time">
                    <h3>{booking.time}</h3>
                    <span>{booking.date}</span>
                  </div>

                  <div className="appointment-details">
                    <h3>{booking.service}</h3>
                    <p>Salon appointment</p>
                    <small>
                      Staff: {booking.staff || "No preference"}
                    </small>
                    
                  </div>

                  <div className="appointment-actions">
                    <span
                      className={`calendar-status-badge ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}