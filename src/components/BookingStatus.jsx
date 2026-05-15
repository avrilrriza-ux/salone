import { useState } from "react";

export default function BookingStatus({
  bookings,
  cancelBooking,
}) {
  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const currentMonth =
    currentDate.getMonth();

  const currentYear =
    currentDate.getFullYear();

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

  function prevMonth() {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(
        currentYear,
        currentMonth + 1,
        1
      )
    );
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

            {/* MONTH HEADER */}
            <div className="calendar-header">

              <button
                className="calendar-nav-btn"
                onClick={prevMonth}
              >
                ←
              </button>

              <h2>
                {monthNames[currentMonth]}{" "}
                {currentYear}
              </h2>

              <button
                className="calendar-nav-btn"
                onClick={nextMonth}
              >
                →
              </button>

            </div>

            {/* DAYS */}
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

              {/* EMPTY SPACES */}
              {Array.from({
                length: firstDay,
              }).map((_, index) => (
                <div key={index}></div>
              ))}

              {/* DATES */}
              {Array.from({
                length: daysInMonth,
              }).map((_, index) => {
                const day = index + 1;

                const isActive =
                  selectedDate.getDate() ===
                    day &&
                  selectedDate.getMonth() ===
                    currentMonth &&
                  selectedDate.getFullYear() ===
                    currentYear;

                return (
                  <button
                    key={day}
                    className={`calendar-date ${
                      isActive
                        ? "active"
                        : ""
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
              })}

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
              Selected Date:
              {" "}
              {selectedDate.toDateString()}
            </p>

          </div>

          {bookings.length === 0 ? (
            <div className="empty-calendar-booking">

              <h3>No bookings yet</h3>

              <p>
                Your appointments will
                appear here.
              </p>

            </div>
          ) : (
            <div className="appointments-list">

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="appointment-card"
                >

                  <div className="appointment-time">

                    <h3>{booking.time}</h3>

                    <span>
                      {booking.date}
                    </span>

                  </div>

                  <div className="appointment-details">

                    <h3>
                      {booking.service}
                    </h3>

                    <p>
                      Salon appointment
                    </p>

                  </div>

                  <div className="appointment-actions">

                    <span
                      className={`calendar-status-badge ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>

                    {booking.status !==
                      "Cancelled" && (
                      <button
                        className="calendar-cancel-btn"
                        onClick={() =>
                          cancelBooking(
                            booking.id
                          )
                        }
                      >
                        Cancel
                      </button>
                    )}

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