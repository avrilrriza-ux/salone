export default function BookingStatus({ bookings, cancelBooking }) {
  return (
    <section>
      <div className="section-heading">
        <p className="eyebrow">Booking Status</p>
        <h2>Track your appointments</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="empty-text">No bookings yet.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking.id}>
              <div>
                <h3>{booking.service}</h3>
                <p>{booking.date} at {booking.time}</p>
                <p>Staff: {booking.staff || "No preference"}</p>
              </div>

              <div>
                <span className={`status ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>

                {booking.status === "Pending" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}