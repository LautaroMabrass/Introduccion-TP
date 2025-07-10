const sueniosApi = 'http://localhost:3000/api/suenios-personales';
const comentariosPersonalesApi = 'http://localhost:3000/api/comentarios-personales';
const divTarjetaSuenioInformacion = document.getElementById('tarjeta-suenio-append-informacion');

// Primer fetch: obtener los sueños
fetch(sueniosApi)
  .then(response => {
    if (response.ok) {
        return response.json();}
    else {
        console.error('Error al obtener los sueños');}
  })
  .then(suenios => {
    console.log('Sueños obtenidos:', suenios);

    suenios.forEach(suenio => {
        const contenedorSuenio = document.createElement('div');
        contenedorSuenio.classList.add('contenedor-principal-explorar-tarjetas-suenio');

        const h3 = document.createElement('h3');
        h3.textContent = suenio.contenido;
        h3.classList.add('contenedor-principal-explorar-tarjetas-suenio-historia');

        const pEmocion = document.createElement('p');
        pEmocion.textContent = `Emociones: ${suenio.emociones}`;
        pEmocion.classList.add('contenedor-principal-explorar-tarjetas-suenio-emocion');

        const pTipoSuenio = document.createElement('p');
        pTipoSuenio.textContent = "Tipo de sueño: Común"
        pTipoSuenio.classList.add('contenedor-principal-explorar-tarjetas-suenio-tipo_de_suenio');


        const pFirma = document.createElement('p');
        pFirma.textContent = `Autor: ${suenio.firma}`;
        pFirma.classList.add('contenedor-principal-explorar-tarjetas-suenio-firma');

        const fecha = new Date(suenio.fecha);
        const dia = String(fecha.getDate());
        const mes = String(fecha.getMonth() + 1);
        const anio = fecha.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${anio}`;

        const pFecha = document.createElement('p');
        pFecha.textContent = `Publicado el: ${fechaFormateada}`;
        pFecha.classList.add('contenedor-principal-explorar-tarjetas-suenio-fecha');

        contenedorSuenio.appendChild(h3);
        contenedorSuenio.appendChild(pEmocion);
        contenedorSuenio.appendChild(pTipoSuenio);
        contenedorSuenio.appendChild(pFirma);
        contenedorSuenio.appendChild(pFecha);

    // Segundo fetch: obtener los comentarios personales para cada sueño Comun
    
    fetch(`${comentariosPersonalesApi}/${suenio.id}`)
        .then(response => {
        if (response.ok) {
            return response.json();}
        else {
            console.error('Error al obtener los comentarios');}
        })
        .then(comentarios => {
            comentarios.forEach(comentario => {
                const divComentario = document.createElement('div');
                divComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios');

                const pComentario = document.createElement('p');
                pComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-anonimo');
                pComentario.textContent = `💬 ${comentario.contenido}`;

                const botonEliminar = document.createElement('button');
                botonEliminar.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-eliminar');
                botonEliminar.textContent = '❌';
                botonEliminar.onclick = () => eliminarComentario(divComentario, comentario.id);

                divComentario.appendChild(pComentario);
                divComentario.appendChild(botonEliminar);
                contenedorSuenio.appendChild(divComentario);
          });
        })
        const divComentar = document.createElement('div');
        divComentar.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios');

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Comentar de forma anónima...';
        input.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios-input');

        const boton = document.createElement('button');
        boton.textContent = 'Enviar';
        boton.classList.add('contenedor-principal-explorar-tarjetas-suenio-comentarios-boton');
        boton.onclick = () => enviarComentario(input, suenio.id, contenedorSuenio);

        divComentar.appendChild(input);
        divComentar.appendChild(boton);

        contenedorSuenio.appendChild(divComentar);
        divTarjetaSuenioInformacion.appendChild(contenedorSuenio);


    });
  }).catch(e => {
        console.error(e);
    });

// Función para enviar comentarios
function enviarComentario(input, suenio_id, contenedorSuenio) {
    const valor = input.value.trim();
    if (valor === '') {
        alert('Por favor, escribe un comentario antes de enviar.');
        return;
    }
    const comentario = {
        contenido: valor,
        suenios_personales_id: suenio_id
    };
    fetch(comentariosPersonalesApi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(comentario)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.error('Error al enviar el comentario');
        }
    }).then(data => {
        const divComentario = document.createElement('div');
        divComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios');

        const pComentario = document.createElement('p');
        pComentario.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-anonimo');
        pComentario.textContent = `💬 ${data.contenido}`;

        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-eliminar');
        botonEliminar.textContent = '❌';
        botonEliminar.onclick = () => eliminarComentario(divComentario, data.id);

        divComentario.appendChild(pComentario);
        divComentario.appendChild(botonEliminar);
    
        contenedorSuenio.appendChild(divComentario);
        input.value = ''; 
    }).catch(e => {
        console.error(e);
    });
}

function eliminarComentario(divComentario, comentarioId) {
    fetch(`${comentariosPersonalesApi}/${comentarioId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            divComentario.remove();
        } else {
            console.error('Error al eliminar el comentario');
        }
    });
}