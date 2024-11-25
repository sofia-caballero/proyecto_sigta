import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import md5 from 'md5';
import logoSena from '../assets/logo_sigta.png';
import '../css/ResetPassword.css';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/reset_tokens?token=${token}&used=false`);
        if (response.data.length > 0) {
          const tokenData = response.data[0];
          const expirationDate = new Date(tokenData.expires_in);
          if (expirationDate > new Date()) {
            setIsTokenValid(true);
          } else {
            setErrorMessage('El token ha expirado.');
          }
        } else {
          setErrorMessage('Token inválido o ya ha sido usado.');
        }
      } catch (error) {
        setErrorMessage('Error al verificar el token.');
      }
    };

    verifyToken();
  }, [token]);

  // Nuevo useEffect para verificar coincidencia de contraseñas en tiempo real
  useEffect(() => {
    if (confirmPassword !== '') {
      setPasswordsMatch(newPassword === confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const hideMessages = () => {
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Expresión regular actualizada para aceptar guiones bajos
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y opcionalmente guiones bajos.');
      hideMessages();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      hideMessages();
      return;
    }

    setIsLoading(true);
    try {
      const tokenResponse = await axios.get(`http://localhost:4000/reset_tokens?token=${token}&used=false`);

      if (tokenResponse.data.length === 0) {
        setErrorMessage('Token inválido o ha expirado.');
        setIsLoading(false);
        hideMessages();
        return;
      }

      const tokenData = tokenResponse.data[0];
      const hashedPassword = md5(newPassword);

      const userResponse = await axios.patch(`http://localhost:4000/usuarios/${tokenData.user_id}`, {
        password: hashedPassword
      });

      if (userResponse.status === 200) {
        await axios.patch(`http://localhost:4000/reset_tokens/${tokenData.id}`, { used: true });
        setSuccessMessage('Su contraseña ha sido restablecida exitosamente.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setErrorMessage('No se pudo restablecer la contraseña. Inténtelo nuevamente.');
      }
    } catch (error) {
      setErrorMessage('Ocurrió un error al restablecer la contraseña. Inténtelo nuevamente.');
    } finally {
      setIsLoading(false);
      hideMessages();
    }
  };

  if (!isTokenValid) {
    return (
      <div className="reset-password-container">
        <div className="error-container">
          <h2>Restablecer Contraseña</h2>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="form-wrapper">
        <div className="logo-container">
          <img src={logoSena} alt="Logo" className="logo" />
        </div>
        <h2>Restablecer Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">Nueva Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${!passwordsMatch && confirmPassword !== '' ? 'is-invalid' : ''}`}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control ${!passwordsMatch && confirmPassword !== '' ? 'is-invalid' : ''}`}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {!passwordsMatch && confirmPassword !== '' && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                Las contraseñas no coinciden
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isLoading || !passwordsMatch}>
            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;