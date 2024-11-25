.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8); /* Fondo oscuro semi-transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Asegura que el modal esté por encima de otros elementos */
}

.modal-content {
    background: #e9f5e9; /* Color de fondo verde claro */
    border-radius: 20px; /* Bordes redondeados */
    padding: 30px; /* Padding interno */
    width: 600px; /* Ancho aumentado para el modal */
    max-width: 90%; /* Limita el ancho en pantallas pequeñas */
   
    position: relative; /* Para posicionar el pseudo-elemento */
    overflow: hidden; /* Evita el desbordamiento */
}

.modal-content::before {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    width: 150%;
    height: 100px; /* Altura para el contorno superior */
    background: rgba(0, 128, 0, 0.3); /* Verde claro con transparencia */
    border-radius: 10%; /* Borde superior curvo */
    transform: translateX(-50%); /* Centrar el pseudo-elemento */
    z-index: 0; /* Colocar detrás del contenido */
}

h2 {
    text-align: center;
    color: #333; /* Color del texto del encabezado */
    margin-bottom: 20px;
    z-index: 1; /* Asegura que el texto esté por encima */
    position: relative; /* Para que el z-index funcione */
}

textarea {
    width: 100%;
    height: 100px;
    border-radius: 10px; /* Borde redondeado */
    border: 1px solid #a8d5ba; /* Borde sutil en verde */
    padding: 10px;
    font-size: 14px;
    resize: none; /* Deshabilita el redimensionamiento */
    margin-bottom: 20px; /* Espaciado inferior */
    transition: border 0.3s; /* Transición en el borde */
}

textarea:focus {
    border-color: #4CAF50; /* Cambia el borde al enfocar */
    outline: none; /* Quita el contorno por defecto */
}

input[type="file"] {
    margin-bottom: 20px; /* Espaciado inferior */
}

.custom-button {
    width: 120px; /* Ancho fijo para los botones */
    padding: 10px; /* Añade padding para mayor comodidad */
    margin: 10px; /* Separación entre los botones */
    border: none; /* Sin borde */
    border-radius: 5px; /* Esquinas redondeadas */
    cursor: pointer; /* Cambia el cursor al pasar por encima */
    font-size: 16px; /* Tamaño de fuente */
    font-weight: bold; /* Negrita para el texto */
    color: white; /* Color del texto */
    background: #4CAF50; /* Verde intenso */
    box-shadow: 0 5px 15px rgba(76, 175, 80, 0.5); /* Sombra del botón */
    transition: all 0.3s ease; /* Transición suave para todos los cambios */
}

.custom-button:hover {
    background: #45a049; /* Un verde más oscuro al pasar el cursor */
    box-shadow: 0 8px 20px rgba(76, 175, 80, 0.7); /* Aumenta la sombra */
    transform: translateY(-2px); /* Efecto de elevación al pasar el cursor */
}

/* Estilos para la vista previa de imágenes */
.imagenes-preview {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}

.imagen-item {
    margin: 10px;
    position: relative;
}

.imagen-item img {
    max-width: 150px; /* Ajusta el tamaño de la imagen a un tamaño moderado */
    max-height: 150px; /* Ajusta la altura de la imagen a un tamaño moderado */
    object-fit: cover; /* Mantiene la proporción de las imágenes */
    border: 1px solid #ccc; /* Bordes opcionales para las imágenes */
}

.imagen-item button {
    position: absolute;
    top: 0;
    right: 0;
    background: red; /* Color de fondo para el botón de eliminar */
    color: white;
    border: none;
    cursor: pointer;
}

.evidencia-texto {
    margin-top: 20px; /* Espaciado superior para el texto de evidencia */
}

.mensaje-exito {
    color: green; /* Color del mensaje de éxito */
    font-weight: bold; /* Negrita para el mensaje */
    margin-top: 10px; /* Espaciado superior para el mensaje */
}


