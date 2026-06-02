import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Register({ setPage }) {
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "CUSTOMER" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = form.email.trim();
      const cleanFullName = form.fullName.trim();

      sessionStorage.setItem("isRegistering", "true");

      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, form.password);

      // Go to login immediately
      setPage("login");
      setLoading(false);

      // Continue saving profile in the background
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        fullName: cleanFullName,
        email: cleanEmail,
        role: form.role,
        createdAt: serverTimestamp(),
      });

      await signOut(auth);
      sessionStorage.removeItem("isRegistering");

      console.log("Account created successfully. User can now login.");
    } catch (error) {
      sessionStorage.removeItem("isRegistering");
      setLoading(false);
      console.error("Register error:", error.code, error.message);
      alert(error.message);
    }
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">Saloné</p>
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="role-select"
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button className="primary-btn" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="switch-text">Already have an account?</p>

      <button
        className="switch-btn"
        onClick={() => setPage("login")}
      >
        Login Here
      </button>
    </div>
  );
}