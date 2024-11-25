import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import EncabezadoProfesional from '../components/EncabezadoProfesional';
import MenuDesplegable from '../components/MenuDesplegable';
import '../css/Menu.css';

const cookies = new Cookies();

class Menu extends Component {
    state = {
        usuarios: [], // Lista de todos los usuarios
        roles: ["Coordinador", "Profesional"], // Roles disponibles
        selectedRoles: {}, // Roles seleccionados por usuario
    };

    componentDidMount() {
        if (!cookies.get('username')) {
            window.location.href = "./";
        } else {
            this.obtenerUsuarios(); // Cargar usuarios al montar el componente
        }
    }

    obtenerUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:4000/usuarios'); // Asegúrate de que esta URL sea correcta
            this.setState({ usuarios: response.data }); // Actualizar estado con la lista de usuarios
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    handleAccept = async (id) => {
        try {
            const usuarioPendiente = this.state.usuarios.find(user => user.id === id);
            const selectedRole = this.state.selectedRoles[id] || "Profesional"; // Rol predeterminado

            if (usuarioPendiente) {
                // Actualizar rol y estado a "Activo" en el backend
                await axios.put(`http://localhost:4000/usuarios/${id}`, {
                    rol: selectedRole,
                    estado: "Activo"
                });

                // Actualizar la tabla en el frontend
                this.setState((prevState) => ({
                    usuarios: prevState.usuarios.map((usuario) =>
                        usuario.id === id
                            ? { ...usuario, rol: selectedRole, estado: "Activo" }
                            : usuario
                    ),
                }));
            }
        } catch (error) {
            console.error('Error al aceptar al usuario:', error);
        }
    };

    handleReject = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/usuarios/${id}`); // Elimina el usuario del backend
            // Actualizar la lista de usuarios en el frontend
            this.setState((prevState) => ({
                usuarios: prevState.usuarios.filter((usuario) => usuario.id !== id),
            }));
        } catch (error) {
            console.error('Error al rechazar al usuario:', error);
        }
    };

    handleRoleChange = (id, event) => {
        this.setState({
            selectedRoles: {
                ...this.state.selectedRoles,
                [id]: event.target.value,
            },
        });
    };

    render() {
        // Filtrar usuarios con rol "Pendiente"
        const usuariosPendientes = this.state.usuarios.filter((usuario) => usuario.rol === "Pendiente");

        return (
            <div className="menu-page">
                <EncabezadoProfesional />
                <MenuDesplegable />
                
                <div className="container">
                    <h1>Lista de usuarios pendientes</h1>

                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosPendientes.length > 0 ? (
                                usuariosPendientes.map((usuario) => (
                                    <tr key={usuario.id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.correo}</td>
                                        <td>
                                            <select
                                                onChange={(e) => this.handleRoleChange(usuario.id, e)}
                                                value={this.state.selectedRoles[usuario.id] || "Profesional"} // Profesional por defecto
                                            >
                                                {this.state.roles.map((rol, index) => (
                                                    <option key={index} value={rol}>{rol}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{usuario.estado}</td>
                                        <td>
                                            <button
                                                className="edit-btn"
                                                onClick={() => this.handleAccept(usuario.id)}
                                            >
                                                ✅
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => this.handleReject(usuario.id)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5">No hay usuarios pendientes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Menu;
