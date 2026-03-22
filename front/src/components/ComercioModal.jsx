import { useState } from "react";
import { create } from "../services/comercioService";

function ComercioModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    rubro: "",
    direccion: "",
    email: "",
    activo: true,
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.rut) {
      setError("Nombre y RUT son obligatorios");
      return;
    }
    setCargando(true);
    try {
      await create(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError("Error al guardar el comercio");
    }
    setCargando(false);
  };

  const fields = [
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Supermercado El Faro",
      required: true,
    },
    { name: "rut", label: "RUT", placeholder: "210050030016", required: true },
    { name: "rubro", label: "Rubro", placeholder: "Supermercado" },
    {
      name: "direccion",
      label: "Dirección",
      placeholder: "Av. 18 de Julio 1234",
    },
    { name: "email", label: "Email", placeholder: "contacto@comercio.com.uy" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "32px",
          width: "480px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#1a1a1a",
              }}
            >
              Nuevo comercio
            </h2>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#aaa" }}>
              Completá los datos del comercio
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f0f0f0",
              border: "none",
              borderRadius: "8px",
              width: "32px",
              height: "32px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {fields.map(({ name, label, placeholder, required }) => (
            <div
              key={name}
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {label}{" "}
                {required && <span style={{ color: "#f5c842" }}>*</span>}
              </label>
              <input
                name={name}
                type={name === "email" ? "email" : "text"}
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  border: "1.5px solid #ebebeb",
                  padding: "0 14px",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#1a1a1a",
                  outline: "none",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => (e.target.style.border = "1.5px solid #1a1a1a")}
                onBlur={(e) => (e.target.style.border = "1.5px solid #ebebeb")}
              />
            </div>
          ))}

          {error && (
            <p style={{ color: "#cc4444", fontSize: "13px", margin: 0 }}>
              {error}
            </p>
          )}

          {/* Botones */}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                height: "44px",
                backgroundColor: "#f5f5f5",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#888",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              style={{
                flex: 1,
                height: "44px",
                backgroundColor: "#1a1a1a",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {cargando ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComercioModal;
