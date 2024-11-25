import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/consultartaller.css';

function ConsultarProgramacion() {
    const [programaciones, setProgramaciones] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProgramaciones, setFilteredProgramaciones] = useState([]);
    const [isSearchClicked, setIsSearchClicked] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editProgramacion, setEditProgramacion] = useState({
        id: '',
        ficha_id: '',
        profesional_1: '',
        profesional_2: '',
        instructor_id: '',
        nombre: '',
        fecha: '',
        hora: '',
        sede: '',
        estado: ''
    });
    const [rolUsuario, setRolUsuario] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortColumn, setSortColumn] = useState('nombre');
    const itemsPerPage = 3;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfesionales();
        fetchFichas();
        fetchInstructores();
        fetchProgramaciones();
    }, []);

    useEffect(() => {
        if (isSearchClicked) {
            const results = programaciones.filter(programacion =>
                (fichas.find(f => f.id === programacion.ficha_id)?.numero_ficha.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredProgramaciones(results);
            setCurrentPage(1);
        }
    }, [searchTerm, programaciones, isSearchClicked, fichas]);

    useEffect(() => {
        const sortedProgramaciones = [...filteredProgramaciones].sort((a, b) => {
            let valueA, valueB;

            // Determinar los valores a comparar según la columna
            switch(sortColumn) {
                case 'ficha_id':
                    valueA = getFichaNumero(a.ficha_id).toLowerCase();
                    valueB = getFichaNumero(b.ficha_id).toLowerCase();
                    break;
                case 'nombre':
                    valueA = a.nombre.toLowerCase();
                    valueB = b.nombre.toLowerCase();
                    break;
                case 'profesionaL1':
                    valueA = getProfesionalNombre(a.profesional_1).toLowerCase();
                    valueB = getProfesionalNombre(b.profesional_1).toLowerCase();
                    break;

                case 'profesionaL2':
                    valueA = getProfesionalNombre2(a.profesional_2).toLowerCase();
                    valueB = getProfesionalNombre2(b.profesional_2).toLowerCase();
                    break;
                
                case 'instructor':
                    valueA = getInstructorNombre(a.instructor_id).toLowerCase();
                    valueB = getInstructorNombre(b.instructor_id).toLowerCase();
                    break;
                case 'fecha':
                    // Convertir fechas a objetos Date para comparación
                    valueA = new Date(a.fecha);
                    valueB = new Date(b.fecha);
                    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
                case 'hora':
                    // Convertir horas a formato comparable
                    valueA = a.hora.replace(':', '');
                    valueB = b.hora.replace(':', '');
                    break;
                case 'sede':
                    valueA = a.sede.toLowerCase();
                    valueB = b.sede.toLowerCase();
                    break;
                
            }

            if (sortColumn === 'fecha') return 0;
            if (sortOrder === 'asc') {
                return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
                return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
        });
        setFilteredProgramaciones(sortedProgramaciones);
    }, [sortOrder, sortColumn, fichas, profesionales, instructores]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortOrder('asc');
        }
    };

    const SortIndicator = ({ column }) => {
        if (sortColumn !== column) return null;
        return (
            <span style={{ 
                marginLeft: '5px',
                fontSize: '12px',
                color: '#666'
            }}>
                {sortOrder === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    const fetchProgramaciones = () => {
        axios.get('http://localhost:4000/programacion')
            .then(response => {
                let programaciones = response.data;
                const currentUserId = 'id_del_usuario_actual';
                if (rolUsuario === 'Profesional') {
                    programaciones = programaciones.filter(programacion =>
                        programacion.profesional_1 === currentUserId ||
                        programacion.profesional_2 === currentUserId
                    );
                }
                setProgramaciones(programaciones);
                setFilteredProgramaciones(programaciones);
            })
            .catch(error => {
                console.error('Error fetching programaciones:', error);
            });
    };

    const fetchFichas = () => {
        axios.get('http://localhost:4000/ficha')
            .then(response => {
                setFichas(response.data);
            })
            .catch(error => {
                console.error('Error fetching fichas:', error);
            });
    };

    const fetchProfesionales = () => {
        axios.get('http://localhost:4000/usuarios')
            .then(response => {
                const profesionales = response.data.filter(usuario => usuario.rol === 'Profesional');
                setProfesionales(profesionales);
                const usuarioActual = response.data.find(usuario => usuario.id === 'id_del_usuario_actual');
                if (usuarioActual) {
                    setRolUsuario(usuarioActual.rol);
                }
            })
            .catch(error => console.error('Error fetching profesionales:', error));
    };

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
        setEditProgramacion({ ...filteredProgramaciones[index] });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditProgramacion(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        axios.put(`http://localhost:4000/programacion/${editProgramacion.id}`, editProgramacion)
            .then(response => {
                const updatedProgramaciones = [...filteredProgramaciones];
                updatedProgramaciones[editIndex] = response.data;
                setFilteredProgramaciones(updatedProgramaciones);
                setEditIndex(null);
                setMensajeExito('Programación actualizada con éxito.');
                setTimeout(() => setMensajeExito(''), 3000);
            })
            .catch(error => {
                console.error('Error updating programacion:', error);
            });
    };

    const handleCancel = () => {
        setEditIndex(null);
    };

    const handleRevisarEvidencia = (idProgramacion) => {
        navigate(`/revisar-evidencia/${idProgramacion}`);
    };

    const getFichaNumero = (fichaId) => {
        const ficha = fichas.find(f => f.id === fichaId);
        return ficha ? ficha.numero_ficha : 'Desconocido';
    };

    const getProfesionalNombre = (id) => {
        const profesional = profesionales.find(profesional => profesional.id === id);
        return profesional ? `${profesional.nombre || ''} ${profesional.apellido || ''}`.trim() : '';
    };

    const getProfesionalNombre2 = (id) => {
        const profesional = profesionales.find(profesional => profesional.id === id);
        return profesional ? `${profesional.nombre || ''} ${profesional.apellido || ''}`.trim() : '';
    };

    const getInstructorNombre = (instructorId) => {
        const instructor = instructores.find(i => i.id === instructorId);
        return instructor ? `${instructor.nombre || ''} ${instructor.apellido || ''}`.trim() : '';
    };

    const menuItems = [
        { nombre: 'Inicio', ruta: 'Home-page' },
        { nombre: 'Usuarios', ruta: '/usuarios' },
        { nombre: 'Ficha', ruta: '/consultar-ficha' },
        { nombre: 'Instructores', ruta: '/consultar-instructor' },
        { nombre: 'Profesional', ruta: '/consultar-profesional' },
        { nombre: 'Horario Ficha', ruta: '/consultar-horario-ficha' },
        { nombre: 'Programacion', ruta: '/consultar-programacion' },
    ];

    const indexOfLastProgramacion = currentPage * itemsPerPage;
    const indexOfFirstProgramacion = indexOfLastProgramacion - itemsPerPage;
    const currentProgramaciones = filteredProgramaciones.slice(indexOfFirstProgramacion, indexOfLastProgramacion);
    const totalPages = Math.ceil(filteredProgramaciones.length / itemsPerPage);

    return (
        <div style={{ display: 'flex' }}>
            <MenuDesplegable menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol="Administrador" imagenPerfil="ruta/a/imagen.jpg" />
                <div className="container">
                    <h1>Consultar Programación</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por número de ficha"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearch} className="search-button">
                            <span className="search-icon">🔍</span>
                        </button>
                    </div>
                    <button onClick={() => navigate('/CrearProgramacion')} className="create-button">
                        Crear Nueva Programación 
                    </button>
                    {mensajeExito && (
                        <div className="mensaje-exito">
                            {mensajeExito}
                        </div>
                    )}
                    <table className="estructura-table">
                    <thead>
                            <tr>
                           
                               
                                <th onClick={() => handleSort('ficha_id')} className="sortable-header">
                                    N° Ficha
                                    <SortIndicator column="ficha_id" />
                                 </th>
                                 <th onClick={() => handleSort('nombre')} className="sortable-header">
                                    Nombre Taller
                                    <SortIndicator column="nombre" />
                                </th>
                                
                                
                                <th onClick={() => handleSort('profesionaL1')} className="sortable-header">

                                    Profesionales 1
                                    <SortIndicator column="profesional1" />
                                </th>

                                <th onClick={() => handleSort('profesionaL2')} className="sortable-header">

                                    Profesionales 2
                                    <SortIndicator column="profesional2" />
                                </th>
                                
                                <th onClick={() => handleSort('instructor')} className="sortable-header">
                                    Instructor
                                    <SortIndicator column="instructor" />
                                </th>
                                <th onClick={() => handleSort('fecha')} className="sortable-header">
                                    Fecha
                                    <SortIndicator column="fecha" />
                                </th>
                                <th onClick={() => handleSort('hora')} className="sortable-header">
                                    Hora
                                    <SortIndicator column="hora" />
                                </th>
                                <th onClick={() => handleSort('sede')} className="sortable-header">
                                    Sede
                                    <SortIndicator column="sede" />
                                </th>
                                
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>


                            
                            {currentProgramaciones.map((programacion, index) => (
                               <tr key={programacion.id}>
                               {editIndex === index ? (
                                   <>
                                    <td>{getFichaNumero(editProgramacion.ficha_id)}</td>
                                       <td>
                                           <input
                                               type="text"
                                               name="nombre"
                                               value={editProgramacion.nombre}
                                               onChange={handleInputChange}
                                           />
                                       </td>
                                      
                                       <td>
                                           <select
                                               name="profesional_1"
                                               value={editProgramacion.profesional_1}
                                               onChange={handleInputChange}
                                           >
                                               {profesionales.map(profesional => (
                                                   <option key={profesional.id} value={profesional.id}>
                                                       {getProfesionalNombre(profesional.id)}
                                                   </option>
                                               ))}
                                           </select>
                                       </td>
                                       <td>
                                           <select
                                               name="profesional_2"
                                               value={editProgramacion.profesional_2}
                                               onChange={handleInputChange}
                                           >
                                               {profesionales.map(profesional => (
                                                   <option key={profesional.id} value={profesional.id}>
                                                       {getProfesionalNombre(profesional.id)}
                                                   </option>
                                               ))}
                                           </select>
                                       </td>
                                       <td>
                                           <select
                                               name="instructor_id"
                                               value={editProgramacion.instructor_id}
                                               onChange={handleInputChange}
                                           >
                                               {instructores.map(instructor => (
                                                   <option key={instructor.id} value={instructor.id}>
                                                       {getInstructorNombre(instructor.id)}
                                                   </option>
                                               ))}
                                           </select>
                                       </td>
                                       <td>
                                           <input
                                               type="date"
                                               name="fecha"
                                               value={editProgramacion.fecha}
                                               onChange={handleInputChange}
                                           />
                                       </td>
                                       <td>
                                           <input
                                               type="time"
                                               name="hora"
                                               value={editProgramacion.hora}
                                               onChange={handleInputChange}
                                           />
                                       </td>
                                       <td>
                                           

                                            <select
                                               name="sede"
                                               value={editProgramacion.sede}
                                               onChange={handleInputChange}
                                           >
                                               <option value="Calle 52">Calle 52</option>
                                <option value="Calle 45">Calle 63</option>
                                <option value="Calle 35">fontibon</option>
                                           </select>
                                           
                                       </td>
                                       
                                       <td>
                                           <button onClick={handleSave}>Guardar</button>
                                           <button onClick={handleCancel}>Cancelar</button>
                                       </td>
                                   </>
                               ) : (
                                   <>
                                       
                                       <td>{getFichaNumero(programacion.ficha_id)}</td>
                                       <td>{programacion.nombre}</td> {/* Mostrar el nombre aquí */}
                                       <td>{getProfesionalNombre(programacion.profesional_1)}</td>
                                       <td>{getProfesionalNombre(programacion.profesional_2)}</td>
                                       <td>{getInstructorNombre(programacion.instructor_id)}</td>
                                       <td>{programacion.fecha}</td>
                                       <td>{programacion.hora}</td>
                                       <td>{programacion.sede}</td>
                                       
                                       <td>
                                           <button onClick={() => handleEdit(index)}>Editar</button>
                                           
                                       </td>
                                   </>
                               )}
                           </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={currentPage === i + 1 ? 'active' : ''}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsultarProgramacion;