
import { useState, useEffect } from "react";
import "./App.css";

import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import ServiceDetails from "./components/ServiceDetails";
import ScheduleManagement from "./components/ScheduleManagement";
import ServiceManagement from "./components/ServiceManagement";
import StaffManagement from "./components/StaffManagement";
import Navbar from "./components/Navbar";
import ServiceCard from "./components/ServiceCard";
import BookingForm from "./components/BookingForm";
import BookingStatus from "./components/BookingStatus";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import Register from "./components/Register";

import salonBg from "./assets/salon.png";
import book from "./assets/book.jpg";

import haircutImg from "./assets/hairandstyling.png";
import haircolorImg from "./assets/Haircolor.png";
import manicureImg from "./assets/Manicure.png";
import pedicureImg from "./assets/Pedicure.png";
import treatmentImg from "./assets/Hair treatment.png";

const imageMap = {
  hairandstyling: haircutImg,
  Haircolor: haircolorImg,
  Manicure: manicureImg,
  Pedicure: pedicureImg,
  Hairtreatment: treatmentImg,
};

export default function App() {
  const [page, setPage] = useState("login");
  const [userRole, setUserRole] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceDetails, setSelectedServiceDetails] =
  useState(null);
  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");

  // REALTIME SERVICES FROM FIRESTORE
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const rawServices = snapshot.docs.map((serviceDoc) => ({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        }));

        const servicesData = rawServices
          .filter(
            (service) =>
              service.active === true || service.active === "true"
          )
          .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
          .map((service) => ({
            ...service,
            image: imageMap[service.imageKey] || book,
          }));

        setServices(servicesData);
        setServicesLoading(false);
        setServicesError("");
      },
      (error) => {
        console.error("Firestore services error:", error);
        setServicesError(error.message);
        setServicesLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // AUTHENTICATION STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data();

            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...data,
            });

            setUserRole(data.role?.toLowerCase() || "customer");
          } else {
            setCurrentUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              role: "CUSTOMER",
            });

            setUserRole("customer");
          }

          setPage("home");
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setCurrentUser(null);
        setUserRole("");
        setBookings([]);
        setPage("login");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // REALTIME BOOKINGS FROM FIRESTORE
  useEffect(() => {
    if (!currentUser || !userRole) return;

    let bookingsQuery;

    if (userRole === "admin") {
      bookingsQuery = collection(db, "bookings");
    } else {
      bookingsQuery = query(
        collection(db, "bookings"),
        where("customerId", "==", currentUser.uid)
      );
    }

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingsData = snapshot.docs.map((bookingDoc) => ({
          id: bookingDoc.id,
          ...bookingDoc.data(),
        }));

        bookingsData.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });

        setBookings(bookingsData);
      },
      (error) => {
        console.error("Firestore bookings error:", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser, userRole]);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserRole("");
      setBookings([]);
      setPage("login");
    } catch (err) {
      console.error(err);
    }
  };

  // SAVE BOOKING TO FIRESTORE
  const addBooking = async (newBooking) => {
    try {
      await addDoc(collection(db, "bookings"), {
        customerId: currentUser.uid,
        customerName:
          newBooking.customerName || currentUser.fullName || currentUser.email,
        customerEmail: currentUser.email,
        service: newBooking.service,
        date: newBooking.date,
        time: newBooking.time,
        staff: newBooking.staff || "No preference",
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      setPage("status");
    } catch (error) {
      console.error("Error adding booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  // ADMIN OR CUSTOMER STATUS UPDATE IN FIRESTORE
  const updateStatus = async (id, status) => {
    try {
      const bookingRef = doc(db, "bookings", id);

      await updateDoc(bookingRef, {
        status: status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking status.");
    }
  };

  const cancelBooking = async (id) => {
    await updateStatus(id, "Cancelled");
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className="auth-wrapper"
        style={{
          backgroundImage: `url(${salonBg})`,
          backgroundSize: "cover",
        }}
      >
        {page === "login" ? (
          <Login
            setPage={setPage}
            onLoginSuccess={(firebaseUser) => {
              setCurrentUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
              });

              setUserRole("customer");
              setPage("home");
            }}
          />
        ) : (
          <Register setPage={setPage} />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar setPage={setPage} userRole={userRole} logout={logout} />

      <main className="main-content">
        {page === "home" && (
          <section
            className="hero"
            style={{
              backgroundImage: `url(${salonBg})`,
            }}
          >
            <div
              className="hero-card"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
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
                {userRole === "admin"
                  ? "Open Admin Dashboard"
                  : "Book Appointment"}
              </button>
              
            </div>
          </section>
          
        )}
        {page === "home" && (
  <section
    id="services-preview"
    className="services-preview"
  >
    <h2>Our Services</h2>

    <div className="service-grid">
      {services.slice(0, 5).map((service) => (
      <ServiceCard
  service={service}
  onBook={() => handleBook(service)}
  onViewDetails={(service) => {
    console.log("clicked");
    console.log(service);

    setSelectedServiceDetails(service);
    setPage("service-details");
  }}
/>

      ))}
    
    </div>
    {selectedServiceDetails && (
  <div>
    <h1>
      {selectedServiceDetails.name}
    </h1>

    <p>
      {selectedServiceDetails.description}
    </p>
  </div>
)}
  </section>
)}

        {page === "services" && (
          <section className="services-section">
            <div className="section-heading">
              <h2>SERVICES</h2>

              <p className="services-subtitle">
                Pamper yourself with our professional salon services designed to
                make you look and feel your best.
              </p>

              <div className="services-divider">
                <span>crafted with care</span>
              </div>
            </div>

            {servicesError ? (
              <p className="services-subtitle">
                Firestore error: {servicesError}
              </p>
            ) : servicesLoading ? (
              <p className="services-subtitle">Loading services...</p>
            ) : services.length === 0 ? (
              <p className="services-subtitle">
                No services found. Open console and check Firestore.
              </p>
            ) : (
              <div className="service-grid">
                {services.map((service) => (
 <ServiceCard
  service={service}
  onBook={() => handleBook(service)}
  onViewDetails={(service) => {
    console.log("clicked");
    console.log(service);

    setSelectedServiceDetails(service);
    setPage("service-details");
  }}
/>
))}
              </div>
            )}
          </section>
        )}
{page === "service-details" &&
  selectedServiceDetails && (
    <section className="services-section">
      <h1>
        {selectedServiceDetails.name}
      </h1>

      <img
        src={selectedServiceDetails.image}
        alt={selectedServiceDetails.name}
        style={{
          maxWidth: "400px",
          width: "100%",
        }}
      />

      <h3>
        ₱{selectedServiceDetails.price}
      </h3>

      <p>
        {selectedServiceDetails.description}
      </p>

      <button
        className="primary-btn"
        onClick={() => {
          setSelectedService(
            selectedServiceDetails.name
          );
          setPage("booking");
        }}
      >
        Book Now
      </button>
    </section>
)}
        {page === "booking" && (
          <BookingForm
            services={services}
            addBooking={addBooking}
            selectedService={selectedService}
            leftImage={book}
          />
        )}

        {page === "status" && (
          <BookingStatus bookings={bookings} cancelBooking={cancelBooking} />
        )}

        {page === "admin" && (
          <AdminPanel bookings={bookings} updateStatus={updateStatus}  setPage={setPage} />
        )}
        {page === "service-management" && (
  <ServiceManagement />
)}

{page === "staff-management" && (
  <StaffManagement />
)}
{page === "schedule-management" && (
  <ScheduleManagement />
)}
      </main>
    </div>
  );
}