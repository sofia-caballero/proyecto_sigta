import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import Cookies from 'universal-cookie';
import 'react-calendar/dist/Calendar.css';
import '../css/administrador.css';

function ConsultarProgramacion() {
    const [programaciones, setProgramaciones] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [datesWithEvents, setDatesWithEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedProgramaciones, setSelectedProgramaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cookies = new Cookies();
    const profesionalId = cookies.get('id');

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
                const filteredProgramaciones = response.data.filter(programacion =>
                    programacion.profesional_1 === profesionalId || 
                    programacion.profesional_2 === profesionalId || 
                    programacion.instructor_id === profesionalId
                );
                setProgramaciones(filteredProgramaciones);
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
                            const ficha = fichas.find(f => f.id === event.ficha_id);

                            return (
                                <div key={event.id} className="event-details">
                                    <strong>Nombre:</strong> {event.nombre} <br /> {/* Solo se muestra el nombre */}
                                    <strong>Ficha:</strong> {ficha ? ficha.numero_ficha : 'No disponible'} <br />
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
                    <h1 className="calendar-title">Calendario de Talleres</h1>
                    <div className="calendar-content">
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileContent={tileContent}
                            minDate={new Date()}
                        />
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConsultarProgramacion;
