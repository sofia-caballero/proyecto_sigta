import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EncabezadoProfesional from '../components/EncabezadoProfesional'; // Asegúrate de que la ruta sea correcta
import MenuDesplegable from '../components/MenuDesplegable'; // Asegúrate de que la ruta sea correcta
import '../css/CrearTaller.css';

function CrearTaller() {
    const [nombre, setNombre] = useState('salud');
    const [descripcion, setDescripcion] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMensajeError('');
        setMensajeExito('');

        const nuevoTaller = {
            nombre: nombre,
            descripcion: descripcion,
        };

        axios.post('http://localhost:4000/taller', nuevoTaller)
            .then(response => {
                console.log('Taller creado:', response.data);
                setMensajeExito('Taller creado exitosamente.');
                setTimeout(() => navigate('/ConsultarTaller'), 2000); // Redirige después de 2 segundos para mostrar el mensaje de éxito
            })
            .catch(error => {
                console.error('Error creando el taller:', error);
                setMensajeError('Error al crear el taller. Inténtalo de nuevo.');
            });
    };

    return (
        <div className="menu-page">
            <EncabezadoProfesional /> {/* Componente EncabezadoProfesional */}
            <MenuDesplegable /> {/* Componente MenuDesplegable */}
            
            <div className="formularioContenedor">
                <div className="crear-taller-content">
                    <h1>Crear Nuevo Taller</h1>
                    {mensajeError && <div className="mensaje error">{mensajeError}</div>}
                    {mensajeExito && <div className="mensaje exito">{mensajeExito}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre:</label>
                            <select
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                            >
                                <option value="salud">Salud</option>
                                <option value="psicologia">Psicología</option>
                                <option value="deporte">Deporte</option>
                                <option value="arte_musica">Arte - Música</option>
                                <option value="arte_danza">Arte - Danza</option>
                                <option value="arte_teatro">Arte - Teatro</option>
                                <option value="cultura">Cultura</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Descripción:</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={e => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Guardar Taller</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearTaller;
