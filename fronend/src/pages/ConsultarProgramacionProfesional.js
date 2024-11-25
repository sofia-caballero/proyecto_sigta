import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import EvidenciaModal from '../components/modal'; // Verifica que modal.js exporta EvidenciaModal

const ConsultarProgramacionProfesional = () => {
    const [programacion, setProgramacion] = useState([]);
    const [filteredProgramacion, setFilteredProgramacion] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProgramacion, setSelectedProgramacion] = useState(null);

    const cookies = new Cookies();
    const profesionalId = cookies.get('id');
    const profesionalNombre = cookies.get('nombre');

    useEffect(() => {
        const fetchData = async (url, setter) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setter(data);
            } catch (error) {
                console.error(`Error fetching ${url}:`, error);
                setError(error.message);
            }
        };

        const fetchProgramacion = async () => {
            try {
                const response = await fetch('http://localhost:4000/programacion');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const filteredData = data.filter(
                    (item) =>
                        item.profesional_1 === profesionalId ||
                        item.profesional_2 === profesionalId ||
                        item.instructor_id === profesionalId
                );
                setProgramacion(filteredData);
                setFilteredProgramacion(filteredData);
                setMessage(
                    filteredData.length === 0
                        ? 'No hay programación disponible para este profesional.'
                        : ''
                );
            } catch (error) {
                console.error('Error fetching programacion:', error);
                setError(error.message);
            }
        };

        fetchProgramacion();
        fetchData('http://localhost:4000/usuarios', setUsuarios);
        fetchData('http://localhost:4000/instructor', setInstructores);
        fetchData('http://localhost:4000/ficha', setFichas);
    }, [profesionalId]);

    useEffect(() => {
        const filtered = programacion.filter((item) => {
            const nombre = item.nombre?.toLowerCase() || '';
            const numeroFicha = getNumeroFicha(item.ficha_id)?.toString() || '';
            const nombreProfesional1 = getNombreUsuario(item.profesional_1)?.toLowerCase() || '';
            const nombreProfesional2 = getNombreUsuario(item.profesional_2)?.toLowerCase() || '';
            const instructorNombre = getNombreInstructor(item.instructor_id)?.toLowerCase() || '';
            const fecha = item.fecha?.toLowerCase() || '';
            const sede = item.sede?.toLowerCase() || '';

            return (
                nombre.includes(searchTerm.toLowerCase()) ||
                numeroFicha.includes(searchTerm) ||
                nombreProfesional1.includes(searchTerm.toLowerCase()) ||
                nombreProfesional2.includes(searchTerm.toLowerCase()) ||
                instructorNombre.includes(searchTerm.toLowerCase()) ||
                fecha.includes(searchTerm.toLowerCase()) ||
                sede.includes(searchTerm.toLowerCase())
            );
        });
        setFilteredProgramacion(filtered);
    }, [searchTerm, programacion]);

    const getNombreUsuario = (id) => {
        const usuario = usuarios.find((user) => user.id === id);
        return usuario ? usuario.nombre : 'Desconocido';
    };

    const getNombreInstructor = (id) => {
        const instructor = instructores.find((inst) => inst.id === id);
        return instructor ? instructor.nombre : 'Desconocido';
    };

    const getNumeroFicha = (id) => {
        const ficha = fichas.find((ficha) => ficha.id === id);
        return ficha ? ficha.numero_ficha : 'Desconocido';
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    const menuItems = [
        { nombre: 'Inicio', ruta: 'Home-page' },
        { nombre: 'Usuarios', ruta: '/usuarios' },
        { nombre: 'Ficha', ruta: '/consultar-ficha' },
        { nombre: 'Instructores', ruta: '/consultar-instructor' },
        { nombre: 'Profesional', ruta: '/consultar-profesional' },
        { nombre: 'Horario Ficha', ruta: '/consultar-horario-ficha' },
        { nombre: 'Programación', ruta: '/consultar-programacion' },
    ];

    const openModal = (programacionItem) => {
        setSelectedProgramacion(programacionItem);
        setModalVisible(true);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <MenuDesplegable menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional
                    nombreUsuario={profesionalNombre}
                    rol=""
                    imagenPerfil="ruta/a/imagen.jpg"
                />
                <div className="container">
                    <h1>Consultar Programaciones</h1>
                    {message && <div className="mensaje-exito">{message}</div>}

                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, número de ficha, profesional, instructor, fecha o sede"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button onClick={() => {}} className="search-button">
                            🔍
                        </button>
                    </div>

                    <div className="programacion-container">
                        {filteredProgramacion.length > 0 ? (
                            filteredProgramacion.map((item) => (
                                <div key={item.id} className="programacion-box">
                                    <h3>{item.nombre}</h3>
                                    <p><strong>Número de Ficha:</strong> {getNumeroFicha(item.ficha_id)}</p>
                                    <p><strong>Profesional 1:</strong> {getNombreUsuario(item.profesional_1)}</p>
                                    <p><strong>Profesional 2:</strong> {getNombreUsuario(item.profesional_2)}</p>
                                    <p><strong>Instructor:</strong> {getNombreInstructor(item.instructor_id)}</p>
                                    <p><strong>Fecha:</strong> {item.fecha}</p>
                                    <p><strong>Hora:</strong> {item.hora}</p>
                                    <p><strong>Sede:</strong> {item.sede}</p>
                                    <button onClick={() => openModal(item)}>Evidencia</button>
                                </div>
                            ))
                        ) : (
                            <div>No hay programación disponible para este profesional.</div>
                        )}
                    </div>
                </div>
            </div>

            <EvidenciaModal
                isOpen={modalVisible}
                onClose={() => setModalVisible(false)}
                initialData={selectedProgramacion}
            />
        </div>
    );
};

