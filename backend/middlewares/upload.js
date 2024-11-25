const multer = require('multer');
const path = require('path');

// Aquí configuramos el almacenamiento de las imágenes
const storage = multer.diskStorage({
  // Configuración de la carpeta donde se guardarán las imágenes
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ruta donde se guardan las imágenes, en la carpeta "uploads"
  },
  // Configuración para darle un nombre único al archivo de imagen
  filename: (req, file, cb) => {
    // Usamos la fecha actual y un valor aleatorio para asegurarnos de que los archivos tengan nombres únicos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Guardamos el archivo con el nombre modificado
  }
});

// Validación para asegurarnos de que solo se suben imágenes
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/; // Tipos de archivo permitidos (solo imágenes)
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Validar extensión
  const mimetype = fileTypes.test(file.mimetype); // Validar tipo MIME

  if (extname && mimetype) {
    return cb(null, true); // Si es una imagen, se acepta
  } else {
    cb(new Error('Tipo de archivo no válido. Solo se permiten imágenes.')); // Si no es una imagen, se rechaza
  }
};

// Inicialización de multer con la configuración definida
const upload = multer({
  storage: storage,    // Almacenamiento de los archivos
  fileFilter: fileFilter, // Validación del tipo de archivo
  limits: { fileSize: 10 * 1024 * 1024 }  // Tamaño máximo de 10MB
});

module.exports = upload; // Exportamos para usarlo en el controlador
