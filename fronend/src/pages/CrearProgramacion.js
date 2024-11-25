import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/CrearTaller.css';

function CrearProgramacion() {
    const [fichas, setFichas] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [instructores, setInstructores] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        ficha_id: '',
        profesional_1: '',
        profesional_2: '',
        instructor_id: '',
        fecha: '',
        hora: '',
        sede: '',
        estado: ''
    });
    const [selectedImage, setSelectedImage] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si el modal está abierto
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 }); // Posición del modal
    const navigate = useNavigate();

    useEffect(() => {
        fetchFichas();
        fetchProfesionales();
        fetchInstructores();
    }, []);

    const fetchFichas = () => {
        axios.get('http://localhost:4000/ficha')
            .then(response => setFichas(response.data))
            .catch(error => console.error('Error fetching fichas:', error));
    };

    const fetchProfesionales = () => {
        axios.get('http://localhost:4000/usuarios')
            .then(response => {
                const filteredProfesionales = response.data.filter(usuario => usuario.rol === 'Profesional');
                setProfesionales(filteredProfesionales);
            })
            .catch(error => console.error('Error fetching profesionales:', error));
    };

    const fetchInstructores = () => {
        axios.get('http://localhost:4000/instructor')
            .then(response => setInstructores(response.data))
            .catch(error => console.error('Error fetching instructores:', error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
        if (name === 'ficha_id') {
            const selectedFicha = fichas.find(ficha => ficha.id === parseInt(value));
            if (selectedFicha && selectedFicha.imagen) {
                handleViewImage(selectedFicha.imagen);
            } else {
                setSelectedImage('');
            }
        }
    };

    const handleViewImage = (imagen) => {
        setSelectedImage(`http://localhost:4000/${imagen}`);
        setIsModalOpen(true); // Abrir el modal cuando se selecciona una ficha con imagen
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Cerrar el modal
    };

    const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;

        const onMouseMove = (moveEvent) => {
            const newX = modalPosition.x + (moveEvent.clientX - startX);
            const newY = modalPosition.y + (moveEvent.clientY - startY);
            setModalPosition({ x: newX, y: newY });
        };

        const onMouseUp = () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const validateForm = () => {
        let isValid = true;
        let validationErrors = {};

        if (formData.profesional_1 === formData.profesional_2) {
            validationErrors.profesional_1 = 'No se puede seleccionar el mismo profesional para ambos campos.';
            isValid = false;
        }

        if (formData.fecha) {
            const selectedDate = new Date(formData.fecha);
            const dayOfWeek = selectedDate.getUTCDay();
            if (dayOfWeek === 0) {
                validationErrors.fecha = 'No se pueden programar talleres los domingos.';
                isValid = false;
            }
        }

        const existingPrograms = []; // Aquí se debería hacer una consulta para obtener los programas existentes.
        const programConflict = existingPrograms.find(program => 
            program.nombre === formData.nombre &&
            program.fecha === formData.fecha &&
            program.hora === formData.hora
        );

        if (programConflict) {
            validationErrors.conflict = 'Ya hay un taller programado para este horario.';
            isValid = false;
        }

        setErrors(validationErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post('http://localhost:4000/programacion', formData)
                .then(response => {
                    setSuccessMessage('La programación se ha creado exitosamente.');
                    setTimeout(() => {
                        navigate('/ConsultarProgramacion');
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setErrors({
                        ...errors,
                        submitError: 'Hubo un error al crear la programación. Inténtalo nuevamente.'
                    });
                });
        }
    };

    const nombres = [
        'Psicología',
        'Deporte',
        'Arte - Música',
        'Arte - Danza',
        'Arte - Teatro',
        'Cultura'
    ];

    return (
        <div style={{ display: 'flex' }}>
            <MenuDesplegable menuItems={[
                { nombre: 'Inicio', ruta: 'Home-page' },
                { nombre: 'Usuarios', ruta: '/usuarios' },
                { nombre: 'Ficha', ruta: '/consultar-ficha' },
                { nombre: 'Instructores', ruta: '/consultar-instructor' },
                { nombre: 'Profesional', ruta: '/consultar-profesional' },
                { nombre: 'Taller', ruta: '/consultar-taller' },
                { nombre: 'Horario Ficha', ruta: '/consultar-horario-ficha' },
                { nombre: 'Programacion', ruta: '/ConsultarProgramacion' },
            ]} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol="Administrador" imagenPerfil="ruta/a/imagen.jpg" />
                <div className="formularioContenedor">
                    <h1>Crear Programación</h1>
                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}
                    {errors.submitError && (
                        <div className="error-message">
                            {errors.submitError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <select id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required>
                                <option value="">Seleccionar Nombre</option>
                                {nombres.map((nombre, index) => (
                                    <option key={index} value={nombre}>{nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ficha_id">Ficha</label>
                            <select id="ficha_id" name="ficha_id" value={formData.ficha_id} onChange={handleChange} required>
                                <option value="">Seleccionar Ficha</option>
                                {fichas.map(ficha => (
                                    <option key={ficha.id} value={ficha.id}>{ficha.numero_ficha}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="profesional_1">Profesional 1</label>
                            <select id="profesional_1" name="profesional_1" value={formData.profesional_1} onChange={handleChange} required>
                                <option value="">Seleccionar Profesional 1</option>
                                {profesionales.map(profesional => (
                                    <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="profesional_2">Profesional 2</label>
                            <select id="profesional_2" name="profesional_2" value={formData.profesional_2} onChange={handleChange} required>
                                <option value="">Seleccionar Profesional 2</option>
                                {profesionales.map(profesional => (
                                    <option key={profesional.id} value={profesional.id}>{profesional.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="instructor_id">Instructor</label>
                            <select id="instructor_id" name="instructor_id" value={formData.instructor_id} onChange={handleChange} required>
                                <option value="">Seleccionar Instructor</option>
                                {instructores.map(instructor => (
                                    <option key={instructor.id} value={instructor.id}>{instructor.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha">Fecha</label>
                            <input type="date" id="fecha" name="fecha" value={formData.fecha} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hora">Hora</label>
                            <input type="time" id="hora" name="hora" value={formData.hora} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sede">Sede</label>
                            <select id="sede" name="sede" value={formData.sede} onChange={handleChange} required>
                                <option value="">Seleccionar Sede</option>
                                <option value="Calle 52">Calle 52</option>
                                <option value="Calle 63">Calle 63</option>
                                <option value="Fontibon">Fontibon</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <select id="estado" name="estado" value={formData.estado} onChange={handleChange} required>
                                <option value="Programado">Programado</option>
                                <option value="Finalizado">Finalizado</option>
                                <option value="Cancelado">Cancelado</option>
                            </select>
                        </div>

                        {/* Botón para ver imagen si el modal está cerrado */}
                        {selectedImage && !isModalOpen && (
                            <button type="button" onClick={() => setIsModalOpen(true)}>
                                Ver Imagen
                            </button>
                        )}
                        
                        <button type="submit">Crear Programación</button>
                    </form>

                    {/* Modal de imagen */}
                    {isModalOpen && (
                      <div
                      className="modal"
                      style={{
                          position: 'absolute',
                          top: modalPosition.y,
                          left: modalPosition.x,
                          cursor: 'move',
                          background: 'none',
                          boxShadow: 'none',
                      }}
                      onMouseDown={handleMouseDown}
                  >
                      <div className="modal-content">
                          <button onClick={handleCloseModal}>Cerrar</button>
                          <img src={selectedImage} className="image-bordered" />
                      </div>
                  </div>
                 
                   
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrearProgramacion;