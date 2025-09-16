import { useState } from "react";


function RegisterForm({ onRegister, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
        });




      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registrasi gagal!");
      }


      const data = await response.json();
      onRegister(data);
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="register-container">
      <h2>Daftar Akun</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Sudah punya akun? <a onClick={switchToLogin}>Login di sini</a></p>
    </div>
  );
}


export default RegisterForm;