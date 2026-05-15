import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ServiceCard from "./components/ServiceCard";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";
import salonBg from "./assets/salon.png";
import book from "./assets/book.jpg";
import haircutImg from "./assets/hair and styling.png";
import haircolorImg from "./assets/Haircolor.png";
import manicureImg from "./assets/Manicure.png";
import pedicureImg from "./assets/Pedicure.png";
import treatmentImg from "./assets/Hair treatment.png";

export default function App() {
  const [page, setPage] = useState("login");
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  const services = [
    { name: "Haircut & Styling", price: 250,  duration: "45 mins", image: haircutImg },
    { name: "Hair Color",        price: 1200, duration: "2 hrs",   image: haircolorImg },
    { name: "Manicure",          price: 300,  duration: "40 mins", image: manicureImg },
    { name: "Pedicure",          price: 350,  duration: "45 mins", image: pedicureImg },
    { name: "Hair Treatment",    price: 800,  duration: "1 hr",    image: treatmentImg },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setUserRole(parsedUser.role);
      setPage("home");
    }
  }, []);

  function login(username, password) {
    if (username === "salone" && password === "1234567") {
      const adminUser = { username: "salone", role: "admin" };
      localStorage.setItem("currentUser", JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setUserRole("admin");
      setPage("home");
      return true;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      setUserRole("customer");
      setPage("home");
      return true;
    }

    return false;
  }

  function register(userData) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push({ ...userData, role: "customer" });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created successfully!");
    setPage("login");
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setUserRole("");
    setPage("login");
  }

  function addBooking(newBooking) {
    setBookings([...bookings, { id: Date.now(), ...newBooking, status: "Pending" }]);
    setPage("status");
  }

  function updateStatus(id, status) {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  function cancelBooking(id) {
    updateStatus(id, "Cancelled");
  }

  /*  AUTH SCREENS */
  if (!currentUser) {
    return (
      <div
        className="auth-wrapper"
        style={{
          backgroundImage: `url(${salonBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {page === "login" ? (
          <Login login={login} setPage={setPage} />
        ) : (
          <Register register={register} setPage={setPage} />
        )}
      </div>
    );
  }

  /* MAIN APP */
  return (
    <div className="app">
      <Navbar setPage={setPage} userRole={userRole} logout={logout} />

      <main className="main-content">

        {/* HOME */}
        {page === "home" && (
          <section
            className="hero"
            style={{
              backgroundImage: `url(${salonBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div
              className="hero-card"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: "20px",
              }}
            >
              <p className="eyebrow">Welcome to Saloné</p>

              <h1>Beauty appointments made effortless.</h1>

              <p>
                Luxury salon appointment booking and customer management system.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  setPage(userRole === "admin" ? "admin" : "services")
                }
              >
                {userRole === "admin" ? "Open Admin Dashboard" : "Book Appointment"}
              </button>
            </div>
          </section>
        )}

        {/* SERVICES */}
        {page === "services" && (
          <section className="services-section">
            <div className="section-heading">
              <div className="eyebrow">Our Offerings</div>
              <h2>SERVICES</h2>
              <p className="services-subtitle">
                Pamper yourself with our professional salon services designed to
                make you look and feel your best.
              </p>
              <div className="services-divider">crafted with care</div>
            </div>

            <div className="service-grid">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  service={service}
                  onBook={() => {
                    setSelectedService(service.name);
                    setPage("booking");
                  }}
                />
              ))}
            </div>

            <div className="features">
              <div className="feature-item">
                <div>
                  <h4>Easy Booking</h4>
                  <p>Book your appointment in just a few clicks</p>
                </div>
              </div>
              <div className="feature-item">
                <div>
                  <h4>Trusted Professionals</h4>
                  <p>Experienced and certified salon experts</p>
                </div>
              </div>
              <div className="feature-item">
                <div>
                  <h4>Premium Products</h4>
                  <p>We use high-quality products for the best results</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BOOKING */}
        {page === "booking" && (
          <section className="booking-section">
            <div className="booking-wrapper">
              <div className="booking-left">
                <img
                  src={book}
                  alt="Salon Booking"
                  className="booking-side-image"
                />
              </div>

              <div className="booking-right">
                <div className="booking-top">
                  <p className="booking-subtitle">RESERVE YOUR VISIT</p>
                  <h2 className="booking-main-title">
                    Schedule your salon visit
                  </h2>
                </div>

                <BookingForm
                  services={services}
                  addBooking={addBooking}
                  selectedService={selectedService}
                />
              </div>
            </div>
          </section>
        )}

        {/* STATUS */}
        {page === "status" && (
          <BookingStatus
            bookings={bookings}
            cancelBooking={cancelBooking}
          />
        )}

        {/* ADMIN */}
        {page === "admin" && (
          <AdminPanel
            bookings={bookings}
            updateStatus={updateStatus}
          />
        )}

      </main>
    </div>
  );
}
