import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/ConsultarHorarioFicha.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const ConsultarHorarioFicha = () => {
  const [archivosGuardados, setArchivosGuardados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArchivos, setFilteredArchivos] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editArchivo, setEditArchivo] = useState({ nombre: '', archivo: '', url: '', estado: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const rol = cookies.get('rol'); // Obtener el rol del usuario

  // Cargar archivos desde localStorage
  useEffect(() => {
    const archivos = JSON.parse(localStorage.getItem('archivos')) || [];
    setArchivosGuardados(archivos);
  }, []);

  // Filtrar archivos basados en la búsqueda
  useEffect(() => {
    if (isSearchClicked) {
      const results = searchTerm
        ? archivosGuardados.filter(archivo =>
            archivo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : archivosGuardados; // Mantener todos los archivos si no hay término de búsqueda
      // Ordenar resultados por nombre en orden alfabético
      const sortedResults = results.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setFilteredArchivos(sortedResults);
    }
  }, [searchTerm, archivosGuardados, isSearchClicked]);

  // Manejo de eventos
  const handleSearch = () => setIsSearchClicked(true);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditArchivo(archivosGuardados[index]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditArchivo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditArchivo(prevState => ({
        ...prevState,
        archivo: file.name,
        url
      }));
    }
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedArchivos = [...archivosGuardados];
      updatedArchivos[editIndex] = editArchivo;
      setArchivosGuardados(updatedArchivos);
      localStorage.setItem('archivos', JSON.stringify(updatedArchivos));
      setEditIndex(null);
      setIsSearchClicked(false); // Para que los cambios se reflejen correctamente
      setSearchTerm(''); // Para limpiar el término de búsqueda y actualizar la lista
      setSuccessMessage('Archivo actualizado exitosamente.'); // Mensaje de éxito
    } else {
      setErrorMessage('No se pudo actualizar el archivo.'); // Mensaje de error
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Menú de navegación
  const menuItems = [
    { nombre: 'Inicio', ruta: '/home-page' },
    { nombre: 'Usuarios', ruta: '/usuarios' },
    { nombre: 'Ficha', ruta: '/consultar-ficha' },
    { nombre: 'Instructores', ruta: '/consultar-instructor' },
    { nombre: 'Profesional', ruta: '/consultar-profesional' },
    { nombre: 'Taller', ruta: '/consultar-taller' },
    { nombre: 'Horario Ficha', ruta: '/consultar-horario-ficha' },
    { nombre: 'Programacion', ruta: '/consultar-programacion' },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <MenuDesplegable menuItems={menuItems} />
      <div style={{ flex: 1 }}>
        <EncabezadoProfesional nombreUsuario="" rol={rol} imagenPerfil="ruta/a/imagen.jpg" />
        <div className="container">
          <h1>Consultar Horario de Ficha</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </div>
          {rol === 'Coordinador' && (
            <button
              onClick={() => navigate('/CrearHorarioFicha')}
              className="create-button"
            >
              Crear Horario
            </button>
          )}
          <div className="horario-ficha-table-container">
            {/* Mensaje de éxito */}
            {successMessage && (
              <div className="mensaje-exito">
                <span className="icono-exito">✔️</span>
                {successMessage}
              </div>
            )}
            {/* Mensaje de error */}
            {errorMessage && (
              <div className="mensaje-error">
                <span className="icono-error">❌</span>
                {errorMessage}
              </div>
            )}
            {isSearchClicked && filteredArchivos.length === 0 && searchTerm !== '' ? (
              <p>No hay archivos disponibles para la búsqueda.</p>
            ) : (
              <>
                {isSearchClicked && filteredArchivos.length === 0 && searchTerm === '' ? (
                  <p>Haga una búsqueda para ver los resultados.</p>
                ) : (
                  <table className="horario-ficha-table">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Archivo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredArchivos.length > 0 ? (
                        filteredArchivos.map((archivo, index) => (
                          <tr key={index}>
                            {editIndex === index ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    name="nombre"
                                    value={editArchivo.nombre}
                                    onChange={handleInputChange}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="file"
                                    name="archivo"
                                    onChange={handleFileChange}
                                  />
                                </td>
                                <td>
                                  <select
                                    name="estado"
                                    value={editArchivo.estado}
                                    onChange={handleInputChange}
                                  >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                  </select>
                                </td>
                                <td>
                                  <button onClick={handleSave} className="update-button">Guardar</button>
                                  <button onClick={handleCancel} className="cancel-button">Cancelar</button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>{archivo.nombre}</td>
                                <td>
                                  {archivo.archivo && (
                                    <a href={archivo.url} download={archivo.archivo}>
                                      Descargar
                                    </a>
                                  )}
                                </td>
                                <td>{archivo.estado}</td>
                                <td>
                                  <button onClick={() => handleEdit(index)} className="update-button">Actualizar</button>
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4">No hay datos disponibles.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultarHorarioFicha;
