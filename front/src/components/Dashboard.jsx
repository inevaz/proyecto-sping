import { useState, useEffect } from "react";
import { getAll, remove } from "../services/comercioService";
import { LayoutDashboard, Store, Upload, LogOut } from "lucide-react";
import Inicio from "./Inicio";
import Comercios from "./Comercios";
import ExcelUpload from "./ExcelUpload";

function Dashboard({ usuario, onLogout }) {
  const [comercios, setComercios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState("inicio");

  const cargarComercios = async () => {
    setLoading(true);
    const data = await getAll();
    setComercios(data);
    setLoading(false);
  };

  useEffect(() => {
    cargarComercios();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este comercio?")) {
      await remove(id);
      cargarComercios();
    }
  };

  const navItems = [
    { id: "inicio", label: "Inicio", icon: LayoutDashboard },
    { id: "comercios", label: "Comercios", icon: Store },
    { id: "excel", label: "Cargar Excel", icon: Upload },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        backgroundColor: "#f5f0e8",
        gap: "16px",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          backgroundColor: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          padding: "24px 16px",
          flexShrink: 0,
          margin: "16px 0 16px 16px",
          borderRadius: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "left",
            gap: "10px",
            marginBottom: "45px",
          }}
        >
          <img
            src="/src/assets/proyecto.png"
            alt="Logo"
            style={{ height: "37px", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "0 8px",
              marginBottom: "8px",
            }}
          >
            General
          </p>
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = vista === id;
            return (
              <button
                key={id}
                onClick={() => setVista(id)}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                  color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                  transition: "all 0.15s",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            );
          })}
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "16px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: "12px",
              paddingLeft: "8px",
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {usuario}
          </p>
          <button
            onClick={onLogout}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.5)",
              width: "100%",
              transition: "all 0.15s",
            }}
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{ flex: 1, overflow: "auto", padding: "40px 40px 40px 0" }}>
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
        {vista === "excel" && <ExcelUpload onUploadSuccess={cargarComercios} />}
      </div>
    </div>
  );
}

export default Dashboard;
