import { useState, useEffect } from "react";
import { getAll, remove } from "../services/comercioService";
import { LayoutDashboard, Store, Upload, LogOut } from "lucide-react";
import Inicio from "./Inicio";
import Comercios from "./Comercios";
import ExcelUpload from "./ExcelUpload";

/**
 * Componente raíz del sistema una vez logueado.
 * Es el orquestador principal — contiene el estado global de comercios,
 * maneja la navegación entre vistas y pasa los datos a los componentes hijos.
 * Props:
 * - usuario: email del usuario logueado (para mostrar en la sidebar)
 * - onLogout: función para volver a la pantalla de login
 */
function Dashboard({ usuario, onLogout }) {

  const [comercios, setComercios] = useState([]); // Lista de comercios traída del backend
  const [loading, setLoading] = useState(true);   // Controla el estado de carga de la tabla
  const [vista, setVista] = useState("inicio");   // Determina qué componente se renderiza en el contenido

  /**
   * Trae todos los comercios del backend y actualiza el estado.
   * Es async porque espera la respuesta de la API antes de continuar.
   * Se llama al montar el componente y cada vez que se crea, edita o elimina un comercio.
   */
  const cargarComercios = async () => {
    setLoading(true);
    const data = await getAll();
    setComercios(data);
    setLoading(false);
  };

  // useEffect con array vacío [] — se ejecuta solo una vez al montar el componente (equivalente a componentDidMount)
  useEffect(() => {
    cargarComercios();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este comercio?")) {
      await remove(id);
      cargarComercios(); // Recarga la lista para reflejar el cambio
    }
  };

  // Definición de los ítems del nav como array — permite renderizarlos dinámicamente con un map
  const navItems = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard },
    { id: "comercios", label: "Comercios", icon: Store },
    { id: "excel", label: "Cargar Excel", icon: Upload },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', sans-serif", backgroundColor: "#f5f0e8", gap: "16px" }}>

      {/* SIDEBAR — navegación principal, siempre visible */}
      <div style={{ width: "220px", backgroundColor: "#1a1a1a", display: "flex", flexDirection: "column", padding: "24px 16px", flexShrink: 0, margin: "16px 0 16px 16px", borderRadius: "20px" }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "left", gap: "10px", marginBottom: "45px" }}>
          <img src="/proyecto.png" alt="Logo" style={{ height: "37px", objectFit: "contain" }} />
        </div>

        {/* Items de navegación */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" }}>
            General
          </p>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = vista === id;
            return (
              <button
                key={id}
                onClick={() => setVista(id)} // Cambia la vista al clickear
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "10px", border: "none",
                  cursor: "pointer", fontSize: "14px", fontWeight: "500",
                  // Item activo tiene fondo más claro y texto blanco completo
                  backgroundColor: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                  transition: "all 0.15s", textAlign: "left", width: "100%",
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </div>

        {/* Footer de la sidebar — muestra el usuario logueado y el botón de cerrar sesión */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
          {/* textOverflow ellipsis trunca el email si es muy largo */}
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", paddingLeft: "8px", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {usuario}
          </p>
          <button
            onClick={onLogout}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500", backgroundColor: "transparent", color: "rgba(255,255,255,0.5)", width: "100%", transition: "all 0.15s" }}
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO — renderiza el componente correspondiente según la vista activa */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 40px 40px 0" }}>

        {/* Renderizado condicional — solo se monta el componente de la vista activa */}
        {vista === "inicio" && (
          <Inicio
            comercios={comercios}
            onVerTodos={() => setVista("comercios")}
          />
        )}
        {vista === "comercios" && (
          <Comercios
            comercios={comercios}
            loading={loading}
            onDelete={handleDelete}
            onCargarExcel={() => setVista("excel")}
            onRefresh={cargarComercios}
          />
        )}
        {vista === "excel" && (
          <ExcelUpload onUploadSuccess={cargarComercios} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;