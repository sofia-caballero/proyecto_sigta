import express from 'express';
import cors from 'cors';
import { sendRecoveryEmail } from './emailService.js';


const app = express();
const port = 4001; // Cambiado a 4001 para coincidir con su solicitud

app.use(cors());
app.use(express.json());

// Cargar los datos del archivo JSON (aquí deberías reemplazar los comentarios con datos reales si es necesario)
const data = {
  reset_tokens: [/* ... */],
  horarios: [/* ... */],
  usuarios: [/* ... */],
  usuarios_pendientes: [/* ... */],
  instructor: [/* ... */],
  taller: [/* ... */],
  programacion: [/* ... */]
};

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Nuevas rutas para los endpoints solicitados
app.get('/reset_tokens', (req, res) => {
  res.json(data.reset_tokens);
});

app.get('/horarios', (req, res) => {
  res.json(data.horarios);
});

app.get('/usuarios', (req, res) => {
  res.json(data.usuarios);
});

app.get('/usuarios_pendientes', (req, res) => {
  res.json(data.usuarios_pendientes);
});

app.get('/instructor', (req, res) => {
  res.json(data.instructor);
});

app.get('/taller', (req, res) => {
  res.json(data.taller);
});

app.get('/programacion', (req, res) => {
  res.json(data.programacion);
});

// Ruta para enviar correo de recuperación
app.post('/api/send-recovery-email', async (req, res) => {
  const { email, token } = req.body;
  
  if (!email || !token) {
    return res.status(400).json({ error: 'Email y token son requeridos' });
  }

  try {
    await sendRecoveryEmail(email, token);
    res.status(200).json({ message: 'Correo de recuperación enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    res.status(500).json({ error: 'Fallo al enviar el correo de recuperación' });
  }
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Manejador para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
