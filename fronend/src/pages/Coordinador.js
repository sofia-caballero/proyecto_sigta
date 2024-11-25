import React from 'react';
import EncabezadoProfesional from '../components/EncabezadoProfesional'; 
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/Coordinador.css'; 
import imagenCoordinador from '../assets/imagen4.png'; 
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
const Coordinador = () => {
  return (

    <div style={{ display: 'flex' }}>
            <MenuDesplegable menuItems={menuItems} />
            <div style={{ flex: 1 }}>
                <EncabezadoProfesional nombreUsuario="Carla Sosa" rol="Administrador" imagenPerfil="ruta/a/imagen.jpg" />

    <div className="Coordinador">
      

      <main className="main">
        <section className="welcome">
          <div className="welcome-content">
            <div className="welcome-text">
              <h2>Coordinador</h2>
              <p>Bienvenido, esta sección ha sido creada específicamente para que puedas subir los archivos de los horarios de las fichas que se encuentran en el centro de formación. </p>
            </div>
            <div className="welcome-image">
              <img src={imagenCoordinador} alt="Imagen Coordinador" />
            </div>
          </div>
        </section>
      </main>
    </div>
    </div>
    </div>
  );
};

export default Coordinador;


