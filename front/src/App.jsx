import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleLogin = (email) => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      setUsuario(email);
    }, 2000);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {cargando ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#f5f0e8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      ) : usuario ? (
        <Dashboard usuario={usuario} onLogout={() => setUsuario(null)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
