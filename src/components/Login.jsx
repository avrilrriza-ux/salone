import { useState } from "react";

export default function Login({ login, setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const success = login(username, password);

    if (!success) {
      alert("Invalid username or password.");
    }
  }

  return (
    <div className="auth-card">
      <p className="eyebrow">Saloné</p>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="primary-btn">
          Login
        </button>
      </form>

      <p className="switch-text">
        No account yet?
      </p>

      <button
        className="switch-btn"
        onClick={() => setPage("register")}
      >
        Create Account
      </button>
    </div>
  );
}