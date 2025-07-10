const sueniosApi = 'http://localhost:3000/api/suenios-personales';
const comentariosPersonalesApi = 'http://localhost:3000/api/comentarios-personales';
const divTarjetaSuenioInformacion = document.getElementById('tarjeta-suenio-append-informacion');


// Primer fetch: obtener los sueños
fetch(sueniosApi)
  .then(response => {
    if (response.ok) return response.json();
    else console.error('Error al obtener los sueños');
  })
  .then(suenios => {
    console.log('Sueños obtenidos:', suenios);

    suenios.forEach(suenio => {

      const contenedorSuenio = document.createElement('div');
      contenedorSuenio.classList.add('contenedor-principal-explorar-tarjetas-suenio');

      const newH3 = document.createElement('h3');
      newH3.textContent = suenio.contenido;
      newH3.classList.add('contenedor-principal-explorar-tarjetas-suenio-historia');

      const newPFecha = document.createElement('p');
      newPFecha.textContent = `Publicado el: ${suenio.fecha}`;
      newPFecha.classList.add('contenedor-principal-explorar-tarjetas-suenio-fecha');

      const newPEmociones = document.createElement('p');
      newPEmociones.textContent = `Emociones: ${suenio.emociones}`;
      newPEmociones.classList.add('contenedor-principal-explorar-tarjetas-suenio-emocion');

      const newPAutor = document.createElement('p');
      newPAutor.textContent = `Autor: ${suenio.firma}`;
      newPAutor.classList.add('contenedor-principal-explorar-tarjetas-suenio-firma');

      const divComentarios = document.createElement('div');
      divComentarios.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios');

      // Asigno el ID para poder identificar los comentarios de cada sueño
      divComentarios.id = `comentarios-suenio-${suenio.id}`;

      const divComentar = document.createElement('div');
      divComentar.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios');

      const inputComentario = document.createElement('input');
      inputComentario.type = 'text';
      inputComentario.placeholder = 'Comentar de forma anónima...';
      inputComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios-input');

      const botonComentario = document.createElement('button');
      botonComentario.textContent = 'Enviar';
      botonComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios-boton');
      botonComentario.addEventListener('click', enviarComentario);

      divComentar.appendChild(inputComentario);
      divComentar.appendChild(botonComentario);

      contenedorSuenio.appendChild(newH3);
      contenedorSuenio.appendChild(newPEmociones);
      contenedorSuenio.appendChild(newPAutor);
      contenedorSuenio.appendChild(newPFecha);

      divTarjetaSuenioInformacion.appendChild(contenedorSuenio);

    // Segundo fetch: obtener los comentarios personales para cada sueño

    fetch(`${comentariosPersonalesApi}/${suenio.id}`)
        .then(response => {
        if (response.ok) return response.json();
        else console.error('Error al obtener los comentarios');
        })
        .then(comentarios => {
        console.log(`Comentarios para el sueño ${suenio.id}:`, comentarios);
        comentarios.forEach(comentario => {
            const newPComentario = document.createElement('p');
            newPComentario.textContent = `💬 ${comentario.contenido}`;
            newPComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-anonimo');
            divComentarios.appendChild(newPComentario);
        });
        })
        .catch(error => {
        console.error('Error al procesar los comentarios:', error);
        });
    contenedorSuenio.appendChild(divComentarios);
    contenedorSuenio.appendChild(divComentar);
});
  })
  .catch(error => {
    console.error('Error al procesar los sueños:', error);
  });

// Función para enviar comentarios
function enviarComentario(e) {
    const contenedorSuenio = e.target.closest('.contenedor-principal-explorar-tarjetas-suenio');
    if (!contenedorSuenio) {
        console.error('No se encontró el contenedor del sueño.');
        return;
    }

    const listaDeComentarios = contenedorSuenio.querySelector('.contenedor-principal-explorar-tarjetas-suenio-lista_comentarios');
    const inputComentario = contenedorSuenio.querySelector('.contenedor-principal-explorar-tarjetas-suenio-comentarios-input');

    if (!listaDeComentarios || !inputComentario) {
        console.error('No se encontró el contenedor de comentarios o el input.');
        return;
    }

    const nuevoComentario = inputComentario.value.trim();
    if (!nuevoComentario) {
        alert('Por favor, escribe un comentario antes de enviar.');
        return;
    }

    const partes = listaDeComentarios.id.split('-');
    const idSuenio = partes[2];

    const nuevoPComentario = document.createElement('p');
    nuevoPComentario.textContent = `💬 ${nuevoComentario}`;
    nuevoPComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-anonimo');
    listaDeComentarios.appendChild(nuevoPComentario);

    inputComentario.value = '';

    // Enviar al backend
    fetch(comentariosPersonalesApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contenido: nuevoComentario,
            suenios_personales_id: idSuenio
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Comentario enviado correctamente');
        } else {
            console.error('Error al enviar el comentario');
        }
    })
    .catch(error => {
        console.error('Error al procesar el envío del comentario:', error);
    });
}

