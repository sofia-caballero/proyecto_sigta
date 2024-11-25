import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/consultartaller.css';

function ConsultarTaller() {
    const [talleres, setTalleres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTalleres, setFilteredTalleres] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editTaller, setEditTaller] = useState({
        id: '',
        nombre: '',
        descripcion: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchTalleres();
    }, []);

    useEffect(() => {
        if (isSearchClicked) {
            if (searchTerm === '') {
                setFilteredTalleres([]);
            } else {
                const results = talleres.filter(taller =>
                    (taller.nombre && taller.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (taller.descripcion && taller.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredTalleres(results);
            }
        }
    }, [searchTerm, talleres, isSearchClicked]);

    const fetchTalleres = () => {
        axios.get('http://localhost:4000/taller')
            .then(response => {
                setTalleres(response.data);
            })
            .catch(error => {
                console.error('Error fetching talleres:', error);
            });
    };

    const handleSearch = () => {
        setIsSearchClicked(true);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditTaller({
            ...filteredTalleres[index],
            nombre: filteredTalleres[index].nombre,
            descripcion: filteredTalleres[index].descripcion
        });
        setSuccessMessage('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditTaller(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        axios.put(`http://localhost:4000/taller/${editTaller.id}`, editTaller)
            .then(response => {
                const updatedTalleres = [...filteredTalleres];
                updatedTalleres[editIndex] = response.data;
                setFilteredTalleres(updatedTalleres);
                setEditIndex(null);
                setSuccessMessage('Taller actualizado correctamente');
            })
            .catch(error => {
                console.error('Error updating taller:', error);
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
        { nombre: 'Programación', ruta: '/consultar-programacion' },
    ];

    return (
        <div style={{ display: 'flex' }}>
            <MenuDesplegable menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="" rol="" imagenPerfil="ruta/a/imagen.jpg" />
                <div className="container">
                    <h1>Consultar Talleres</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="search-button">
                            <span className="search-icon">🔍</span>
                        </button>
                    </div>
                    <button onClick={() => navigate('/CrearTaller')} className="create-button">
                        Crear Nuevo Taller
                    </button>
                    {successMessage && (
                        <div className="mensaje-exito">
                            <span className="icono-exito">✔️</span>
                            {successMessage}
                        </div>
                    )}
                    <table className="estructura-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isSearchClicked && (
                                <tr>
                                    <td colSpan="3">Haga una búsqueda para ver los datos aquí.</td>
                                </tr>
                            )}
                            {isSearchClicked && filteredTalleres.length === 0 && (
                                <tr>
                                    <td colSpan="3">No hay datos disponibles para la búsqueda.</td>
                                </tr>
                            )}
                            {isSearchClicked && filteredTalleres.length > 0 && filteredTalleres.map((taller, index) => (
                                <tr key={taller.id}>
                                    {editIndex === index ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={editTaller.nombre}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="descripcion"
                                                    value={editTaller.descripcion}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <button onClick={handleSave} className="update-button">Guardar</button>
                                                <button onClick={handleCancel} className="cancel-button">Cancelar</button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{taller.nombre}</td>
                                            <td>{taller.descripcion}</td>
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

export default ConsultarTaller;
