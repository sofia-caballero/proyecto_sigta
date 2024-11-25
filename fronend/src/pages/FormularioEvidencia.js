import React, { useState, useEffect } from 'react';

const FormularioEvidencia = ({ profesionalId }) => {
    const [programacionId, setProgramacionId] = useState('');
    const [texto, setTexto] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [programaciones, setProgramaciones] = useState([]);

    // Cargar programaciones disponibles para el profesional
    useEffect(() => {
        const fetchProgramaciones = async () => {
            try {
                const response = await fetch(`/api/programaciones?profesionalId=${profesionalId}`);
                const data = await response.json();
                setProgramaciones(data.programaciones || []);
            } catch (error) {
                console.error('Error al cargar las programaciones:', error);
            }
        };

        if (profesionalId) {
            fetchProgramaciones();
        }
    }, [profesionalId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear el formulario para enviar los datos
        const formData = new FormData();
        formData.append('programacion_id', programacionId);
        formData.append('texto', texto);
        if (archivo) {
            formData.append('archivo', archivo);
        }

        try {
            const response = await fetch('/api/evidencias', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setMensaje(data.message);
            } else {
                setMensaje('Error al guardar la evidencia');
            }
        } catch (error) {
            console.error(error);
            setMensaje('Error al guardar la evidencia');
        }
    };

    return (
        <div>
            <h2>Subir Evidencia</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="programacionId">Seleccionar Programación:</label>
                    <select
                        id="programacionId"
                        value={programacionId}
                        onChange={(e) => setProgramacionId(e.target.value)}
                        required
                    >
                        <option value="">Seleccione una programación</option>
                        {programaciones.map((programacion) => (
                            <option key={programacion.id} value={programacion.id}>
                                {programacion.nombre} (ID: {programacion.id})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="texto">Texto:</label>
                    <textarea
                        id="texto"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="archivo">Archivo:</label>
                    <input
                        type="file"
                        id="archivo"
                        onChange={(e) => setArchivo(e.target.files[0])}
                    />
                </div>
                <button type="submit">Guardar Evidencia</button>
            </form>
            {mensaje && <p>{mensaje}</p>}
        </div>
    );
};

export default FormularioEvidencia;
