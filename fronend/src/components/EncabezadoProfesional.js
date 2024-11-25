import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../css/EncabezadoProfesional.css'; 

const cookies = new Cookies();

const EncabezadoProfesional = () => { // Asegúrate de que el componente esté definido correctamente
  const [showOptions, setShowOptions] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre y rol desde las cookies
    const nombreCookie = cookies.get('nombre');
    const rolCookie = cookies.get('rol');

    if (nombreCookie && rolCookie) {
      setNombre(nombreCookie);
      setRol(rolCookie);
    }
  }, []);

  const toggleOptions = () => setShowOptions(!showOptions);

  const cerrarSesion = () => {
    // Eliminar cookies al cerrar sesión
    cookies.remove('id', { path: '/' });
    cookies.remove('número_de_documento', { path: '/' });
    cookies.remove('nombre', { path: '/' });
    cookies.remove('username', { path: '/' });
    cookies.remove('rol', { path: '/' });

    // Redirigir al login
    navigate('/login');
  };

  // El return debe estar dentro del cuerpo de la función
  return (
    <header className="encabezado-profesional">
      <div className="logo"></div>
      <div className="informacion-usuario">
        <span className="bienvenida">Bienvenid@ {nombre}. Rol: {rol}</span>
      </div>
      <div className="iconos">
        <button onClick={toggleOptions} className="avatar">
          <FaUserCircle />
        </button>
        {showOptions && (
          <div className="opciones">
            <button onClick={cerrarSesion} className="opcion">
              <FaSignOutAlt className="icono-salida" />
              Cerrar sesión
            </button>
            <button onClick={() => navigate('/Perfil')} className="opcion">
              Perfil
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default EncabezadoProfesional;
