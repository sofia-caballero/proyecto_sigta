import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/consultar.css';

function ConsultarFicha() {
    const [fichas, setFichas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFichas, setFilteredFichas] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [editFicha, setEditFicha] = useState(null); // Cambio: null en lugar de un objeto vacío
    const [successMessage, setSuccessMessage] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'numero_ficha', direction: 'ascending' });

    const navigate = useNavigate();

    useEffect(() => {
        fetchFichas();
    }, []);

    useEffect(() => {
        if (isSearchClicked) {
            if (searchTerm === '') {
                setFilteredFichas([]);
            } else {
                const results = fichas.filter(ficha =>
                    (ficha.numero_ficha && ficha.numero_ficha.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (ficha.programa_formacion && ficha.programa_formacion.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredFichas(results);
            }
        }
    }, [searchTerm, fichas, isSearchClicked]);

    useEffect(() => {
        if (filteredFichas.length > 0) {
            sortFichas();
        }
    }, [filteredFichas, sortConfig]);

    const fetchFichas = () => {
        axios.get('http://localhost:4000/ficha')
            .then(response => {
                setFichas(response.data);
            })
            .catch(error => {
                console.error('Error fetching fichas:', error);
            });
    };

    const handleSearch = () => {
        setIsSearchClicked(true);
    };

    const handleEdit = (ficha) => {
        setEditFicha(ficha); // Establece la ficha seleccionada para editar
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFicha(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (editFicha) {
            axios.put(`http://localhost:4000/ficha/${editFicha.id}`, editFicha)
                .then(response => {
                    // Actualiza la ficha editada en el listado de fichas
                    const updatedFichas = fichas.map(ficha =>
                        ficha.id === response.data.id ? response.data : ficha
                    );
                    setFichas(updatedFichas);
                    setSuccessMessage('Ficha actualizada correctamente');
                    setEditFicha(null); // Vuelve a la vista normal después de guardar
                })
                .catch(error => {
                    console.error('Error updating ficha:', error);
                });
        }
    };

    const handleCancel = () => {
        setEditFicha(null); // Cancela la edición y vuelve a la vista normal
    };

    const sortFichas = () => {
        const sortedFichas = [...filteredFichas].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setFilteredFichas(sortedFichas);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // Eliminar la lógica de paginación
    const currentFichas = isSearchClicked && filteredFichas.length > 0 ? filteredFichas : fichas;

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
                    <h1>Consultar Fichas</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por número de ficha o programa de formación"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="search-button">
                            <span className="search-icon">🔍</span>
                        </button>
                    </div>
                    <button onClick={() => navigate('/CrearFicha')} className="create-button">
                        Crear Nueva Ficha
                    </button>
                    {successMessage && (
                        <div className="mensaje-exito">
                            <span className="icono-exito">✔️</span>
                            {successMessage}
                        </div>
                    )}
                    {editFicha ? (
                        // Formulario de edición
                        <div>
                            <h2>Editar Ficha</h2>
                            <input
                                type="text"
                                name="numero_ficha"
                                value={editFicha.numero_ficha}
                                onChange={handleInputChange}
                                placeholder="Número de Ficha"
                            />
                            <input
                                type="text"
                                name="programa_formacion"
                                value={editFicha.programa_formacion}
                                onChange={handleInputChange}
                                placeholder="Programa de Formación"
                            />
                            <input
                                type="text"
                                name="sede"
                                value={editFicha.sede}
                                onChange={handleInputChange}
                                placeholder="Sede"
                            />
                            <input
                                type="date"
                                name="fecha_inicio"
                                value={editFicha.fecha_inicio}
                                onChange={handleInputChange}
                            />
                            <input
                                type="date"
                                name="fecha_fin"
                                value={editFicha.fecha_fin}
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                name="estado"
                                value={editFicha.estado}
                                onChange={handleInputChange}
                                placeholder="Estado"
                            />
                            <input
                                type="file"
                                name="imagen_url"
                                onChange={handleInputChange} // Asegúrate de procesar la imagen correctamente
                            />
                            <button onClick={handleSave}>Guardar</button>
                            <button onClick={handleCancel}>Cancelar</button>
                        </div>
                    ) : (
                        // Tabla de fichas
                        <table className="instructor-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('numero_ficha')}>Número de Ficha</th>
                                    <th onClick={() => handleSort('programa_formacion')}>Programa de Formación</th>
                                    <th onClick={() => handleSort('sede')}>Sede</th>
                                    <th onClick={() => handleSort('fecha_inicio')}>Fecha de Inicio</th>
                                    <th onClick={() => handleSort('fecha_fin')}>Fecha de Fin</th>
                                    <th onClick={() => handleSort('estado')}>Estado</th>
                                    <th>Imagen</th> {/* Nueva columna de imagen */}
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFichas.map((ficha) => (
                                    <tr key={ficha.id}>
                                        <td>{ficha.numero_ficha}</td>
                                        <td>{ficha.programa_formacion}</td>
                                        <td>{ficha.sede}</td>
                                        <td>{ficha.fecha_inicio}</td>
                                        <td>{ficha.fecha_fin}</td>
                                        <td>{ficha.estado}</td>
                                        <td>
                                            {ficha.imagen ? (
                                                <img
                                                    src={`http://localhost:4000/${ficha.imagen}`} 
                                                    alt="Imagen de la ficha"
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            ) : (
                                                <span>No disponible</span>
                                            )}
                                        </td>
                                        <td>
                                            <button onClick={() => handleEdit(ficha)}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConsultarFicha;
