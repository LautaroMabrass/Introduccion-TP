const sueniosApi = 'http://localhost:3000/api/suenios-personales';

const crearSuenio = () => {
    const tipo = document.querySelector('input[name="tipo_suenio"]:checked')?.value;
    const contenido = document.getElementById('suenio').value.trim();
    const firma = document.getElementById('firma_del_autor').value.trim();
    const emociones = document.getElementById('emociones_del_suenio').value.trim();
    const fecha = document.getElementById('fecha_del_suenio').value;
    const mensajeError = document.getElementById('msjerror');

    if (!tipo || !contenido || !firma || !emociones || !fecha) {
        mensajeError.style.display = 'block';
        return;
    }

    mensajeError.style.display = 'none';

    const nuevoSuenio = {
        firma,
        contenido,
        fecha,
        emociones
    };

    if (tipo === 'personal') {
        fetch(sueniosApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoSuenio)
        })
            .then(response => {
                if (response.ok) {
                    console.log('TODO OK');
                    return response.json();
                } else {
                    console.error('Error al crear el sueño:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error en la solicitud:', error);
            });
    }
    else if (tipo === 'lucido') {
        console.log('Implementar creación de sueño lucido');
    }

};