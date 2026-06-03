import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] =useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "services"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServices(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const addService = async () => {
    if (!serviceName.trim()) return;

    await addDoc(collection(db, "services"), {
  name: serviceName,
  price: servicePrice,
   description: serviceDescription,
  active: true,
});

    setServiceName("");
    setServicePrice("");
setServiceDescription("");
  };

  const updatePrice = async (id, currentPrice) => {
  const newPrice = prompt(
    "Enter new price:",
    currentPrice
  );

  if (!newPrice) return;

  await updateDoc(
    doc(db, "services", id),
    {
      price: Number(newPrice),
    }
  );
};

const deleteService = async (id) => {
  await deleteDoc(doc(db, "services", id));
};

  return (
  <section className="admin-dashboard-section">
    <div className="section-heading">
      <p className="eyebrow">Admin Dashboard</p>
      <h2>Service Management</h2>
    </div>

    <div className="admin-table">
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Service Name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />
        <input
  type="number"
  placeholder="Price"
  value={servicePrice}
  onChange={(e) => setServicePrice(e.target.value)}
/>

 <input
  type="text"
  placeholder="Service Descrition"
 value={serviceDescription}
  onChange={(e) =>
    setServiceDescription(e.target.value)
  }
/>

        <button
          className="accept-btn"
          onClick={addService}
          style={{ marginLeft: "10px" }}
        >
          Add Service
        </button>
      </div>

      <table>
        <thead>
  <tr>
    <th>Service</th>
    <th>Price</th>
    <th>Description</th>
    <th>Action</th>
  </tr>
</thead>

        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
  <td>{service.name}</td>
  <td>₱{service.price || 0}</td>
  <td>{service.description}</td>
  <td>
  <button
    className="accept-btn"
    onClick={() =>
      updatePrice(
        service.id,
        service.price
      )
    }
  >
    Edit Price
  </button>

  <button
    className="decline-btn"
    style={{ marginLeft: "10px" }}
    onClick={() => deleteService(service.id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
}
