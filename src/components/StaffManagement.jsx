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

export default function StaffManagement() {
  const [staffs, setStaffs] = useState([]);
  const [staffName, setStaffName] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "staff"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffs(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const addStaff = async () => {
  try {
    if (!staffName.trim()) return;

    await addDoc(collection(db, "staff"), {
      name: staffName,
    });
    

    console.log("Staff added!");

    setStaffName("");
  } catch (error) {
  alert(error.message);
  console.error(error);
}
};
const deleteStaff = async (id) => {
  await deleteDoc(
    doc(db, "staff", id)
  );
};
const editStaff = async (
  id,
  currentName
) => {
  const newName = prompt(
    "Enter new staff name:",
    currentName
  );

  if (!newName) return;

  await updateDoc(
    doc(db, "staff", id),
    {
      name: newName,
    }
  );
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
        <input
          type="text"
          placeholder="Staff Name"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
        />

        <button
          className="accept-btn"
          onClick={addStaff}
          style={{ marginLeft: "10px" }}
        >
          Add Staff
        </button>
      </div>

      {staffs.length === 0 ? (
        <p className="empty-text">No staff added yet.</p>
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
                <td>{staff.name}</td>

                <td>
  <button
    className="accept-btn"
    onClick={() =>
      editStaff(staff.id, staff.name)
    }
  >
    Edit
  </button>

  <button
    className="decline-btn"
    style={{ marginLeft: "10px" }}
    onClick={() => deleteStaff(staff.id)}
  >
    Delete
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