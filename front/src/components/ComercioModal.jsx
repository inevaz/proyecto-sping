import { useState } from "react";
import { create } from "../services/comercioService";

//componente para crear un nuevo comercio
//recibe dos props:
// - onClose: función para cerrar el modal
// - onSuccess: función que se ejecuta después de guardar exitosamente (refresca la tabla)

function ComercioModal({ onClose, onSuccess }) {
  //state del form: un objeto con todos los campos inicializados vacíos
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    rubro: "",
    direccion: "",
    email: "",
    activo: true, //todo comercio nuevo arranca activo por default
  });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);


   //Maneja los cambios en cualquier input del formulario.
   //[e.target.name] usa el atributo "name" del input como clave dinámica, así un solo handler sirve para todos los campos en vez de tener uno por campo.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); //evita que el form recargue la página al submitear

    //validación front antes de llamar al back 
    if (!form.nombre || !form.rut) {
      setError("Nombre y RUT son obligatorios");
      return;
    }

    setCargando(true);
    try {
      await create(form); //llama al POST /api/comercios con los datos del form
      onSuccess(); //refresca la tabla de comercios en el Dashboard
      onClose(); //cierra el modal
    } catch (err) {
      setError("Error al guardar el comercio");
    }
    setCargando(false);
  };

 
   //def de los campos del formulario como array.
   //permite renderizarlos todos con un solo map en vez de repetir el JSX de cada input
   //required marca los campos obligatorios para mostrar el asterisco amarillo.
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
    //fondo oscuro semitransparente: al clickear fuera del modal se cierra
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
      {/*stopPropagation evita que el click dentro del modal llegue al fondo y lo cierre */}
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

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          {/* renderizado dinámico de los campos usando el array fields */}
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
                type={name === "email" ? "email" : "text"} //solo el campo email usa type="email" para validación nativa del browser
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
            {/* disabled evita doble submit si el usuario hace click rápido */}
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
