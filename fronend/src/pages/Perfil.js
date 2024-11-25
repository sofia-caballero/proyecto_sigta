import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Perfil.css'; // Importa el archivo CSS personalizado
import usuarioImage from '../assets/usuario.png'; // Importa la imagen

const cookies = new Cookies();

class Perfil extends Component {
  state = {
    user: {
      id: '',
      número_de_documento: '',
      nombre: '',
      username: '',
      correo: '', // Utilizamos solo un campo de correo
      rol: '', // Campo para 'rol'
      imagen: '' // Campo para la URL de la imagen
    },
    redirectTo: null, // Redirección a login en caso de no haber sesión
    redirectToUpdate: null, // Redirección a la página de actualizar perfil
    redirectToRol: null // Redirección basada en el rol del usuario
  };

  componentDidMount() {
    if (!cookies.get('username')) {
      this.setState({ redirectTo: '/login' }); // Redirige al login si no hay sesión
    } else {
      // Recuperamos los datos desde las cookies, incluyendo el correo registrado
      this.setState({
        user: {
          id: cookies.get('id'),
          número_de_documento: cookies.get('número_de_documento'),
          nombre: cookies.get('nombre'),
          username: cookies.get('username'),
          correo: cookies.get('correo'), // Recupera el correo registrado desde las cookies
          rol: cookies.get('rol'), // Recupera el rol desde las cookies
          imagen: cookies.get('imagen') || usuarioImage // Asigna la imagen por defecto si no hay una en cookies
        }
      });
    }
  }

  // Función para redirigir a la página de actualizar perfil
  actualizarInformacion = () => {
    this.setState({ redirectToUpdate: '/actualizar-perfil' });
  };

  // Función para redirigir a la página según el rol del usuario
  regresarAtras = () => {
    const { rol } = this.state.user;

    // Redirigir según el rol
    if (rol === 'Administrador') {
      this.setState({ redirectToRol: '/administrador' });
    } else if (rol === 'Profesional') {
      this.setState({ redirectToRol: '/profesional' });
    } else if (rol === 'Coordinador') {
      this.setState({ redirectToRol: '/coordinador' });
    }
  };

  render() {
    // Verifica si debe redirigir a alguna otra página
    if (this.state.redirectTo) {
      return <Navigate to={this.state.redirectTo} />;
    }

    if (this.state.redirectToUpdate) {
      return <Navigate to={this.state.redirectToUpdate} />;
    }

    if (this.state.redirectToRol) {
      return <Navigate to={this.state.redirectToRol} />;
    }

    const { número_de_documento, nombre, correo, rol, imagen } = this.state.user;

    return (
      <div className="profile-container">
        {/* Letrero de bienvenida */}
        <h1 className="welcome-banner">¡Bienvenido a tu perfil, {nombre}!</h1>

        <div className="profile-card mt-3 p-4 border rounded shadow-sm">
          <div className="profile-header text-center">
            {/* Mostrar la imagen del usuario */}
            <img
              src={imagen}
              alt="Foto de perfil"
              className="profile-image rounded-circle"
            />
            <h2 className="profile-name">{nombre}</h2>
            <p className="profile-role text-muted">{rol}</p>
          </div>

          <hr />

          <div className="user-details">
            <p><strong>Número de Documento:</strong> {número_de_documento}</p>
          </div>

          <div className="button-group">
            <button className="btn btn-custom btn-actualizar" onClick={this.actualizarInformacion}>
              Actualizar 
            </button>
            <button className="btn btn-custom btn-cancelar" onClick={this.regresarAtras}>
              Atrás
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Perfil;
