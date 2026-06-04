export default function Navbar({
  setPage,
  userRole,
  logout,
}) {
  return (
    <nav className="navbar">
      <div className="logo">
        <span>Saloné</span>
        <small>
          Appointment Booking System
        </small>
      </div>

      <div className="nav-links">
        <button onClick={() => setPage("home")}>
          Home
        </button>

        {userRole === "customer" && (
          <>
            <button
              onClick={() => setPage("services")}
            >
              Services
            </button>

            <button
              onClick={() => setPage("booking")}
            >
              Book
            </button>

            <button
              onClick={() => setPage("status")}
            >
              My Bookings
            </button>
          </>
        )}

       {userRole === "admin" && (
  <>
    <button onClick={() => setPage("admin")}>
      Bookings
    </button>

    <button onClick={() => setPage("service-management")}>
      Services
    </button>

    <button onClick={() => setPage("staff-management")}>
      Staff
    </button>

    <button onClick={() => setPage("schedule-management")}>
      Schedules
    </button>
  </>
)}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}