const sueniosApi = 'http://localhost:3000/api/suenios-personales';

const crearSuenio = () => {
    const tipo = document.querySelector('input[name="tipo_suenio"]:checked')?.value;
    const contenido = document.getElementById('suenio').value.trim();
    const firma = document.getElementById('firma_del_autor').value.trim();
    const emociones = document.getElementById('emociones_del_suenio').value.trim();
    const fecha = document.getElementById('fecha_del_suenio').value;

    const mensajeError = document.getElementById('msjerror');
    const mensajeExito = document.getElementById('msjexito');

    if (!tipo || !contenido || !firma || !emociones || !fecha) {
        mensajeError.style.display = 'block';
        mensajeExito.style.display = 'none';
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
                return response.json();
            } else {
                console.log('Error al crear el sueño');
            }
        })
        .then(data => {
            console.log('Sueño creado:', data);
            mensajeExito.style.display = 'block';

            // limpiar los campos del formulario
            document.getElementById('suenio').value = '';
            document.getElementById('firma_del_autor').value = '';
            document.getElementById('emociones_del_suenio').value = '';
            document.getElementById('fecha_del_suenio').value = '';
            const radios = document.querySelectorAll('input[name="tipo_suenio"]');
            radios.forEach(radio_input => radio_input.checked = false);
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
    }
    else if (tipo === 'lucido') {
        console.log('Implementar la creacion del sueño lucido');
    }
};