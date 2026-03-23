import { useState } from "react";

/**
 * Pantalla de login — primera vista que ve el usuario.
 * Valida que el email sea del dominio corporativo antes de permitir el acceso.
 * No verifica contraseña — es una validación figurativa para el MVP.
 * Props:
 * - onLogin: función que recibe el email y activa la pantalla de carga antes del Dashboard
 */

// Estilos definidos fuera del componente para no recrearlos en cada render
const styles = {
  wrapper: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f9f6f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  // Contenedor split — lado izquierdo decorativo, lado derecho con el form
  mainContainer: {
    position: "relative",
    zIndex: 1,
    width: "90%",
    maxWidth: "850px",
    height: "480px",
    backgroundColor: "white",
    borderRadius: "40px",
    display: "flex",
    overflow: "hidden",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.12)",
  },
  leftSide: {
    flex: 1,
    backgroundColor: "#ffb3b3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px",
    position: "relative",
  },
  rightSide: {
    flex: 1.2, // Ligeramente más ancho que el lado izquierdo para el formulario
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px",
  },
  welcomeText: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#1a1a1a",
    lineHeight: "1",
    zIndex: 2,
    letterSpacing: "-1.5px",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: "16px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: "8px",
    display: "block",
    marginLeft: "18px",
  },
  input: {
    width: "100%",
    height: "56px",
    backgroundColor: "#f3f3f1",
    border: "2.5px solid transparent",
    borderRadius: "24px",
    padding: "0 22px",
    fontSize: "15px",
    fontWeight: "500",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.25s ease",
  },
  // Se aplica cuando el input tiene foco — reemplaza el fondo gris por blanco con borde rosa
  inputFocus: {
    backgroundColor: "#fff",
    borderColor: "#ffb3b3",
    boxShadow: "0 8px 20px rgba(255, 179, 179, 0.25)",
  },
  button: {
    marginTop: "12px",
    width: "100%",
    height: "56px",
    backgroundColor: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: "24px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#333",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  // Círculo decorativo en la esquina del lado rosa — puramente visual
  circleDecoration: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    top: "-60px",
    right: "-40px",
  },
  hint: {
    fontSize: "13px",
    color: "#bbb",
    textAlign: "center",
    marginTop: "25px",
  },
};

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Estados de foco para aplicar el estilo inputFocus a cada campo por separado
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que el form recargue la página
    // Única validación real: el dominio del email debe ser corporativo
    if (!email.endsWith("@proyecto.com")) {
      setError("El email debe ser @proyecto.com");
      return;
    }
    onLogin(email); // Pasa el email al App.jsx que activa el loader y luego el Dashboard
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.mainContainer}>

        {/* Lado izquierdo — decorativo, sin interacción */}
        <div style={styles.leftSide}>
          <div style={styles.circleDecoration} />
          <div style={styles.welcomeText}>
            Gestiona <br /> todo en <br /> un lugar.
          </div>
        </div>

        {/* Lado derecho — formulario de login */}
        <div style={styles.rightSide}>
          <img
            src="/proyecto2.png"
            alt="Logo"
            style={{ height: "45px", objectFit: "contain", marginBottom: "40px" }}
          />

          <form onSubmit={handleSubmit}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Email</label>
              <input
                style={{ ...styles.input, ...(emailFocused ? styles.inputFocus : {}) }}
                type="email"
                placeholder="usuario@proyecto.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Contraseña</label>
              <input
                style={{ ...styles.input, ...(passwordFocused ? styles.inputFocus : {}) }}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
            </div>

            {/* Error visible solo cuando el dominio del email no es el correcto */}
            {error && (
              <p style={{ fontSize: "12px", color: "#ff4444", marginBottom: "15px", paddingLeft: "18px" }}>
                {error}
              </p>
            )}

            {/* spread operator combina el estilo base con el hover si corresponde */}
            <button
              type="submit"
              style={{ ...styles.button, ...(buttonHovered ? styles.buttonHover : {}) }}
              onMouseEnter={() => setButtonHovered(true)}
              onMouseLeave={() => setButtonHovered(false)}
            >
              Entrar →
            </button>
          </form>

          <p style={styles.hint}>
            (Usuario con email @proyecto.com, contraseña random)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;