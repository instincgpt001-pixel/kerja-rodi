import { useState } from "react";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginForm onLogin={setUser} />;
  }

  return (
    <>
      <h1>Selamat datang, {user.user.name} 👋</h1>
      <button onClick={() => { 
        localStorage.removeItem("token"); 
        setUser(null); 
      }}>
        Logout
      </button>
      {/* nanti lanjut tampilkan daftar produk */}
    </>
  );
}

export default App;
