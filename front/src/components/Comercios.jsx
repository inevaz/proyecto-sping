import { useState } from "react";
import ComercioModal from "./ComercioModal";
import { Pencil, Trash2 } from "lucide-react";

/**
 * Muestra la tabla completa de comercios con opciones de editar, eliminar y crear nuevos.
 * Recibe los datos ya cargados desde Dashboard — no hace fetch propio.
 * Props:
 * - comercios: array de comercios traído desde el backend
 * - loading: booleano para mostrar estado de carga
 * - onDelete: función para eliminar un comercio por ID
 * - onCargarExcel: función para navegar a la vista de carga masiva
 * - onRefresh: función para recargar la lista después de crear uno nuevo
 */
function Comercios({ comercios, loading, onDelete, onCargarExcel, onRefresh }) {

  // Controla si el modal de "Nuevo comercio" está visible o no
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div>
      {/* Header con título y botones de acción */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1a1a1a", margin: 0 }}>
            Comercios
          </h1>
          {/* Muestra dinámicamente cuántos comercios hay */}
          <p style={{ color: "#888", fontSize: "14px", marginTop: "4px" }}>
            {comercios.length} registrados
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {/* Navega a la vista de carga masiva en vez de abrir un modal */}
          <button
            onClick={onCargarExcel}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#e8e8e8")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ffffff")}
            style={{ backgroundColor: "#ffffff", border: "1.5px solid #e0e0e0", color: "#1a1a1a", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "all 0.2s" }}
          >
            Cargar Excel
          </button>

          {/* Abre el modal para crear un comercio individual */}
          <button
            onClick={() => setMostrarModal(true)}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#333")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a1a1a")}
            style={{ backgroundColor: "#1a1a1a", border: "none", color: "white", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" }}
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Tabla: overflowX permite scroll horizontal en pantallas chicas */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
              {/* Headers generados dinámicamente desde un array */}
              {["Nombre", "RUT", "Rubro", "Dirección", "Email", "Estado", "Acciones"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "14px 16px", fontSize: "12px", color: "#aaa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Renderizado condicional: loading -> vacío -> datos */}
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>
                  Cargando...
                </td>
              </tr>
            ) : comercios.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#aaa" }}>
                  No hay comercios registrados
                </td>
              </tr>
            ) : (
              // Una fila por cada comercio: key obligatorio para que React identifique cada elemento
              comercios.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                  <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{c.nombre}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888", fontFamily: "monospace" }}>{c.rut}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{c.rubro}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{c.direccion}</td>
                  <td style={{ padding: "14px 16px", fontSize: "13px", color: "#888" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px" }}>
                    {/* Color del badge cambia según el estado del comercio */}
                    <span style={{ backgroundColor: c.activo ? "#a8e6a3" : "#ffb3b3", color: c.activo ? "#1a6b1a" : "#8b0000", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {/* Botón editar: todavía sin funcionalidad implementada */}
                      <button style={{ backgroundColor: "#f5f5f5", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Pencil size={14} color="#555" />
                      </button>
                      {/* Botón eliminar: llama a onDelete que viene del Dashboard */}
                      <button
                        onClick={() => onDelete(c.id)}
                        style={{ backgroundColor: "#ffecec", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Trash2 size={14} color="#cc0000" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de nuevo comercio: se renderiza solo cuando mostrarModal es true */}
      {mostrarModal && (
        <ComercioModal
          onClose={() => setMostrarModal(false)}
          onSuccess={() => {
            setMostrarModal(false);
            onRefresh(); // Recarga la lista para mostrar el comercio recién creado
          }}
        />
      )}
    </div>
  );
}

export default Comercios;