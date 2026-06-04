import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
    deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [approvedStaffs, setApprovedStaffs] = useState([]);
  

  useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "users"),
    (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStaffs(
        users.filter(
          (user) => user.role === "PENDING_STAFF"
        )
      );

      setApprovedStaffs(
        users.filter(
          (user) => user.role === "STAFF"
        )
      );
    }
  );

  return () => unsubscribe();
}, []);
const acceptStaff = async (id) => {
  await updateDoc(
    doc(db, "users", id),
    {
      role: "STAFF",
    }
  );
};

const rejectStaff = async (id) => {
  await updateDoc(
    doc(db, "users", id),
    {
      role: "CUSTOMER",
    }
  );
};

 const deleteStaff = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this staff?"
  );

  if (!confirmed) return;

  await deleteDoc(doc(db, "users", id));
};

  

 return (
  <section className="admin-dashboard-section">
    <div className="section-heading">
      <p className="eyebrow">Admin Dashboard</p>
      <h2>Staff Management</h2>
    </div>

    <div className="stats-grid">
      <div className="stat-card">
        <h3>{staffs.length}</h3>
        <p>Total Staff</p>
      </div>
    </div>

    <div className="admin-table">
      <div style={{ marginBottom: "20px" }}>
       

        
      </div>

       {staffs.length === 0 ? (
  <p className="empty-text">No pending staff applications.</p>
) : (
  <table>
    <thead>
      <tr>
        <th>Staff Name</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {staffs.map((staff) => (
        <tr key={staff.id}>
          <td>{staff.fullName}</td>

          <td>
            <button
              className="accept-btn"
              onClick={() => acceptStaff(staff.id)}
            >
              Accept
            </button>

            <button
              className="decline-btn"
              style={{ marginLeft: "10px" }}
              onClick={() => rejectStaff(staff.id)}
            >
              Reject
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)}
      <h3 style={{ marginTop: "30px" }}>
  Approved Staff
</h3>
{approvedStaffs.length === 0 ? (
  <p>No approved staff yet.</p>
) : (
  <table>
    <thead>
      <tr>
        <th>Staff Name</th>
        <th>Email</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {approvedStaffs.map((staff) => (
        <tr key={staff.id}>
          <td>{staff.fullName}</td>
          <td>{staff.email}</td>

          <td>
            <button
              className="decline-btn"
              onClick={() => deleteStaff(staff.id)}
            >
              Remove Staff
            </button>
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