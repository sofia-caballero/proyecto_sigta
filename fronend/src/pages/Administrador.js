import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import 'react-calendar/dist/Calendar.css'; // Importa los estilos del calendario
import '../css/administrador.css'; // Asegúrate de tener tus estilos aquí

function ConsultarProgramacion() {
    const [programaciones, setProgramaciones] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [datesWithEvents, setDatesWithEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProgramaciones, setSelectedProgramaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProgramaciones();
        fetchFichas();
    }, []);

    useEffect(() => {
        const eventDates = programaciones.map(programacion => new Date(programacion.fecha).toISOString().split("T")[0]);
        setDatesWithEvents(eventDates);
    }, [programaciones]);

    useEffect(() => {
        const selectedDateString = selectedDate.toISOString().split("T")[0];
        const eventsOnSelectedDate = programaciones.filter(programacion => 
            new Date(programacion.fecha).toISOString().split("T")[0] === selectedDateString);
        setSelectedProgramaciones(eventsOnSelectedDate);
    }, [selectedDate, programaciones]);

    const fetchProgramaciones = () => {
        axios.get('http://localhost:4000/programacion')
            .then(response => {
                setProgramaciones(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching programaciones:', error);
                setError('Error al cargar las programaciones.');
                setLoading(false);
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

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split("T")[0];
            const eventsOnDate = programaciones.filter(programacion => 
                new Date(programacion.fecha).toISOString().split("T")[0] === dateString);

            if (eventsOnDate.length > 0) {
                return (
                    <div className="tile-content">
                        {eventsOnDate.map(event => {
                            // Buscar el número de la ficha correspondiente al ficha_id
                            const ficha = fichas.find(ficha => ficha.id === event.ficha_id);
                            const numeroFicha = ficha ? ficha.numero_ficha : 'No disponible'; // Mostrar el número de ficha

                            return (
                                <div key={event.id} className="event-details">
                                    <strong>Nombre:</strong> {event.nombre} <br />
                                    <strong>Ficha:</strong> {numeroFicha} <br /> {/* Mostrar el número de ficha */}
                                    <strong>Hora:</strong> {event.hora} <br />
                                    <strong>Sede:</strong> {event.sede} <br />
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }
        return null;
    };

    if (loading) return <p className="loading-message">Cargando...</p>;
    if (error) return <p className="error-message">{error}</p>;

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

                <div className="calendar-container">
                    <h1 className="calendar-title">Calendario de Programaciones</h1>
                    <div className="calendar-content">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileContent={tileContent}
                            minDate={new Date()} // No permitir seleccionar fechas anteriores a hoy
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsultarProgramacion;
