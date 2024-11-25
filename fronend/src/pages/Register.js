import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import md5 from 'md5';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';
import ErrorModal from '../components/mensaje';
import logoSena from '../assets/logo_sigta.png';
import '../css/Register.css';

const usuariosUrl = "http://localhost:4000/usuarios";

const Register = () => {
  const [form, setForm] = useState({
    numero_de_documento: '',
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    numero_de_documento: '',
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  });

 
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorModal, setErrorModal] = useState({ show: false, message: '' });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isDocumentDuplicate, setIsDocumentDuplicate] = useState(false);
  const [isEmailDuplicate, setIsEmailDuplicate] = useState(false);

  const navigate = useNavigate();

  const checkDuplicatesInRealTime = async (field, value) => {
    try {
      const response = await axios.get(usuariosUrl);
      const allUsers = response.data;

      if (field === 'numero_de_documento') {
        const isDuplicate = allUsers.some(user => user.numero_de_documento === value);
        setIsDocumentDuplicate(isDuplicate);
        if (isDuplicate) {
          setErrors(prev => ({
            ...prev,
            numero_de_documento: 'Este numero de documento ya está registrado en el sistema'
          }));
        }
        return isDuplicate;
      } else if (field === 'correo') {
        const isDuplicate = allUsers.some(user => user.correo.toLowerCase() === value.toLowerCase());
        setIsEmailDuplicate(isDuplicate);
        if (isDuplicate) {
          setErrors(prev => ({
            ...prev,
            correo: 'Este correo electrónico ya está registrado en el sistema'
          }));
        }
        return isDuplicate;
      }
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return false;
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'numero_de_documento':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten numeros';
        } else if (value.length < 5 || value.length > 15) {
          error = 'El documento debe tener entre 5 y 15 dígitos';
        }
        break;

      case 'nombre':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = 'Solo se permiten letras y espacios';
        } else if (value.length < 3) {
          error = 'El nombre debe tener al menos 3 caracteres';
        } else if (value.length > 50) {
          error = 'El nombre no puede exceder 50 caracteres';
        }
        break;

      case 'correo':
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(value)) {
          error = 'Ingrese un correo electrónico válido';
        }
        break;

      case 'password':
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/;
        if (!passwordRegex.test(value)) {
          error = 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y numeros.';
        }
        break;

      case 'confirmPassword':
        if (value !== form.password) {
          error = 'Las contraseñas no coinciden';
          setPasswordsMatch(false);
        } else {
          setPasswordsMatch(true);
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let validatedValue = value;
    switch (name) {
      case 'numero_de_documento':
        validatedValue = value.replace(/\D/g, '');
        break;
      case 'nombre':
        validatedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        break;
      default:
        validatedValue = value;
    }

    setForm(prevForm => ({
      ...prevForm,
      [name]: validatedValue
    }));

    const error = validateField(name, validatedValue);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    if (!error && (name === 'numero_de_documento' || name === 'correo')) {
      if ((name === 'numero_de_documento' && validatedValue.length >= 5) || 
          (name === 'correo' && validatedValue.includes('@'))) {
        await checkDuplicatesInRealTime(name, validatedValue);
      }
    }

    if (name === 'password' || name === 'confirmPassword') {
      const otherField = name === 'password' ? 'confirmPassword' : 'password';
      const otherValue = name === 'password' ? form.confirmPassword : form.password;
      if (otherValue) {
        const match = validatedValue === otherValue;
        setPasswordsMatch(match);
        if (!match) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: 'Las contraseñas no coinciden'
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            confirmPassword: ''
          }));
        }
      }
    }
  };

  const validateForm = () => {
    return (
      Object.values(errors).every(error => error === '') &&
      Object.values(form).every(value => value !== '') &&
      passwordsMatch &&
      !isDocumentDuplicate &&
      !isEmailDuplicate
    );
  };

  const registrarUsuario = async () => {
    if (!validateForm()) {
      let errorMessage = 'Por favor, corrija los errores en el formulario antes de continuar.';
      
      if (isDocumentDuplicate) {
        errorMessage = 'El numero de documento ya está registrado en el sistema.';
      } else if (isEmailDuplicate) {
        errorMessage = 'El correo electrónico ya está registrado en el sistema.';
      }

      setErrorModal({
        show: true,
        message: errorMessage
      });
      return;
    }

    try {
      const newUser = {
        numero_de_documento: form.numero_de_documento,
        nombre: form.nombre,
        correo: form.correo,
        password: md5(form.password),
        estado: 'Inactivo',
        rol: 'Pendiente'
      };

      const response = await axios.post(usuariosUrl, newUser);

      if (response.status === 201) {
        setErrorModal({
          show: true,
          message: 'Su registro está pendiente de aprobación.'
        });
        navigate("/");
      }
    } catch (error) {
      setErrorModal({
        show: true,
        message: 'Error al registrar el usuario. Inténtelo más tarde.'
      });
    }
  };

  const closeModal = () => {
    setErrorModal({ show: false, message: '' });
  };

  return (
    <div>
      <Header />
      <div className="containerPrincipalregistrar">
        <div className="containerSecundarioregistrar">
          <div className="logo-container">
            <img src={logoSena} alt="Logo" className="logo" />
          </div>
          <h2 className="form-title">Registro de Usuario</h2>
          
          <div className="form-group">
            <label>numero de Documento:</label>
            <input
              type="text"
              className={`form-control ${errors.numero_de_documento || isDocumentDuplicate ? 'is-invalid' : ''}`}
              name="numero_de_documento"
              value={form.numero_de_documento}
              onChange={handleChange}
              maxLength="15"
            />
            {(errors.numero_de_documento || isDocumentDuplicate) && (
              <div className="invalid-feedback" style={{ color: isDocumentDuplicate ? 'red' : undefined }}>
                {errors.numero_de_documento || 'Este numero de documento ya está registrado'}
              </div>
            )}

            <label>Nombre Completo:</label>
            <input
              type="text"
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              maxLength="50"
            />
            {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}

            <label>Correo Electrónico:</label>
            <input
              type="email"
              className={`form-control ${errors.correo || isEmailDuplicate ? 'is-invalid' : ''}`}
              name="correo"
              value={form.correo}
              onChange={handleChange}
              maxLength="50"
            />
            {(errors.correo || isEmailDuplicate) && (
              <div className="invalid-feedback" style={{ color: isEmailDuplicate ? 'red' : undefined }}>
                {errors.correo || 'Este correo ya está registrado'}
              </div>
            )}

            <label>Contraseña:</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                name="password"
                value={form.password}
                onChange={handleChange}
                maxLength="25"
              />
              <span className="input-group-text" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <label>Confirmar Contraseña:</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`form-control ${errors.confirmPassword || !passwordsMatch ? 'is-invalid' : ''}`}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                maxLength="25"
              />
              <span className="input-group-text" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </span>
              {(errors.confirmPassword || !passwordsMatch) && (
                <div className="invalid-feedback">{errors.confirmPassword || 'Las contraseñas no coinciden'}</div>
              )}
            </div>
          </div>

          <button
            className="btn btn-success"
            onClick={registrarUsuario}
            disabled={!validateForm()}
          >
            Registrar
          </button>
        </div>
      </div>
      
      {errorModal.show && <ErrorModal show={errorModal.show} message={errorModal.message} closeModal={closeModal} />}
    </div>
  );
};

export default Register;
