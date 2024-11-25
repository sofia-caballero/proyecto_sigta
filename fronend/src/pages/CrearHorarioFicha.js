import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/CrearHorarioFicha.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CrearHorarioFicha = () => {
  const [nombre, setNombre] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [estado, setEstado] = useState('Activo');
  const [mensajeExito, setMensajeExito] = useState(false);  // Nuevo estado para el mensaje de éxito
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoArchivo = {
      nombre: nombre,
      archivo: archivo ? archivo.name : '',
      url: archivo ? URL.createObjectURL(archivo) : '',
      estado: estado
    };

    // Guardar el archivo en localStorage
    const archivosGuardados = JSON.parse(localStorage.getItem('archivos')) || [];
    archivosGuardados.push(nuevoArchivo);
    localStorage.setItem('archivos', JSON.stringify(archivosGuardados));

    // Mostrar mensaje de éxito y redirigir
    setMensajeExito(true);
    setTimeout(() => {
      setMensajeExito(false);
      navigate('/ConsultarHorarioFicha');
    }, 3000);
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleEstadoChange = (e) => {
    setEstado(e.target.value);
  };

  const menuItems = [
    { nombre: 'Inicio', ruta: 'Home-page' },
    { nombre: 'Usuarios', ruta: '/usuarios' },
    { nombre: 'Ficha', ruta: '/consultar-ficha' },
    { nombre: 'Instructores', ruta: '/consultar-instructor' },
    { nombre: 'Profesional', ruta: '/consultar-profesional' },
    { nombre: 'Taller', ruta: '/consultar-taller' },
    { nombre: 'Horario Ficha', ruta: '/ConsultarHorarioFicha' },
    { nombre: 'Programacion', ruta: '/consultar-programacion' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <MenuDesplegable menuItems={menuItems} />
      <div style={{ flex: 1 }}>
        <EncabezadoProfesional nombreUsuario="" rol="" imagenPerfil="ruta/a/imagen.jpg" />
        <div className="container">
          <h1>Crear Horario de Ficha</h1>
          {mensajeExito && (
            <div className="mensaje-exito" style={{ textAlign: 'center' }}>
              <p>Horario creado correctamente</p>
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                style={{ color: 'green', fontSize: '50px', marginTop: '10px' }} 
              />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Archivo:</label>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".xlsx, .xls"
                required
              />
            </div>
            <div className="form-group">
              <label>Estado:</label>
              <select value={estado} onChange={handleEstadoChange} required>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <button type="submit" className="submit-button">Guardar Horario</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CrearHorarioFicha;
