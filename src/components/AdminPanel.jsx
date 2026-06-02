export default function AdminPanel({ bookings, updateStatus }) {
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const ongoing = bookings.filter((b) => b.status === "Ongoing").length;
  const completed = bookings.filter((b) => b.status === "Completed").length;

  function getStatusClass(status) {
    return status ? status.toLowerCase() : "pending";
  }

  return (
    <section className="admin-dashboard-section">
      <div className="section-heading">
        <p className="eyebrow">Admin Dashboard</p>
        <h2>Manage salon operations</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>

        <div className="stat-card">
          <h3>{pending}</h3>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h3>{confirmed}</h3>
          <p>Confirmed</p>
        </div>

        <div className="stat-card">
          <h3>{ongoing}</h3>
          <p>Ongoing</p>
        </div>

        <div className="stat-card">
          <h3>{completed}</h3>
          <p>Completed</p>
        </div>
      </div>

      <div className="admin-table">
        <h3>Appointment Schedule</h3>

        {bookings.length === 0 ? (
          <p className="empty-text">No appointments yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Staff</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.customerName}</td>
                  <td>{booking.service}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.staff || "No preference"}</td>

                  <td>
                    {booking.status === "Pending" ? (
                      <div className="admin-actions">
                        <button
                          className="accept-btn"
                          onClick={() =>
                            updateStatus(booking.id, "Confirmed")
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="decline-btn"
                          onClick={() =>
                            updateStatus(booking.id, "Declined")
                          }
                        >
                          Decline
                        </button>
                      </div>
                    ) : booking.status === "Confirmed" ? (
                      <select
                        className="status-select"
                        value={booking.status}
                        onChange={(e) =>
                          updateStatus(booking.id, e.target.value)
                        }
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : booking.status === "Ongoing" ? (
                      <select
                        className="status-select"
                        value={booking.status}
                        onChange={(e) =>
                          updateStatus(booking.id, e.target.value)
                        }
                      >
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`admin-status ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}