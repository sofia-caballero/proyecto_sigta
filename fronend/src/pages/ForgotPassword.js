import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoSena from '../assets/logo_sigta.png';
import '../css/ForgotPassword.css';

const baseUrl = "http://localhost:4000";
const emailServerUrl = "http://localhost:4001/api/send-recovery-email";

const ForgotPassword = () => {
  const [emailOrDocument, setEmailOrDocument] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setEmailOrDocument(e.target.value);
  };

  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  const generateExpirationDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 24);
    return now.toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const input = emailOrDocument.trim().toLowerCase();

      const responseEmail = await axios.get(`${baseUrl}/usuarios?correo=${input}`);
      const responseDoc = await axios.get(`${baseUrl}/usuarios?número_de_documento=${input}`);
      const users = [...responseEmail.data, ...responseDoc.data];

      if (users.length > 0) {
        const user = users[0];
        const token = generateToken();
        const expires_in = generateExpirationDate();

        // Guardar token en la base de datos
        await axios.post(`${baseUrl}/reset_tokens`, {
          token,
          user_id: user.id,
          expires_in,
          used: false
        });

        // Enviar correo de recuperación
        await axios.post(emailServerUrl, {
          email: user.correo,
          token: token,
        });

        setSuccessMessage('Se ha enviado un enlace de recuperación a su correo electrónico.');
      } else {
        setErrorMessage('No se encontró un usuario con esa información.');
      }
    } catch (error) {
      console.error('Error detallado:', error);
      if (error.response) {
        setErrorMessage(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'Sin mensaje de error'}`);
      } else if (error.request) {
        setErrorMessage('No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.');
      } else {
        setErrorMessage('Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="containerSecundario">
        <div className="logo-container">
          <img src={logoSena} alt="Logo" className="logo" />
        </div>
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailOrDocument">Ingresa el correo electrónico o número de documento</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                id="emailOrDocument"
                name="emailOrDocument"
                onChange={handleChange}
                value={emailOrDocument}
                required
              />
            </div>
          </div>
          {errorMessage && (
            <div className="alert alert-danger">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success">
              {successMessage}
            </div>
          )}
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
