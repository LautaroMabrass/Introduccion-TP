const usuario = localStorage.getItem('usuarioLogueado');
const ApiSuenios = 'http://localhost:3000/api/suenios';
const datos_usuario = 'http://localhost:3000/api/user';
const apiComentarios = 'http://localhost:3000/api/comentarios';
const divContenedorPrincipal = document.getElementById("tarjeta-suenio-append-informacion")
const divSinSuenios = document.getElementById("div-sin-suenios")

fetch(datos_usuario + `/${usuario}`).then(response => {
    if (response.ok) {
        return response.json()
    } else {
        console.log('error al obtener el usuario, verifique que este creado.')
    }
}).then(data => {
    fetch(ApiSuenios + `/${data.id}`).then(response_suenios => {
        if (response_suenios.ok) {
            return response_suenios.json();
        }
        else {
            console.log('error al obtener los sueños del usaurio')
        }
    }).then(data_suenios => {
        if (data_suenios.length === 0) {
            divSinSuenios.style.display = "block"
        }
        data_suenios.forEach(element => {
            // creamos de afuera para adentro
            const divContenedorDeSuenios = document.createElement('div');
            divContenedorDeSuenios.className = 'contenedor-principal-suenios-tarjetas-suenio';

            const buttonEliminarSuenio = document.createElement("p");
            buttonEliminarSuenio.className = 'contenedor-principal-suenios-tarjetas-suenio-eliminar'
            buttonEliminarSuenio.textContent = 'Eliminar sueño'
            buttonEliminarSuenio.onclick = () => eliminarSuenio(element.id, divContenedorDeSuenios)


            const titulo = document.createElement("h2");
            titulo.className = 'contenedor-principal-suenios-tarjetas-suenio-titulo';
            titulo.textContent = element.titulo;

            const historia = document.createElement("h3");
            historia.className = 'contenedor-principal-suenios-tarjetas-suenio-historia';
            historia.textContent = element.contenido;

            const fecha = new Date(element.fecha);
            const fecha_elemento = document.createElement("p");
            fecha_elemento.className = 'contenedor-principal-suenios-tarjetas-suenio-fecha';
            fecha_elemento.textContent = `Publicado el: ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

            const emociones = document.createElement("p");
            emociones.className = 'contenedor-principal-suenios-tarjetas-suenio-emocion';
            emociones.textContent = `Emociones: ${element.emociones}`;

            const nivel_lucidez = document.createElement("p");
            nivel_lucidez.className = 'contenedor-principal-suenios-tarjetas-suenio-lucidez';
            nivel_lucidez.textContent = `Nivel de lucidez: ${element.nivel_lucidez}`;

            // Agregar elementos al contenedor del sueño
            divContenedorDeSuenios.appendChild(buttonEliminarSuenio)
            divContenedorDeSuenios.appendChild(titulo);
            divContenedorDeSuenios.appendChild(historia);
            divContenedorDeSuenios.appendChild(nivel_lucidez);
            divContenedorDeSuenios.appendChild(emociones);
            divContenedorDeSuenios.appendChild(fecha_elemento);
            // Fetch a los comentarios relacionados al sueño
            fetch(apiComentarios + `/${element.id}`).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('Error en los comentarios')
                }
            }).then(comentarios => {
                comentarios.forEach(comentario => {
                    const divContenedorComentario = document.createElement("div");
                    divContenedorComentario.className = 'contenedor-principal-suenios-tarjetas-suenio-lista_comentarios';

                    const pComentario = document.createElement("p");
                    pComentario.className = 'contenedor-principal-suenios-tarjetas-suenio-lista_comentarios-anonimo';
                    pComentario.textContent = `💬 ${comentario.contenido}`;

                    const fecha_com = new Date(comentario.fecha);
                    const fecha_comentario = document.createElement("p");
                    fecha_comentario.className = 'contenedor-principal-suenios-tarjetas-suenio-lista_comentarios-fecha';
                    fecha_comentario.textContent = `Publicado el: ${fecha_com.getDate()}/${fecha_com.getMonth() + 1}/${fecha_com.getFullYear()}`;

                    divContenedorComentario.appendChild(pComentario);
                    divContenedorComentario.appendChild(fecha_comentario);

                    // Si el comentario es del usuario logueado, mostrar boton eliminar
                    if (comentario.nombre === usuario) {
                        const botonEliminar = document.createElement("button");
                        botonEliminar.className = 'contenedor-principal-suenios-tarjetas-suenio-lista_comentarios-eliminar';
                        botonEliminar.textContent = "❌";
                        botonEliminar.onclick = () => EliminarComentario(divContenedorComentario, comentario.id);
                        divContenedorComentario.appendChild(botonEliminar);
                    }
                    divContenedorDeSuenios.appendChild(divContenedorComentario);
                }

                )
                const divEnviarBoton = document.createElement("div");
                divEnviarBoton.className = "contenedor-principal-suenios-tarjetas-suenio-comentarios";

                const inputComentario = document.createElement("input");
                inputComentario.type = "text";
                inputComentario.placeholder = "Comentar de forma anónima...";
                inputComentario.className = "contenedor-principal-suenios-tarjetas-suenio-comentarios-input";

                const botonEnviar = document.createElement("button");
                botonEnviar.className = "contenedor-principal-suenios-tarjetas-suenio-comentarios-boton";
                botonEnviar.textContent = "Enviar";
                botonEnviar.onclick = () => CrearComentario(element.id, usuario, inputComentario);

                divEnviarBoton.appendChild(inputComentario)
                divEnviarBoton.appendChild(botonEnviar)
                divContenedorDeSuenios.appendChild(divEnviarBoton)
            })

            divContenedorPrincipal.appendChild(divContenedorDeSuenios);
        });
    }).catch(e => {
        console.log(e)
    })
}).catch(e => {
    console.log(e)
})

const CrearComentario = (suenio_id, usuario, inputComentario) => {
    const contenido = inputComentario.value.trim();
    if (contenido) {
        const nuevoComentario = {
            usuario: usuario,
            suenio: suenio_id,
            contenido: contenido
        }
        console.log('Nuevo comentario:', nuevoComentario);
        fetch(apiComentarios, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoComentario)
        }).then(response => {
            if (response.ok) {
                console.log('Comentario creado con exito');
                location.reload()
                inputComentario.value = "";
            } else {
                console.log('Error al crear contenido')
            }
        })
    }
}

const EliminarComentario = (divContCom, comentario_id) => {
    fetch(`${apiComentarios}/${comentario_id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                divContCom.remove();
            } else {
                console.error("No se pudo eliminar el comentario");
            }
        })
}

const eliminarSuenio = (suenioId, divContenedor) => {
    fetch(ApiSuenios + `/${suenioId}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            console.log('Sueño eliminado');
            divContenedor.remove();
            location.reload();
        } else {
            console.log('error al eliminar el sueño');
        }
    }).catch(e => {
        console.log(e);
    })
}