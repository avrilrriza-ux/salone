import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import ServiceCard from "./components/ServiceCard";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";

import salonBg from "./assets/salon.png";

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
  const [selectedService, setSelectedService] =
    useState("");

  const services = [
    {
      name: "Haircut & Styling",
      price: 250,
      duration: "45 mins",
      image: haircutImg,
      icon: "✂️",
    },
    {
      name: "Hair Color",
      price: 1200,
      duration: "2 hrs",
      image: haircolorImg,
      icon: "🎨",
    },
    {
      name: "Manicure",
      price: 300,
      duration: "40 mins",
      image: manicureImg,
      icon: "💅",
    },
    {
      name: "Pedicure",
      price: 350,
      duration: "45 mins",
      image: pedicureImg,
      icon: "🦶",
    },
    {
      name: "Hair Treatment",
      price: 800,
      duration: "1 hr",
      image: treatmentImg,
      icon: "💧",
    },
  ];

  useEffect(() => {
    const savedUser =
      localStorage.getItem("currentUser");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      setCurrentUser(parsedUser);
      setUserRole(parsedUser.role);
      setPage("home");
    }
  }, []);

  function login(username, password) {
    // ADMIN LOGIN
    if (
      username === "salone" &&
      password === "1234567"
    ) {
      const adminUser = {
        username: "salone",
        role: "admin",
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(adminUser)
      );

      setCurrentUser(adminUser);
      setUserRole("admin");
      setPage("home");

      return true;
    }

    // CUSTOMER LOGIN
    const users =
      JSON.parse(localStorage.getItem("users")) ||
      [];

    const foundUser = users.find(
      (user) =>
        user.username === username &&
        user.password === password
    );

    if (foundUser) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify(foundUser)
      );

      setCurrentUser(foundUser);
      setUserRole("customer");
      setPage("home");

      return true;
    }

    return false;
  }

  function register(userData) {
    const users =
      JSON.parse(localStorage.getItem("users")) ||
      [];

    users.push({
      ...userData,
      role: "customer",
    });

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

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
    setBookings([
      ...bookings,
      {
        id: Date.now(),
        ...newBooking,
        status: "Pending",
      },
    ]);

    setPage("status");
  }

  function updateStatus(id, status) {
    setBookings(
      bookings.map((booking) =>
        booking.id === id
          ? { ...booking, status }
          : booking
      )
    );
  }

  function cancelBooking(id) {
    updateStatus(id, "Cancelled");
  }

  // LOGIN / REGISTER
  if (!currentUser) {
    return (
      <div className="auth-wrapper">
        {page === "login" ? (
          <Login
            login={login}
            setPage={setPage}
          />
        ) : (
          <Register
            register={register}
            setPage={setPage}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar
        setPage={setPage}
        userRole={userRole}
        logout={logout}
      />

      <main className="main-content">

        {/* HOME PAGE */}
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
                background:
                  "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter:
                  "blur(12px)",
                border:
                  "2px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "20px",
              }}
            >
              <p className="eyebrow">
                Welcome to Saloné
              </p>

              <h1>
                Beauty appointments made
                effortless.
              </h1>

              <p>
                Luxury salon appointment
                booking and customer management
                system.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  userRole === "admin"
                    ? setPage("admin")
                    : setPage("services")
                }
              >
                {userRole === "admin"
                  ? "Open Admin Dashboard"
                  : "Book Appointment"}
              </button>
            </div>
          </section>
        )}

        {/* SERVICES PAGE */}
        {page === "services" && (
          <section className="services-section">
            <div className="section-heading">
              <p className="eyebrow">
          
              </p>

              <h2>SERVICES</h2>

              <p className="services-subtitle">
                Pamper yourself with our
                professional salon services
                designed to make you look and
                feel your best.
              </p>
            </div>

            <div className="service-grid">
              {services.map(
                (service, index) => (
                  <ServiceCard
                    key={index}
                    service={service}
                    onBook={() => {
                      setSelectedService(
                        service.name
                      );
                      setPage("booking");
                    }}
                  />
                )
              )}
            </div>

            {/* FEATURES */}
            <div className="features">
              <div className="feature-item">
                <span>📅</span>

                <div>
                  <h4>Easy Booking</h4>

                  <p>
                    Book your appointment in
                    just a few clicks
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <span>🛡️</span>

                <div>
                  <h4>
                    Trusted Professionals
                  </h4>

                  <p>
                    Experienced and certified
                    salon experts
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <span>🌿</span>

                <div>
                  <h4>Premium Products</h4>

                  <p>
                    We use high-quality
                    products for the best
                    results
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BOOKING PAGE */}
        {page === "booking" && (
          <BookingForm
            services={services}
            addBooking={addBooking}
            selectedService={selectedService}
          />
        )}

        {/* STATUS PAGE */}
        {page === "status" && (
          <BookingStatus
            bookings={bookings}
            cancelBooking={cancelBooking}
          />
        )}

        {/* ADMIN PAGE */}
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