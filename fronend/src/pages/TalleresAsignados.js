import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/consultartaller.css';

function ConsultarProgramacion() {
    const [programaciones, setProgramaciones] = useState([]);
    const [fichas, setFichas] = useState([]);
    const [talleres, setTalleres] = useState([]);
    const [instructores, setInstructores] = useState([]);

    useEffect(() => {
        fetchProgramaciones();
        fetchFichas();
        fetchTalleres();
        fetchInstructores();
    }, []);

    const fetchProgramaciones = () => {
        axios.get('http://localhost:4000/programacion')
            .then(response => {
                setProgramaciones(response.data);
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

    const fetchTalleres = () => {
        axios.get('http://localhost:4000/taller')
            .then(response => {
                setTalleres(response.data);
            })
            .catch(error => {
                console.error('Error fetching talleres:', error);
            });
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

    const getFichaNumero = (fichaId) => {
        const ficha = fichas.find(f => f.id === fichaId);
        return ficha ? ficha.numero_ficha : 'Desconocido';
    };

    const getTallerNombre = (tallerId) => {
        const taller = talleres.find(t => t.id === tallerId);
        return taller ? taller.nombre : 'Desconocido';
    };

    const getInstructorNombre = (instructorId) => {
        const instructor = instructores.find(i => i.id === instructorId);
        return instructor ? `${instructor.nombre || ''} ${instructor.apellido || ''}`.trim() : 'Desconocido';
    };

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
                <div className="container">
                    <h1>Talleres Asignados</h1>
                    <table className="estructura-table">
                        <thead>
                            <tr>
                                <th>Taller</th>
                                <th>Ficha</th>
                                <th>Instructor</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Sede</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programaciones.length === 0 ? (
                                <tr>
                                    <td colSpan="7">No hay datos disponibles.</td>
                                </tr>
                            ) : (
                                programaciones.map((programacion) => (
                                    <tr key={programacion.id}>
                                        <td>{getTallerNombre(programacion.taller_id)}</td>
                                        <td>{getFichaNumero(programacion.ficha_id)}</td>
                                        <td>{getInstructorNombre(programacion.instructor_id)}</td>
                                        <td>{programacion.fecha}</td>
                                        <td>{programacion.hora}</td>
                                        <td>{programacion.sede}</td>
                                        <td>{programacion.estado}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ConsultarProgramacion;
