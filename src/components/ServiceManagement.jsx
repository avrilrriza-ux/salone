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
  const [serviceDuration, setServiceDuration] = useState("");

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
  price: Number(servicePrice),
  description: serviceDescription,
  duration: serviceDuration,
  active: true,
});

    setServiceName("");
    setServicePrice("");
    setServiceDuration("");
setServiceDescription("");
  };

  const editService = async (service) => {
  const newName = prompt(
    "Enter service name:",
    service.name
  );

  if (newName === null) return;

  const newPrice = prompt(
    "Enter price:",
    service.price
  );

  if (newPrice === null) return;

  const newDuration = prompt(
    "Enter duration:",
    service.duration
  );

  if (newDuration === null) return;

  const newDescription = prompt(
    "Enter description:",
    service.description
  );

  if (newDescription === null) return;

  await updateDoc(
    doc(db, "services", service.id),
    {
      name: newName,
      price: Number(newPrice),
      duration: newDuration,
      description: newDescription,
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
  placeholder="Duration"
  value={serviceDuration}
  onChange={(e) =>
    setServiceDuration(e.target.value)
  }
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
    <th>Duration</th>
    <th>Description</th>
    <th>Action</th>
  </tr>
</thead>

        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
  <td>{service.name}</td>
  <td>₱{service.price || 0}</td>
  <td>{service.duration}</td>
  <td>{service.description}</td>
  <td>
 <button
  className="accept-btn"
  onClick={() => editService(service)}
>
  Edit Service
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
