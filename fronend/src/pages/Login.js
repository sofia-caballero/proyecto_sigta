import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import md5 from 'md5';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import logoSena from '../assets/logo_sigta.png';
import Header from '../components/Header';
import ErrorModal from '../components/mensaje';
import '../css/Login.css';

const baseUrl = "http://localhost:4000/usuarios";
const cookies = new Cookies();

class Login extends Component {
  state = {
    form: {
      número_de_documento: '',
      password: ''
    },
    redirectTo: null,
    showPassword: false,
    error: false,
    errorMessage: '',
    showModal: false,
    failedAttempts: 0,
    showForgotPassword: false,
    documentError: ''
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'número_de_documento') {
      if (value === '' || /^\d+$/.test(value)) {
        this.setState({
          form: {
            ...this.state.form,
            [name]: value
          },
          documentError: ''
        });
      } else {
        this.setState({
          documentError: 'Solo se permiten números en este campo'
        });
      }
    } else {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value
        }
      });
    }
  };

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  iniciarSesion = async () => {
    if (!this.state.form.número_de_documento) {
      this.setState({
        errorMessage: 'El número de documento es requerido',
        showModal: true
      });
      return;
    }

    try {
      const response = await axios.get(baseUrl, {
        params: {
          número_de_documento: this.state.form.número_de_documento
        }
      });

      // Buscar el usuario que coincida con la contraseña
      const usuario = response.data.find(user => 
        user.password === md5(this.state.form.password)
      );

      if (usuario) {
        // Verificar el estado del usuario
        if (usuario.estado !== 'Activo') {
          this.setState({
            errorMessage: 'Su cuenta está pendiente de activación. Por favor, contacte al administrador.',
            showModal: true
          });
          return;
        }

        // Si el usuario está activo, continuar con el proceso de login
        cookies.set('id', usuario.id, { path: "/" });
        cookies.set('número_de_documento', usuario.número_de_documento, { path: "/" });
        cookies.set('nombre', usuario.nombre, { path: "/" });
        cookies.set('username', usuario.username, { path: "/" });
        cookies.set('rol', usuario.rol, { path: "/" });

        this.setState({ failedAttempts: 0 });

        switch (usuario.rol) {
          case 'Administrador':
            this.setState({ redirectTo: '/administrador' });
            break;
          case 'Profesional':
            this.setState({ redirectTo: '/profesional' });
            break;
          case 'Coordinador':
            this.setState({ redirectTo: '/coordinador' });
            break;
          default:
            this.setState({ errorMessage: 'Rol desconocido', showModal: true });
            break;
        }
      } else {
        this.setState(prevState => ({
          errorMessage: 'El número de documento o la contraseña no son correctos',
          showModal: true,
          failedAttempts: prevState.failedAttempts + 1
        }));

        if (this.state.failedAttempts + 1 >= 3) {
          this.setState({ showForgotPassword: true });
        }
      }
    } catch (error) {
      console.error(error);
      this.setState({ errorMessage: 'Error en la conexión al servidor', showModal: true });
    }
  };

  componentDidMount() {
    if (cookies.get('username')) {
      const rol = cookies.get('rol');
      if (rol === 'Administrador') {
        window.location.href = "/administrador";
      } else if (rol === 'Profesional') {
        window.location.href = "/profesional";
      } else if (rol === 'Coordinador') {
        window.location.href = "/coordinador";
      }
    }
  }

  render() {
    if (this.state.redirectTo) {
      return <Navigate to={this.state.redirectTo} />;
    }

    const buttonStyle = {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      padding: '10px 20px',
      fontSize: '16px',
      borderRadius: '5px',
      transition: 'background-color 0.3s ease',
    };

    return (
      <div>
        <Header />
        <div className="containerPrincipal">
          <div className="containerSecundario">
            <div className="logo-container">
              <img src={logoSena} alt="Logo" className="logo" />
            </div>
            <div className="form-group">
              <label>Número de Documento:</label>
              <br />
              <input
                type="text"
                className={`form-control ${this.state.documentError ? 'is-invalid' : ''}`}
                name="número_de_documento"
                value={this.state.form.número_de_documento}
                onChange={this.handleChange}
                maxLength="20"
              />
              {this.state.documentError && (
                <div className="invalid-feedback">
                  {this.state.documentError}
                </div>
              )}
              <br />
              <label>Contraseña:</label>
              <br />
              <div className="password-container">
                <input
                  type={this.state.showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  onChange={this.handleChange}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={this.togglePasswordVisibility}
                >
                  {this.state.showPassword ? "❌" : "👁️"}
                </button>
              </div>
              <br />
              <button
                style={buttonStyle}
                onClick={this.iniciarSesion}
                disabled={!!this.state.documentError}
              >
                Iniciar Sesión
              </button>
              <br /><br />
              {this.state.showForgotPassword && (
                <div>
                  <p>¿Deseas recuperar tu contraseña?</p>
                  <button className="btn btn-warning" onClick={() => window.location.href = '/ForgotPassword'}>
                    Recuperar Contraseña
                  </button>
                </div>
              )}
              <br /><br />
            </div>
          </div>
        </div>

        <ErrorModal
          show={this.state.showModal}
          onClose={this.handleCloseModal}
          message={this.state.errorMessage}
        />
      </div>
    );
  }
}

export default Login;
