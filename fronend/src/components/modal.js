import React, { useState } from "react";

const ModalEvidencias = ({ isOpen, onClose }) => {
  const [modoLectura, setModoLectura] = useState(false);
  const [evidencia, setEvidencia] = useState({ texto: "", imagen: null });
  const [modoEdicion, setModoEdicion] = useState(false);

  const handleInputChange = (e) => {
    setEvidencia({ ...evidencia, texto: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEvidencia({ ...evidencia, imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardar = () => {
    setModoLectura(true);
  };

  const handleActualizar = () => {
    setModoEdicion(true);
    setModoLectura(false);
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <button onClick={onClose} style={modalStyles.closeButton}>
          ×
        </button>
        {modoLectura ? (
          <div>
            <h3 style={modalStyles.title}>Evidencia</h3>
            <p>{evidencia.texto}</p>
            {evidencia.imagen && (
              <div style={modalStyles.imageContainer}>
                <img
                  src={evidencia.imagen}
                  alt="Evidencia"
                  style={modalStyles.image}
                />
              </div>
            )}
            <button onClick={handleActualizar} style={modalStyles.saveButton}>
              Actualizar
            </button>
          </div>
        ) : (
          <div>
            <h3 style={modalStyles.title}>
              {modoEdicion ? "Editar Evidencia" : "Subir Evidencia"}
            </h3>
            <textarea
              placeholder="Escribe la evidencia aquí..."
              value={evidencia.texto}
              onChange={handleInputChange}
              style={modalStyles.textarea}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={modalStyles.fileInput}
            />
            {evidencia.imagen && (
              <div style={modalStyles.previewContainer}>
                <h4>Vista previa:</h4>
                <img
                  src={evidencia.imagen}
                  alt="Vista previa"
                  style={modalStyles.previewImage}
                />
              </div>
            )}
            <button onClick={handleGuardar} style={modalStyles.saveButton}>
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: "#f0f9f4", // Tonalidad verde muy suave
      padding: "20px",
      borderRadius: "12px",
      width: "30%", // Ancho ajustado al 80% del tamaño de la pantalla
      minHeight: "40px", // Altura mínima
      position: "relative",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      overflowY: "auto", // Añadido para que si el contenido es demasiado largo, pueda hacer scroll
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "transparent",
      border: "none",
      fontSize: "20px",
      cursor: "pointer",
      color: "#3e8e41", // Verde
    },
    saveButton: {
      marginTop: "15px",
      padding: "12px 20px",
      backgroundColor: "#4CAF50", // Verde más intenso
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
      textAlign: "center",
    },
    title: {
      fontSize: "22px",
      color: "#2e7d32", // Verde oscuro
      marginBottom: "15px",
    },
    textarea: {
      width: "100%",
      height: "120px",
      marginBottom: "15px",
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #4CAF50", // Verde claro
      resize: "none",
    },
    fileInput: {
      display: "block",
      marginBottom: "15px",
      padding: "8px",
      borderRadius: "6px",
      backgroundColor: "#f1f1f1",
      border: "1px solid #4CAF50",
    },
    imageContainer: {
      textAlign: "center",
      marginTop: "15px",
    },
    image: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "6px",
      border: "2px solid #4CAF50",
    },
    previewContainer: {
      marginTop: "15px",
    },
    previewImage: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "6px",
      border: "1px solid #4CAF50",
    },
  };
  

export default ModalEvidencias;
