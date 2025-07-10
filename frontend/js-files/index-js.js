const sueniosApi = 'http://localhost:3000/api/suenios-personales';
const sueniosLucidosApi = 'http://localhost:3000/api/suenios-lucidos';

const mensajeError = document.getElementById('msjerror');
const mensajeExito = document.getElementById('msjexito');


const emocionesInput = document.getElementById('emociones_del_suenio');
const escalaLucidez = document.getElementById('escala_lucidez');

const crearSuenio = () => {

    const tipo = document.querySelector('input[name="tipo_suenio"]:checked').value;
    const contenido = document.getElementById('suenio').value.trim();
    const firma = document.getElementById('firma_del_autor').value.trim();
    const fecha = document.getElementById('fecha_del_suenio').value;

    if (!contenido || !firma || !fecha) {
        mensajeError.style.display = 'block';
        mensajeExito.style.display = 'none';
        return;
    }

    mensajeError.style.display = 'none';

    if (tipo === 'personal') {
        const emociones = emocionesInput.value.trim();

        if (!emociones) {
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
        const nivel_de_lucidez = document.getElementById('nivel_lucidez').value;
        const nuevoSueniolucido = {
            firma,
            contenido,
            fecha,
            nivel_de_lucidez
        };
        fetch(sueniosLucidosApi, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoSueniolucido)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('Error al crear el sueño lúcido');
            }
        })
        .then(data => {
            mensajeExito.style.display = 'block';
            console.log(data);

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
};


// Cambiar inputs dependiendo la seleccion (lucidez o comun)
const actualizarCampos = () => {
    const tipoSeleccionado = document.querySelector('input[name="tipo_suenio"]:checked').value;
    if (tipoSeleccionado === 'lucido') {
      emocionesInput.style.display = 'none';
      escalaLucidez.style.display = 'block';
    } else {
      emocionesInput.style.display = 'block';
      escalaLucidez.style.display = 'none';
    }
};
