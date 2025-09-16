import { useState } from "react";


function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });




      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal! Periksa email/password.");
      }


      const data = await response.json();
      onLogin(data);
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="login-container">
      <h2>Login CampusMart</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Masukkan Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Belum punya akun? <a onClick={switchToRegister}>Daftar di sini</a></p>
    </div>
  );
}


export default LoginForm;
