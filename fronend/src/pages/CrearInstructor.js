import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/CrearTaller.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

function CrearInstructor() {
    const [numeroCedula, setNumeroCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [email, setEmail] = useState('');
    const [sede, setSede] = useState('Sede La 52');
    const [estado, setEstado] = useState('Activo');
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const nuevoInstructor = {
            numero_cedula: numeroCedula,
            nombre: nombre,
            fecha_nacimiento: fechaNacimiento,
            direccion: direccion,
            email: email,
            sede: sede,
            estado: estado
        };

        axios.post('http://localhost:4000/instructor', nuevoInstructor)
            .then(response => {
                console.log('Instructor creado:', response.data);
                setMensajeExito('Instructor creado correctamente');
                setTimeout(() => {
                    setMensajeExito('');
                    navigate('/ConsultarInstructor');
                }, 3000);
            })
            .catch(error => {
                console.error('Error creando el instructor:', error);
                setMensajeError('Hubo un error al crear el instructor. Intenta nuevamente.');
            });
    };

    const menuItems = [
        { nombre: 'Inicio', ruta: 'Home-page' },
        { nombre: 'Usuarios', ruta: '/usuarios' },
        { nombre: 'Ficha', ruta: '/consultar-ficha' },
        { nombre: 'Instructores', ruta: '/ConsultarInstructor' },
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
                <div className="formularioContenedor">
                    <h1>Crear Nuevo Instructor</h1>
                    {mensajeExito && (
                        <div className="mensaje-exito" style={{ textAlign: 'center', color: 'green' }}>
                            <p>{mensajeExito}</p>
                            <FontAwesomeIcon 
                                icon={faCheckCircle} 
                                style={{ fontSize: '30px', marginTop: '10px' }} 
                            />
                        </div>
                    )}
                    {mensajeError && (
                        <div className="mensaje-error" style={{ textAlign: 'center', color: 'red' }}>
                            <p>{mensajeError}</p>
                            <FontAwesomeIcon 
                                icon={faExclamationTriangle} 
                                style={{ fontSize: '30px', marginTop: '10px' }} 
                            />
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Número de Cédula:</label>
                            <input
                                type="text"
                                value={numeroCedula}
                                onChange={e => setNumeroCedula(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de Nacimiento:</label>
                            <input
                                type="date"
                                value={fechaNacimiento}
                                onChange={e => setFechaNacimiento(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección:</label>
                            <input
                                type="text"
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                            <label>Estado:</label>
                            <select
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                                required
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <button type="submit" className="submit-button">Guardar Instructor</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearInstructor;
