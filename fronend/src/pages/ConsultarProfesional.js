import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional'; 
import MenuDesplegable from '../components/MenuDesplegable'; 
import '../css/consultar.css';

function ConsultarProfesional() {
    const [profesionales, setProfesionales] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProfesionales, setFilteredProfesionales] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editProfesional, setEditProfesional] = useState({
        id: '',
        numero_de_documento: '',
        nombre: '',
        correo: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // numero de elementos por página

    // Estado para ordenar
    const [sortField, setSortField] = useState('numero_de_documento'); // Campo por el que se va a ordenar
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' o 'desc'
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfesionales();
    }, []);

    useEffect(() => {
        if (isSearchClicked) {
            if (searchTerm === '') {
                setFilteredProfesionales([]);
            } else {
                const results = profesionales.filter(profesional =>
                    (profesional.nombre && profesional.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (profesional.numero_de_documento && String(profesional.numero_de_documento).toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredProfesionales(results);
            }
        }
    }, [searchTerm, profesionales, isSearchClicked]);

    const fetchProfesionales = () => {
        axios.get('http://localhost:4000/usuarios')
            .then(response => {
                // Filtrar usuarios que tengan el rol "Profesional"
                const soloProfesionales = response.data.filter(usuario => usuario.rol === 'Profesional');
                setProfesionales(soloProfesionales);
            })
            .catch(error => {
                console.error('Error fetching profesionales:', error);
            });
    };

    const handleSearch = () => {
        setIsSearchClicked(true);
        setCurrentPage(1); // Reiniciar la página actual al buscar
    };

    const handleSort = (field) => {
        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(direction);

        const sortedProfesionales = [...filteredProfesionales].sort((a, b) => {
            if (field === 'numero_de_documento') {
                return direction === 'asc' 
                    ? parseInt(a.numero_de_documento) - parseInt(b.numero_de_documento)
                    : parseInt(b.numero_de_documento) - parseInt(a.numero_de_documento);
            } else {
                const valueA = a[field].toLowerCase();
                const valueB = b[field].toLowerCase();
                return direction === 'asc' 
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
        });

        setFilteredProfesionales(sortedProfesionales);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditProfesional({
            ...filteredProfesionales[index],
            numero_de_documento: filteredProfesionales[index].numero_de_documento
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProfesional(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        if (!editProfesional.id) {
            setErrorMessage('ID del profesional no disponible.');
            return;
        }

        axios.put(`http://localhost:4000/usuarios/${editProfesional.id}`, editProfesional)
            .then(response => {
                const updatedProfesionales = [...filteredProfesionales];
                updatedProfesionales[editIndex] = response.data;
                setFilteredProfesionales(updatedProfesionales);
                setProfesionales(updatedProfesionales); 
                setSuccessMessage('Profesional actualizado exitosamente.'); 
                setEditIndex(null);
            })
            .catch(error => {
                console.error('Error updating profesional:', error);
                setErrorMessage('Error al actualizar el profesional.');
            });
    };

    const handleCancel = () => {
        setEditIndex(null);
    };

    // Manejo de paginación
    const indexOfLastProfesional = currentPage * itemsPerPage;
    const indexOfFirstProfesional = indexOfLastProfesional - itemsPerPage;
    const currentProfesionales = filteredProfesionales.slice(indexOfFirstProfesional, indexOfLastProfesional);

    const totalPages = Math.ceil(filteredProfesionales.length / itemsPerPage);

    return (
        <div className="menu-page">
            <EncabezadoProfesional />
            <MenuDesplegable />
            
            <div className="container">
                <div className="main-content">
                    <h1>Consultar Profesionales</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o numero de documento"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="search-button">
                            <span className="search-icon">🔍</span>
                        </button>
                    </div>

                    {successMessage && (
                        <div className="mensaje-exito">
                            <span className="icono-exito">✔️</span>
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mensaje-error">
                            <span className="icono-error">❌</span>
                            {errorMessage}
                        </div>
                    )}

                    <table className="instructor-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('numero_de_documento')} style={{ cursor: 'pointer' }}>
                                    numero de Documento {sortField === 'numero_de_documento' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('nombre')} style={{ cursor: 'pointer' }}>
                                    Nombre {sortField === 'nombre' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('correo')} style={{ cursor: 'pointer' }}>
                                    Correo {sortField === 'correo' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isSearchClicked && (
                                <tr>
                                    <td colSpan="3">Haga una búsqueda para ver los datos aquí.</td>
                                </tr>
                            )}
                            {isSearchClicked && filteredProfesionales.length === 0 && (
                                <tr>
                                    <td colSpan="3">No hay datos disponibles para la búsqueda.</td>
                                </tr>
                            )}
                            {isSearchClicked && currentProfesionales.length > 0 && currentProfesionales.map((profesional, index) => (
                                <tr key={profesional.id}>
                                    {editIndex === index ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="numero_de_documento"
                                                    value={editProfesional.numero_de_documento}
                                                    onChange={handleInputChange}
                                                    disabled
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="nombre"
                                                    value={editProfesional.nombre}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="email"
                                                    name="correo"
                                                    value={editProfesional.correo}
                                                    onChange={handleInputChange}
                                                />
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{profesional.numero_de_documento}</td>
                                            <td>{profesional.nombre}</td>
                                            <td>{profesional.correo}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {isSearchClicked && totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConsultarProfesional;
