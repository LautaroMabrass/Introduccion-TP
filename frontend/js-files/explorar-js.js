const suenioApi = 'http://localhost:3000/api/suenios';
const apiComentarios = 'http://localhost:3000/api/comentarios';
const apiUser = 'http://localhost:3000/api/user'
const divContenedorPrincipal = document.getElementById("tarjeta-suenio-append-informacion");
const usuario = localStorage.getItem('usuarioLogueado');
const divSinSuenios = document.getElementById("div-sin-suenios")


const crearTodos = () => {
    divContenedorPrincipal.innerHTML = "";
    divSinSuenios.style.display = "none";
    fetch(suenioApi).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log('error')
            return;
        }
    }
    ).then(data => {
        if (data.length === 0) {
            divSinSuenios.style.display = "block"
            return
        }
        data.forEach(element => {
            renderSuenios(element)
        });
    })
}

// Funcion para renderizar todos los sueños con sus comentarios

const renderSuenios = (element) => {
    // creamos de afuera para adentro
    const divContenedorDeSuenios = document.createElement('div');
    divContenedorDeSuenios.className = 'contenedor-principal-explorar-tarjetas-suenio';

    // Info usaurios
    const btnInfoUsuario = document.createElement("button");
    btnInfoUsuario.textContent = "Informacion del usuario";
    btnInfoUsuario.className = "contenedor-principal-explorar-tarjetas-suenio-info";
    btnInfoUsuario.onclick = () => mostrarInfoUsuario(element.biografia, element.nombre);

    const titulo = document.createElement("h2");
    titulo.className = 'contenedor-principal-explorar-tarjetas-suenio-titulo';
    titulo.textContent = element.titulo;

    const historia = document.createElement("h3");
    historia.className = 'contenedor-principal-explorar-tarjetas-suenio-historia';
    historia.textContent = element.contenido;

    const fecha = new Date(element.fecha);
    const fecha_elemento = document.createElement("p");
    fecha_elemento.className = 'contenedor-principal-explorar-tarjetas-suenio-fecha';
    fecha_elemento.textContent = `Publicado el: ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    const emociones = document.createElement("p");
    emociones.className = 'contenedor-principal-explorar-tarjetas-suenio-emocion';
    emociones.textContent = `Emociones: ${element.emociones}`;

    const nivel_lucidez = document.createElement("p");
    nivel_lucidez.className = 'contenedor-principal-explorar-tarjetas-suenio-lucidez';
    nivel_lucidez.textContent = `Nivel de lucidez: ${element.nivel_lucidez}`;

    // Agregar elementos al contenedor del sueño
    divContenedorDeSuenios.appendChild(btnInfoUsuario);
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
            divContenedorComentario.className = 'contenedor-principal-explorar-tarjetas-suenio-lista_comentarios';

            const pComentario = document.createElement("p");
            pComentario.className = 'contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-anonimo';
            pComentario.textContent = `💬 ${comentario.contenido}`;

            const fecha_com = new Date(comentario.fecha);
            const fecha_comentario = document.createElement("p");
            fecha_comentario.className = 'contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-fecha';
            fecha_comentario.textContent = `Publicado el: ${fecha_com.getDate()}/${fecha_com.getMonth()}/${fecha_com.getFullYear()}`;

            divContenedorComentario.appendChild(pComentario);
            divContenedorComentario.appendChild(fecha_comentario);

            // Si el comentario es del usuario logueado, mostrar boton eliminar
            if (comentario.nombre === usuario) {
                const botonEliminar = document.createElement("button");
                botonEliminar.className = 'contenedor-principal-explorar-tarjetas-suenio-lista_comentarios-eliminar';
                botonEliminar.textContent = "❌";
                botonEliminar.onclick = () => EliminarComentario(divContenedorComentario, comentario.id);
                divContenedorComentario.appendChild(botonEliminar);
            }
            divContenedorDeSuenios.appendChild(divContenedorComentario);
        }

        )
        const divEnviarBoton = document.createElement("div");
        divEnviarBoton.className = "contenedor-principal-explorar-tarjetas-suenio-comentarios";

        const inputComentario = document.createElement("input");
        inputComentario.type = "text";
        inputComentario.placeholder = "Comentar de forma anónima...";
        inputComentario.className = "contenedor-principal-explorar-tarjetas-suenio-comentarios-input";

        const botonEnviar = document.createElement("button");
        botonEnviar.className = "contenedor-principal-explorar-tarjetas-suenio-comentarios-boton";
        botonEnviar.textContent = "Enviar";
        botonEnviar.onclick = () => CrearComentario(element.id, usuario, inputComentario);

        divEnviarBoton.appendChild(inputComentario)
        divEnviarBoton.appendChild(botonEnviar)
        divContenedorDeSuenios.appendChild(divEnviarBoton)
    })

    divContenedorPrincipal.appendChild(divContenedorDeSuenios);
}



const aplicarFiltros = () => {
    const tipoFiltro = document.getElementById("filtro-tipo").value.toLowerCase();
    const emocionesFiltro = document.getElementById("filtro-emociones").value.toLowerCase();
    if (emocionesFiltro === "" && tipoFiltro == "todos") {
        crearTodos()
        return;
    }
    divContenedorPrincipal.innerHTML = "";
    divSinSuenios.style.display = "none";

    fetch(suenioApi).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error al obtener los sueños");
        }
    }).then(data => {

        let contador = 0;

        data.forEach(element => {
            const emocionesNormalizadas = element.emociones.toLowerCase().split(',').map(e => e.trim());

            const cumpleEmocion = emocionesFiltro === "" || emocionesNormalizadas.includes(emocionesFiltro);
            const cumpleTipo = (
                tipoFiltro === "todos" ||
                (tipoFiltro === "lucido" && element.nivel_lucidez >= 5) ||
                (tipoFiltro === "comun" && element.nivel_lucidez < 5)
            );

            if (cumpleEmocion && cumpleTipo) {
                renderSuenios(element);
                contador++;
            }
        });

        if (contador === 0) {
            divSinSuenios.style.display = "block";
        }
    })
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

const mostrarInfoUsuario = (biografia, nombre) => {
    document.getElementById("nombre-info").textContent = nombre
    document.getElementById("biografia-info").textContent = biografia || "Sin biografía";
    document.getElementById("usuario-info").style.display = "grid";
};

const cerrarModalUsuario = () => {
    document.getElementById("usuario-info").style.display = "none";
};

crearTodos()