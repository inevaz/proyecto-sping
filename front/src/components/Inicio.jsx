import { Users, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import Button from "./Button";

/**
 * Vista principal del dashboard — muestra métricas generales y un preview de los últimos comercios.
 * No hace fetch propio, recibe los datos ya cargados desde Dashboard.
 * Props:
 * - comercios: array completo de comercios
 * - onVerTodos: función para navegar a la vista de Comercios
 */
function Inicio({ comercios, onVerTodos }) {

  // Calculados a partir del array — se actualizan automáticamente cuando cambian los comercios
  const activos = comercios.filter((c) => c.activo).length;
  const inactivos = comercios.filter((c) => !c.activo).length;

  return (
    <div>
      <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#1a1a1a", margin: "0 0 4px 0" }}>
        Bienvenido/a
      </h1>
      <p style={{ color: "#888", fontSize: "15px", marginBottom: "32px" }}>
        Métricas del sistema de comercios afiliados
      </p>

      {/**
       * Cards de métricas — definidas como array para renderizarlas con un map.
       * Cada card tiene su propio color de fondo, valor e ícono decorativo.
       */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total comercios", value: comercios.length, color: "#f5c842", icon: <Users size={20} /> },
          { label: "Activos", value: activos, color: "#a8e6a3", icon: <CheckCircle size={20} /> },
          { label: "Inactivos", value: inactivos, color: "#ffb3b3", icon: <XCircle size={20} /> },
          { label: "Última carga", value: "Hoy", color: "#b3d4ff", icon: <TrendingUp size={20} /> },
        ].map(({ label, value, color, icon }) => (
          <div
            key={label}
            style={{ backgroundColor: color, borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
          >
            <div style={{ fontSize: "36px", fontWeight: "800", color: "#1a1a1a", marginBottom: "4px" }}>
              {value}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "rgba(0,0,0,0.6)" }}>
              {label}
            </div>
            {/* Ícono decorativo en la esquina inferior derecha — opacity baja para que no compita con el número */}
            <div style={{ position: "absolute", bottom: "16px", right: "16px", opacity: 0.3 }}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Preview de los últimos 5 comercios — para ver todos hay que ir a la vista Comercios */}
      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a1a", margin: 0 }}>
            Últimos comercios
          </h2>
          <Button text="Ver todos" onClick={onVerTodos} />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Nombre", "RUT", "Rubro", "Estado"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "12px", color: "#aaa", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* slice(0, 5) muestra solo los primeros 5 comercios — es un preview, no la lista completa */}
            {comercios.slice(0, 5).map((c) => (
              <tr key={c.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                <td style={{ padding: "12px", fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{c.nombre}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#888", fontFamily: "monospace" }}>{c.rut}</td>
                <td style={{ padding: "12px", fontSize: "13px", color: "#888" }}>{c.rubro}</td>
                <td style={{ padding: "12px" }}>
                  {/* Badge de estado — color cambia según si el comercio está activo o no */}
                  <span style={{ backgroundColor: c.activo ? "#a8e6a3" : "#ffb3b3", color: c.activo ? "#1a6b1a" : "#8b0000", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>
                    {c.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inicio;