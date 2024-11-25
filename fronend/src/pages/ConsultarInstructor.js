import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/consultar.css';

function ConsultarInstructor() {
    const [instructores, setInstructores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInstructores, setFilteredInstructores] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editInstructor, setEditInstructor] = useState({
        id: '',
        numero_cedula: '',
        nombre: '',
        fecha_nacimiento: '',
        direccion: '',
        email: '',
        sede: '',
        estado: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstructores();
    }, []);

    useEffect(() => {
        if (isSearchClicked) {
            if (searchTerm === '') {
                setFilteredInstructores([]);
            } else {
                const results = instructores.filter(instructor =>
                    (instructor.nombre && instructor.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (instructor.numero_cedula && instructor.numero_cedula.toString().toLowerCase().includes(searchTerm.toLowerCase())) // Convertir a string
                );
                setFilteredInstructores(results);
            }
        }
    }, [searchTerm, instructores, isSearchClicked]);

    const fetchInstructores = () => {
        axios.get('http://localhost:4000/instructor')
            .then(response => {
                setInstructores(response.data);
            })
            .catch(error => {
                console.error('Error fetching instructores:', error);
            });
    };

    const handleSearch = () => {
        setIsSearchClicked(true);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditInstructor({ ...filteredInstructores[index] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInstructor(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        axios.put(`http://localhost:4000/instructor/${editInstructor.id}`, editInstructor)
            .then(response => {
                const updatedInstructores = [...filteredInstructores];
                updatedInstructores[editIndex] = response.data;
                setFilteredInstructores(updatedInstructores);
                setInstructores(updatedInstructores); // Asegurarse de que el estado global también se actualice
                setEditIndex(null);
                setIsSearchClicked(false); // Para mostrar todos los instructores después de la actualización
                setSearchTerm(''); // Limpiar el término de búsqueda
                setSuccessMessage('Instructor actualizado correctamente'); // Agregar mensaje de éxito
            })
            .catch(error => {
                console.error('Error updating instructor:', error);
            });
    };

    const handleCancel = () => {
        setEditIndex(null);
    };

    const menuItems = [
        { nombre: 'Inicio', ruta: 'Home-page' },
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
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol="Administrador" imagenPerfil="ruta/a/imagen.jpg" />
                <div className="container">
                    <h1>Consultar Instructores</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o número de cédula"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="search-button">
                            <span className="search-icon">🔍</span>
                        </button>
                    </div>
                    <button onClick={() => navigate('/CrearInstructor')} className="create-button">
                        Crear Nuevo Instructor
                    </button>
                    {successMessage && (
                        <div className="mensaje-exito">
                            <span className="icono-exito">✔️</span>
                            {successMessage}
                        </div>
                    )}
                    <table className="instructor-table">
                        <thead>
                            <tr>
                                <th>Número de Cédula</th>
                                <th>Nombre</th>
                                <th>Fecha de Nacimiento</th>
                                <th>Dirección</th>
                                <th>Email</th>
                                <th>Sede</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isSearchClicked && (
                                <tr>
                                    <td colSpan="8">Haga una búsqueda para ver los datos aquí.</td>
                                </tr>
                            )}
                            {isSearchClicked && filteredInstructores.length === 0 && (
                                <tr>
                                    <td colSpan="8">No hay datos disponibles para la búsqueda.</td>
                                </tr>
                            )}
                            {isSearchClicked && filteredInstructores.length > 0 && filteredInstructores.map((instructor, index) => (
                                <tr key={instructor.id}>
                                    {editIndex === index ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="numero_cedula"
                                                    value={editInstructor.numero_cedula}
                                                    onChange={handleInputChange}
                                                    disabled
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={editInstructor.nombre}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="fecha_nacimiento"
                                                    value={editInstructor.fecha_nacimiento}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="direccion"
                                                    value={editInstructor.direccion}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editInstructor.email}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="sede"
                                                    value={editInstructor.sede}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    name="estado"
                                                    value={editInstructor.estado}
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
                                            <td>{instructor.numero_cedula}</td>
                                            <td>{instructor.nombre}</td>
                                            <td>{instructor.fecha_nacimiento}</td>
                                            <td>{instructor.direccion}</td>
                                            <td>{instructor.email}</td>
                                            <td>{instructor.sede}</td>
                                            <td>{instructor.estado}</td>
                                            <td>
                                                <button onClick={() => handleEdit(index)} className="update-button">Actualizar</button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ConsultarInstructor;
