import nodemailer from 'nodemailer';

// Configuración de transporte usando el servicio de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sigta395@gmail.com', // Tu dirección de correo de Gmail
    pass: 'qbrzcomsdfhtyxfd' // Contraseña de aplicación generada
  },
  tls: {
    rejectUnauthorized: false // Ignora la verificación de certificados
  }
});

// Función para enviar el correo de recuperación a diferentes destinatarios
export const sendRecoveryEmail = async (email, token) => {
  const resetUrl = `http://localhost:3000/reset-password/${token}`; // Asume que tu app React corre en el puerto 3000

  const mailOptions = {
    from: 'sigta395@gmail.com', // Tu correo de Gmail
    to: email, // Correo del destinatario
    subject: 'Recupera tu contraseña',
    html: `
      <h1>Recuperación de contraseña</h1>
      <p>Has solicitado recuperar tu contraseña. Utiliza el siguiente enlace para restablecerla:</p>
      <a href="${resetUrl}">Restablecer contraseña</a>
      <p>Este enlace expirará en 24 horas.</p>
      <p>Si no solicitaste este cambio, ignora este correo.</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error; // Re-lanzar el error para manejarlo en el lugar donde se llama a esta función
  }
};