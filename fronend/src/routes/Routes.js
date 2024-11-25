import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Menu from '../pages/Menu';
import Register from '../pages/Register'; // Importa el componente Register
import Profesional from '../pages/Profesional'; // Importa el componente Profesional
import Coordinador from '../pages/Coordinador'; // Importa el componente Coordinador
import Inicio from '../pages/Inicio'; // Importa el componente Coordinador
import Administrador from '../pages/Administrador'; // Cambia la importación a mayúscula
import CrearTaller from '../pages/CrearTaller'; // Cambia la importación a mayúscula
import ConsultarProfesional from '../pages/ConsultarProfesional'; // Cambia la importación a mayúscula
import ConsultarInstructor from '../pages/ConsultarInstructor'; // Cambia la importación a mayúscula
import ConsultarTaller from '../pages/ConsultarTaller';
import  ConsultarProgramacion from '../pages/ConsultarProgramacion'; // Cambia la importación a mayúscula
import  CrearProgramacion  from '../pages/CrearProgramacion';
import  ConsultarHorarioFicha  from '../pages/ConsultarHorarioFicha';
import   CrearHorarioFicha  from '../pages/CrearHorarioFicha';
import   TalleresAsignados  from '../pages/TalleresAsignados';
import   ConsultarFicha from '../pages/ConsultarFicha';
import  CrearFicha from '../pages/CrearFicha';
import  CrearInstructor from '../pages/CrearInstructor';
import Perfil from '../pages/Perfil'; 
import ActualizarPerfil from '../pages/ActualizarPerfil';
import ForgotPassword from '../pages/ForgotPassword'; // Importa el componente ForgotPassword
import ResetPassword from '../pages/ResetPassword';
import  ConsultarProgramacionProfesional from '../pages/ConsultarProgramacionProfesional';


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/register" element={<Register />} />  {/* Ruta para el registro */}
        <Route path="/profesional" element={<Profesional />} />  {/* Ruta para Profesional */}
        <Route path="/coordinador" element={<Coordinador />} />  {/* Ruta para Coordinador */}
        <Route path="/administrador" element={<Administrador />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/CrearTaller" element={<CrearTaller />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/ConsultarProfesional" element={<ConsultarProfesional />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/ConsultarInstructor" element={<ConsultarInstructor />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/ConsultarTaller" element={<ConsultarTaller />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/ConsultarProgramacion" element={<ConsultarProgramacion />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/CrearProgramacion" element={<CrearProgramacion />} />  {/* Cambia el uso del componente a mayúscula */}
        <Route path="/ConsultarHorarioFicha" element={<ConsultarHorarioFicha />} />
        <Route path="/CrearHorarioFicha" element={<CrearHorarioFicha/>} />
        <Route path="/TalleresAsignados" element={<TalleresAsignados/>} />
        <Route path="/ConsultarFicha" element={<ConsultarFicha/>} />
        <Route path="/CrearFicha" element={<CrearFicha/>} />
        <Route path="/CrearInstructor" element={<CrearInstructor/>} />
        
        <Route path="/ConsultarProgramacionProfesional" element={<  ConsultarProgramacionProfesional/>} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/actualizar-perfil" element={<ActualizarPerfil />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} /> {/* Nueva ruta para ForgotPassword */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      


        evidencias
       



  
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;