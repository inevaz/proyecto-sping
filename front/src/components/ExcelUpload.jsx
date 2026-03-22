import { useState } from "react";
import { uploadExcel } from "../services/comercioService";
import { FolderOpen } from "lucide-react";

function ExcelUpload({ onUploadSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleUpload = async () => {
    if (!archivo) return;
    setCargando(true);
    const res = await uploadExcel(archivo);
    setResultado(res);
    setCargando(false);
    if (res.exitosos > 0) onUploadSuccess();
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "800",
          color: "#1a1a1a",
          margin: "0 0 4px 0",
        }}
      >
        Cargar Excel
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "32px" }}>
        Subí un archivo .xlsx para cargar comercios de forma masiva
      </p>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        {" "}
        {/* Info columnas */}
        <div
          style={{
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "#888",
              margin: "0 0 8px 0",
              fontWeight: "600",
            }}
          >
            Columnas requeridas:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["nombre", "rut", "rubro", "direccion", "email"].map((col) => (
              <span
                key={col}
                style={{
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                }}
              >
                {col}
              </span>
            ))}
          </div>
        </div>
        {/* Input archivo */}
        <div
          style={{
            border: "2px dashed #e0e0e0",
            borderRadius: "12px",
            padding: "48px 32px",
            marginBottom: "20px",
            cursor: "pointer",
            backgroundColor: archivo ? "#f0faf0" : "#fafafa",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          <FolderOpen size={32} color={archivo ? "#1a6b1a" : "#aaa"} />
          <p
            style={{
              color: archivo ? "#1a6b1a" : "#aaa",
              fontSize: "14px",
              margin: 0,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {archivo
              ? archivo.name
              : "Hacé click para seleccionar un archivo .xlsx"}
          </p>
          <input
            id="fileInput"
            type="file"
            accept=".xlsx"
            style={{ display: "none" }}
            onChange={(e) => {
              setArchivo(e.target.files[0]);
              setResultado(null);
            }}
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!archivo || cargando}
          onMouseEnter={(e) => {
            if (archivo && !cargando) e.target.style.backgroundColor = "#333";
          }}
          onMouseLeave={(e) => {
            if (archivo && !cargando)
              e.target.style.backgroundColor = "#1a1a1a";
          }}
          style={{
            backgroundColor: archivo && !cargando ? "#1a1a1a" : "#ccc",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "10px",
            cursor: archivo && !cargando ? "pointer" : "not-allowed",
            fontSize: "14px",
            fontWeight: "600",
            width: "100%",
            transition: "all 0.2s",
          }}
        >
          {cargando ? "Procesando..." : "Subir archivo"}
        </button>
        {/* Resultado */}
        {resultado && (
          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#a8e6a3",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#1a6b1a",
                  }}
                >
                  {resultado.exitosos}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#1a6b1a",
                    fontWeight: "500",
                  }}
                >
                  Cargados
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ffb3b3",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "800",
                    color: "#8b0000",
                  }}
                >
                  {resultado.fallidos}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#8b0000",
                    fontWeight: "500",
                  }}
                >
                  Fallidos
                </div>
              </div>
            </div>

            {resultado.errores?.length > 0 && (
              <div
                style={{
                  backgroundColor: "#fff5f5",
                  border: "1px solid #ffcccc",
                  borderRadius: "10px",
                  padding: "16px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#cc0000",
                    margin: "0 0 8px 0",
                  }}
                >
                  Errores:
                </p>
                {resultado.errores.map((e, i) => (
                  <p
                    key={i}
                    style={{ fontSize: "13px", color: "#888", margin: "4px 0" }}
                  >
                    • {e}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExcelUpload;
