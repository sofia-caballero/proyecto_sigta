import React, { useState, useEffect } from 'react';
import '../css/MenuDesplegable.css';
import Cookies from 'universal-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCalendar, faTasks, faCog, faTimeline, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUserTie } from '@fortawesome/free-solid-svg-icons/faUserTie';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons/faChalkboardTeacher';

const cookies = new Cookies();

const MenuDesplegable = () => {
  const [userRole, setUserRole] = useState('');
  const [tallerMenuOpen, setTallerMenuOpen] = useState(false); 

  useEffect(() => {
   
    const role = cookies.get('rol');
    setUserRole(role);
  }, []);

  const toggleTallerMenu = () => {
    setTallerMenuOpen(!tallerMenuOpen); 
  };

  return (
    <div className="menu-container">
      <div className="menu-title">
        SIGTA
      </div>
      <nav className="menu">
        <ul>
          {/* rol Administrador */}
          {userRole === 'Administrador' && (
            <>
              <li><a href="/Administrador"><FontAwesomeIcon icon={faHome} /> Inicio</a></li>
              <li><a href="/Menu"><FontAwesomeIcon icon={faUsers} /> Usuarios</a></li>
              <li><a href="/ConsultarProfesional"><FontAwesomeIcon icon={faUserTie} /> Profesional</a></li>
              <li><a href="/ConsultarInstructor"><FontAwesomeIcon icon={faChalkboardTeacher} /> instructor</a></li>
              <li><a href="/ConsultarFicha"><FontAwesomeIcon icon={faChalkboardTeacher} /> Fichas</a></li>
             
              <li>
                <a href="#tallerMenu" onClick={toggleTallerMenu}>
                  <FontAwesomeIcon icon={faTasks} /> Taller
                </a>
                <ul className={`submenu ${tallerMenuOpen ? 'open' : ''}`}>
                 
                  <li><a href="/ConsultarProgramacion">Consultar Programación</a></li>
                </ul>
              </li>
            </>
          )}

          {/* rol Coordinador */}
          {userRole === 'Coordinador' && (
            <>
              
              <li><a href="/Coordinador"><FontAwesomeIcon icon={faHome} /> Inicio</a></li>
              <li>
                <a href="#horario"><FontAwesomeIcon icon={faCalendar} /> Horarios</a>
                <ul>
                  <li><a href="/ConsultarFicha">Horarios Fichas</a></li>
                  
                </ul>
              </li>
            </>
          )}

          {/* rol Profesional */}
          {userRole === 'Profesional' && (
            <>
             <li><a href="/Profesional"><FontAwesomeIcon icon={faHome} /> Inicio</a></li>
             
              <li><a href="/ConsultarProgramacionProfesional"><FontAwesomeIcon icon={faCog} /> Talleres Asignados</a></li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default MenuDesplegable;