export default ConsultarProgramacionProfesional;
const style = `
.container {
    padding: 40px;
    background-color: #d4edda;
    border-radius: 15px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.container:hover {
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
    transform: translateY(-5px);
}

.search-bar {
    display: flex;
    
    margin-bottom: 40px;
    transition: all 0.3s ease;
}

.search-bar input {
    width: 350px;
    padding: 14px 18px;
    border: 2px solid #28a745;
    border-radius: 8px;
    font-size: 1.1rem;
    color: #444;
    background-color: #f8f9fa;
    transition: all 0.3s ease;
}

.search-bar input:focus {
    border-color: #218838;
    outline: none;
    background-color: #ffffff;
}

.search-bar button {
    padding: 14px 22px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    margin-left: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-bar button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.programacion-container {
    display: flex;
    flex-wrap: wrap;
    gap: 35px;
    justify-content: center;
    margin-top: 40px;
}

.programacion-box {
    width: 23%; /* Esto asegura que haya 4 recuadros por fila */
    max-width: 320px;
    padding: 25px;
    background-color: #f8f9fa; /* Color de fondo verde claro */
    border-radius: 15px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 2px solid #28a745; /* Borde verde */
}

.programacion-box:hover {
    transform: translateY(-8px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
    background-color: #c3e6cb; /* Fondo verde más oscuro al hacer hover */
}

.programacion-box h3 {
    color: #155724; /* Título en un verde más oscuro */
    font-size: 1.6rem;
    margin-bottom: 18px;
    font-weight: bold;
}

.programacion-box p {
    margin: 8px 0;
    color: #6c757d; /* Texto en gris claro */
    font-size: 1.1rem;
}

.programacion-box button {
    padding: 12px 18px;
    background-color: #28a745; /* Botón verde */
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s ease, transform 0.3s ease;
}

.programacion-box button:hover {
    background-color: #218838; /* Botón verde más oscuro al hacer hover */
    transform: scale(1.05);
}

.mensaje-exito {
    background-color: #d4edda;
    padding: 20px;
    border-radius: 12px;
    color: #155724;
    font-size: 1.1rem;
    margin-bottom: 35px;
    border: 2px solid #c3e6cb;
    text-align: center;
    font-weight: bold;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Media Query para pantallas pequeñas */
@media (max-width: 1024px) {
    .programacion-box {
        width: 48%; /* Dos recuadros por línea en pantallas medianas */
    }
}

@media (max-width: 768px) {
    .programacion-box {
        width: 100%; /* Un recuadro por línea en pantallas pequeñas */
    }
}
`;


const styleElement = document.createElement('style');
styleElement.innerHTML = style;
document.head.appendChild(styleElement);
