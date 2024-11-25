import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import BarraLateral from '../components/BarraLateral';
import './ConsultarProfesional.css';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

function ConsultarProfesional() {
    const [profesionales, setProfesionales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProfesionales, setFilteredProfesionales] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const navigate = useNavigate();
    const rol = cookies.get('rol'); // Obtener el rol del usuario

    // Cargar profesionales desde la API
    useEffect(() => {
        axios.get('http://localhost:4000/profesional')
            .then(response => {
                setProfesionales(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los profesionales:', error);
            });
    }, []);

    // Filtrar profesionales basados en la búsqueda
    useEffect(() => {
        if (isSearchClicked) {
            const results = searchTerm
                ? profesionales.filter(profesional =>
                    profesional.nombre.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : [];
            setFilteredProfesionales(results);
        }
    }, [searchTerm, profesionales, isSearchClicked]);

    // Manejo de eventos
    const handleSearch = () => setIsSearchClicked(true);

    const handleCreateClick = () => {
        navigate('/crear-profesional');
    };

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
            <BarraLateral menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol={rol} imagenPerfil="ruta/a/imagen.jpg" />
                <div className="container">
                    <h1>Consultar Profesionales</h1>
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
                    {/* Mostrar el botón de "Crear Profesional" solo si el rol es Coordinador */}
                    {rol === 'Coordinador' && (
                        <button className="create-button" onClick={handleCreateClick}>
                            Crear Profesional
                        </button>
                    )}
                    <div className="profesionales-table-container">
                        {isSearchClicked && filteredProfesionales.length === 0 && searchTerm !== '' ? (
                            <p>No hay profesionales disponibles para la búsqueda.</p>
                        ) : (
                            <>
                                {isSearchClicked && filteredProfesionales.length === 0 && searchTerm === '' ? (
                                    <p>Haga una búsqueda para ver los resultados.</p>
                                ) : (
                                    <table className="profesionales-table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Número de Documento</th>
                                                <th>Nombre</th>
                                                <th>Correo</th>
                                                <th>Rol</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProfesionales.length > 0 ? (
                                                filteredProfesionales.map(profesional => (
                                                    <tr key={profesional.id}>
                                                        <td>{profesional.id}</td>
                                                        <td>{profesional.número_de_documento}</td>
                                                        <td>{profesional.nombre}</td>
                                                        <td>{profesional.correo}</td>
                                                        <td>{profesional.rol}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5">No hay datos disponibles.</td>
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
}

export default ConsultarProfesional;