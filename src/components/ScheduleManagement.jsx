import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function ScheduleManagement() {
 
  const [openingTime, setOpeningTime] = useState("09:00");
const [closingTime, setClosingTime] = useState("18:00");
const [maxClients, setMaxClients] = useState(3);
const [workingDays, setWorkingDays] = useState([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

 useEffect(() => {
  const loadSettings = async () => {
    const snap = await getDoc(
      doc(db, "settings", "schedule")
    );

    if (snap.exists()) {
      const data = snap.data();

      setOpeningTime(
        data.openingTime || "09:00"
      );

      setClosingTime(
        data.closingTime || "18:00"
      );

      setMaxClients(
        data.maxClients || 3
      );
      if (data.workingDays) {
  setWorkingDays(data.workingDays);
}
    }
  };

  loadSettings();
}, []);
const toggleDay = (day) => {
  if (workingDays.includes(day)) {
    setWorkingDays(
      workingDays.filter((d) => d !== day)
    );
  } else {
    setWorkingDays([
      ...workingDays,
      day,
    ]);
  }
};

const saveSettings = async () => {
  await setDoc(
    doc(db, "settings", "schedule"),
    {
      openingTime,
      closingTime,
      maxClients: Number(maxClients),
      workingDays,
    }
  );

  alert("Settings saved!");
};

  return (
    <section className="admin-dashboard-section">
      <div className="section-heading">
        <p className="eyebrow">Admin Dashboard</p>
        <h2>Schedule Management</h2>
      </div>

      <div className="admin-table schedule-settings">
        <div className="schedule-form">
        <input
  type="time"
  value={openingTime}
  onChange={(e) =>
    setOpeningTime(e.target.value)
  }
/>

<input
  type="time"
  value={closingTime}
  onChange={(e) =>
    setClosingTime(e.target.value)
  }
/>

        <input
          type="number"
          min="1"
          value={maxClients}
          onChange={(e) =>
            setMaxClients(e.target.value)
          }
        />

       <button
  className="accept-btn"
  onClick={saveSettings}
>
  Save Settings
</button>
</div>

      <div className="schedule-summary">
  <h3>Current Settings</h3>

  <p>
    Opening Time: {openingTime}
  </p>

  <p>
    Closing Time: {closingTime}
  </p>

  <p>
    Max Clients Per Hour: {maxClients}
  </p>
  <p>
  Working Days:
  {" "}
  {workingDays.join(", ")}
</p>
</div>
<div className="working-days-section">
  <h4>Working Days</h4>

  {[
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ].map((day) => (
    <label
      key={day}
      style={{
        marginRight: "15px",
      }}
    >
      <input
        type="checkbox"
        checked={workingDays.includes(day)}
        onChange={() =>
          toggleDay(day)
        }
      />

      {" "}
      {day}
    </label>
  ))}
</div>
      </div>
    </section>
  );
}