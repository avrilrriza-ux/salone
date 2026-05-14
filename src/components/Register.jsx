import { useState } from "react";

export default function Register({
  register,
  setPage,
}) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    register(form);
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">Saloné</p>

      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="primary-btn">
          Register
        </button>
      </form>

      <p className="switch-text">
        Already have an account?
      </p>

      <button
        className="switch-btn"
        onClick={() => setPage("login")}
      >
        Login Here
      </button>
    </div>
  );
}