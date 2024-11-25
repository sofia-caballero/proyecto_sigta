import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import md5 from 'md5';
import { Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ActualizarPerfil.css';
import logoSigta from '../assets/logo_sigta.png';

const cookies = new Cookies();

const initialState = {
  id: '',
  nombre: '',
  correo: '',
  password: '',
  confirmPassword: '',
  errorMessage: '',
  successMessage: '',
  redirectToProfile: null,
  isSubmitting: false,
  showPassword: false,
  showConfirmPassword: false,
  errors: {
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: ''
  },
  passwordMatch: true
};

class ActualizarPerfil extends Component {
  state = { ...initialState };

  componentDidMount() {
    this.initializeUserData();
  }

  initializeUserData = () => {
    const userId = cookies.get('id');
    if (!cookies.get('username') || !userId) {
      this.setState({ redirectToProfile: '/login' });
      return;
    }

    this.setState({
      id: userId,
      nombre: cookies.get('nombre') || '',
      correo: cookies.get('correo') || '',
      password: '',
      confirmPassword: ''
    });
  };

  validateField = (name, value) => {
    const validations = {
      nombre: () => {
        if (!value) return 'El nombre es requerido';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          return 'Solo se permiten letras y espacios';
        }
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        return '';
      },
      correo: () => {
        if (!value) return 'El correo es requerido';
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(value) ? '' : 'Ingrese un correo electrónico válido';
      },
      password: () => {
        if (!value) return ''; // Contraseña opcional en actualización
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d_]{8,}$/;
        return passwordRegex.test(value) ? '' : 
          'La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y opcionalmente guiones bajos.';
      },
      confirmPassword: () => {
        if (this.state.password && !value) return 'Debe confirmar la contraseña';
        return value === this.state.password ? '' : 'Las contraseñas no coinciden';
      }
    };

    return validations[name] ? validations[name]() : '';
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    let validatedValue = value;

    // Sanitización específica para el campo nombre
    if (name === 'nombre') {
      validatedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    }

    this.setState(prevState => ({
      [name]: validatedValue,
      errors: {
        ...prevState.errors,
        [name]: this.validateField(name, validatedValue)
      }
    }), () => {
      // Validación adicional para contraseñas
      if (name === 'password' || name === 'confirmPassword') {
        const confirmError = this.validateField('confirmPassword', this.state.confirmPassword);
        this.setState(prevState => ({
          errors: {
            ...prevState.errors,
            confirmPassword: confirmError
          },
          passwordMatch: !confirmError
        }));
      }
    });
  };

  togglePasswordVisibility = (field) => {
    this.setState(prevState => ({
      [field]: !prevState[field]
    }));
  };

  validateForm = () => {
    const { nombre, correo, password, confirmPassword, errors } = this.state;
    
    // Validar campos obligatorios
    if (!nombre || !correo) return false;
    
    // Verificar que no haya errores
    if (Object.values(errors).some(error => error !== '')) return false;
    
    // Si se ingresa una contraseña, validar que coincida con la confirmación
    if (password || confirmPassword) {
      if (!password || !confirmPassword || password !== confirmPassword) return false;
    }
    
    return true;
  };

  actualizarPerfil = async (event) => {
    event.preventDefault();
    
    try {
      const { id, nombre, correo, password } = this.state;
      
      // Validar el formulario antes de enviar
      if (!this.validateForm()) {
        this.setState({
          errorMessage: 'Por favor, corrija los errores en el formulario antes de continuar.',
          successMessage: ''
        });
        return;
      }

      // Preparar datos a actualizar
      const updatedFields = {};
      if (nombre !== cookies.get('nombre')) updatedFields.nombre = nombre;
      if (correo !== cookies.get('correo')) updatedFields.correo = correo;
      if (password) updatedFields.password = md5(password);

      // Verificar si hay cambios
      if (Object.keys(updatedFields).length === 0) {
        this.setState({
          errorMessage: 'No has modificado ningún campo.',
          successMessage: ''
        });
        return;
      }

      this.setState({ isSubmitting: true });

      // Realizar la actualización
      const response = await axios.patch(`http://localhost:4000/usuarios/${id}`, updatedFields);

      if (response.status === 200) {
        // Actualizar cookies con los nuevos valores
        if (updatedFields.nombre) cookies.set('nombre', nombre, { path: '/' });
        if (updatedFields.correo) cookies.set('correo', correo, { path: '/' });

        // Restablecer el formulario
        this.setState({
          ...initialState,
          id,
          nombre,
          correo,
          successMessage: '¡Perfil actualizado con éxito!'
        });
      }
    } catch (error) {
      this.setState({
        errorMessage: error.response?.data?.message || 'Ocurrió un error al actualizar el perfil. Inténtalo de nuevo.',
        successMessage: ''
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  };

  cancelarActualizacion = () => {
    this.setState({ redirectToProfile: '/perfil' });
  };

  render() {
    const {
      nombre,
      correo,
      password,
      confirmPassword,
      errorMessage,
      successMessage,
      redirectToProfile,
      isSubmitting,
      showPassword,
      showConfirmPassword,
      errors
    } = this.state;

    if (redirectToProfile) {
      return <Navigate to={redirectToProfile} />;
    }

    const inputGroupStyle = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    };

    const eyeButtonStyle = {
      position: 'absolute',
      right: '10px',
      top: '30%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      zIndex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px'
    };

    return (
      <div className="actualizar-perfil-container">
        <div className="actualizar-perfil-card">
          <div className="logo-container">
            <img src={logoSigta} alt="Logo SIGTA" className="logo" />
          </div>
          
          <h3 className="actualizar-header">Actualizar Perfil</h3>

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          <form1 onSubmit={this.actualizarPerfil} noValidate>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre:</label>
              <input
                id="nombre"
                type="text"
                className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                placeholder="Nombre completo"
                name="nombre"
                value={nombre}
                onChange={this.handleChange}
                maxLength="50"
                required
              />
              {errors.nombre && (
                <div className="invalid-feedback">{errors.nombre}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="correo" className="form-label">Correo Electrónico:</label>
              <input
                id="correo"
                type="email"
                className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
                placeholder="correo@ejemplo.com"
                name="correo"
                value={correo}
                onChange={this.handleChange}
                required
              />
              {errors.correo && (
                <div className="invalid-feedback">{errors.correo}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Nueva Contraseña:</label>
              <div style={inputGroupStyle}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Nueva contraseña"
                  name="password"
                  value={password}
                  onChange={this.handleChange}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  style={eyeButtonStyle}
                  onClick={() => this.togglePasswordVisibility('showPassword')}
                  tabIndex="-1"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} color="#6c757d" /> : <Eye size={20} color="#6c757d" />}
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback d-block">{errors.password}</div>
              )}
              <small className="form-text text-muted">
                Deja el campo vacío si no deseas cambiar la contraseña.
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña:</label>
              <div style={inputGroupStyle}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirmar nueva contraseña"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.handleChange}
                  style={{ paddingRight: '40px' }}
                />
                <button
                  type="button"
                  style={eyeButtonStyle}
                  onClick={() => this.togglePasswordVisibility('showConfirmPassword')}
                  tabIndex="-1"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff size={20} color="#6c757d" /> : <Eye size={20} color="#6c757d" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
              )}
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="btn btn-primary btn-custom btn-actualizar"
                disabled={isSubmitting || !this.validateForm()}
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-custom btn-cancelar"
                onClick={this.cancelarActualizacion}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
            </div>
          </form1>
        </div>
      </div>
    );
  }
}

export default ActualizarPerfil;