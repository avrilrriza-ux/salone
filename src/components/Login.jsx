import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ setPage, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = form.email.trim();
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, form.password);

      if (onLoginSuccess) {
        onLoginSuccess(userCredential.user);
      } else {
        setPage("home");
      }
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">Saloné</p>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
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

        <button className="primary-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="switch-text">No account yet?</p>

      <button
        className="switch-btn"
        onClick={() => setPage("register")}
      >
        Create Account
      </button>
    </div>
  );
}