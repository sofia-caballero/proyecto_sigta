import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/CrearTaller.css';

function CrearFicha() {
    const [numeroFicha, setNumeroFicha] = useState('');
    const [programaFormacion, setProgramaFormacion] = useState('');
    const [sede, setSede] = useState('Sede La 52');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [estado, setEstado] = useState('Activo');
    const [imagen, setImagen] = useState(null);  // Nuevo estado para la imagen
    const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);  // Estado para la vista previa
    const [mensajeExito, setMensajeExito] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('numero_ficha', numeroFicha);
        formData.append('programa_formacion', programaFormacion);
        formData.append('sede', sede);
        formData.append('fecha_inicio', fechaInicio);
        formData.append('fecha_fin', fechaFin);
        formData.append('estado', estado);
        if (imagen) {
            formData.append('imagen', imagen);  // Asegurarse de que la imagen se adjunta
        }

        axios.post('http://localhost:4000/ficha', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Ficha creada:', response.data);
                setMensajeExito(true);
                setTimeout(() => {
                    setMensajeExito(false);
                    navigate('/ConsultarFicha');
                }, 3000);
            })
            .catch(error => {
                console.error('Error creando la ficha:', error);
            });
    };

    const menuItems = [
        { nombre: 'Inicio', ruta: 'Home-page' },
        { nombre: 'Usuarios', ruta: '/usuarios' },
        { nombre: 'Ficha', ruta: '/ConsultarFicha' },
        { nombre: 'Instructores', ruta: '/consultar-instructor' },
        { nombre: 'Profesional', ruta: '/consultar-profesional' },
        { nombre: 'Taller', ruta: '/consultar-taller' },
        { nombre: 'Horario Ficha', ruta: '/consultar-horario-ficha' },
        { nombre: 'Programacion', ruta: '/consultar-programacion' },
    ];

    // Maneja el cambio de imagen y muestra la vista previa
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagenVistaPrevia(reader.result);  // Establece la vista previa
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <MenuDesplegable menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol="Administrador" imagenPerfil="ruta/a/imagen.jpg" />
                <div className="formularioContenedor">
                    <h1>Crear Nueva Ficha</h1>
                    {mensajeExito && (
                        <div className="mensaje-exito" style={{ textAlign: 'center' }}>
                            <p>Ficha creada correctamente</p>
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                style={{ color: 'green', fontSize: '50px', marginTop: '10px' }}
                            />
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="crear-taller-content">
                        <div className="form-group">
                            <label>Número de Ficha:</label>
                            <input
                                type="text"
                                value={numeroFicha}
                                onChange={e => setNumeroFicha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Programa de Formación:</label>
                            <input
                                type="text"
                                value={programaFormacion}
                                onChange={e => setProgramaFormacion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Sede:</label>
                            <select
                                value={sede}
                                onChange={e => setSede(e.target.value)}
                                required
                            >
                                <option value="Sede La 52">Sede La 52</option>
                                <option value="Sede La 63">Sede La 63</option>
                                <option value="Sede Fontibón">Sede Fontibón</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Fecha de Inicio:</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={e => setFechaInicio(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de Fin:</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={e => setFechaFin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado:</label>
                            <select
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Imagen:</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                            />
                            {imagenVistaPrevia && (
                                <div style={{ marginTop: '10px' }}>
                                    <img
                                        src={imagenVistaPrevia}
                                        alt="Vista previa"
                                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="btn-crear">
                            Crear Ficha
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearFicha;
