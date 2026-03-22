import { useState } from "react";

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
  // Contenedor Horizontal Bento
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
  // Columna Izquierda
  leftSide: {
    flex: 1,
    backgroundColor: "#ffb3b3", 
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "50px",
    position: "relative",
  },
  // Columna Derecha
  rightSide: {
    flex: 1.2,
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
  logo: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "40px",
    letterSpacing: "-0.8px",
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
  inputFocus: {
    backgroundColor: "#fff",
    borderColor: "#ffb3b3", // Acento con tu nuevo color
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
  // Decoración orgánica
  circleDecoration: {
    position: "absolute",
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Blanco traslúcido sobre el rosa
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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.endsWith("@proyecto.com")) {
      setError("El email debe ser @proyecto.com");
      return;
    }
    onLogin(email);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.mainContainer}>
        <div style={styles.leftSide}>
          <div style={styles.circleDecoration} />
          <div style={styles.welcomeText}>
            Gestiona <br /> todo en <br /> un lugar.
          </div>
        </div>

        <div style={styles.rightSide}>
          <img
            src="/src/assets/proyecto2.png"
            alt="Logo"
            style={{
              height: "45px",
              objectFit: "contain",
              marginBottom: "40px",
            }}
          />

          <form onSubmit={handleSubmit}>
            <div style={styles.inputWrapper}>
              <label style={styles.label}>Email</label>
              <input
                style={{
                  ...styles.input,
                  ...(emailFocused ? styles.inputFocus : {}),
                }}
                type="email"
                placeholder="usuario@proyecto.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
              />
            </div>

            <div style={styles.inputWrapper}>
              <label style={styles.label}>Contraseña</label>
              <input
                style={{
                  ...styles.input,
                  ...(passwordFocused ? styles.inputFocus : {}),
                }}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#ff4444",
                  marginBottom: "15px",
                  paddingLeft: "18px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(buttonHovered ? styles.buttonHover : {}),
              }}
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
