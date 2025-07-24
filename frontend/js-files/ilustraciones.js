const imagenesApi = 'http://localhost:3000/api/imagenes';
const usuario = localStorage.getItem('usuarioLogueado');
const divPrincipal = document.getElementById("contenedor-principal");

function renderElemento(element) {
    const divContenedor = document.createElement('div');
    divContenedor.className = 'contenedor-ilustraciones';

    const divContenedorLista = document.createElement('div');
    divContenedorLista.className = 'contenedor-ilustraciones-lista';

    const divContenedorObjetos = document.createElement('div');
    divContenedorObjetos.className = 'contenedor-ilustraciones-lista-datos';

    divContenedor.appendChild(divContenedorLista);
    divContenedorLista.appendChild(divContenedorObjetos);

    const titulo = document.createElement('h3');
    titulo.textContent = element.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = element.descripcion;

    const autor = document.createElement('p');
    autor.className = 'contenedor-ilustraciones-lista-datos-autor';
    autor.textContent = `Autor: ${element.nombre}`;

    const fecha = new Date(element.fecha);
    const fecha_elemento = document.createElement("p");
    fecha_elemento.className = 'contenedor-ilustraciones-lista-datos-fecha';
    fecha_elemento.textContent = `Publicado el: ${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    const imagen = document.createElement('img');
    imagen.src = `http://localhost:3000/uploads/${element.url}`;
    imagen.alt = element.titulo;

    if (element.nombre === usuario) {
        const eliminarIlustracion = document.createElement('button');
        eliminarIlustracion.textContent = "eliminar ilustración";
        eliminarIlustracion.onclick = () => EliminarIlustracion(divContenedorLista, element.id);
        divContenedorObjetos.appendChild(eliminarIlustracion);
    }

    divContenedorObjetos.appendChild(titulo);
    divContenedorObjetos.appendChild(descripcion);
    divContenedorObjetos.appendChild(imagen);
    divContenedorObjetos.appendChild(autor);
    divContenedorObjetos.appendChild(fecha_elemento);

    divPrincipal.appendChild(divContenedorLista);
}

fetch(imagenesApi).then(response => {
    if (response.ok) {
        return response.json();
    } else {
        console.log('Error al obtener las imagenes');
    }
}).then(data => {
    if (!data) {
        document.getElementById('div-sin-suenios').style.display = 'block';
        return;
    }
    data.forEach(element => {
        if (element.nombre === usuario) {
            renderElemento(element);
        }
    });
    data.forEach(element => {
        if (element.nombre !== usuario) {
            renderElemento(element);
        }
    });
});

const EliminarIlustracion = (divContenedorLista, imagen_id) => {
    fetch(imagenesApi + `/${imagen_id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log('error al eliminar el sueño')
        }
    }
    ).then(data => {
        console.log(data)
        divContenedorLista.remove()
        location.reload()
    })
}


const publicarImagen = () => {
    const titulo = document.getElementById('form-titulo').value;
    const descripcion = document.getElementById('form-descripcion').value;
    // Elijo la primer imagen porque viene en formato filesList 
    const imagen = document.getElementById('form-imagen').files[0];
    const msjError = document.getElementById('msjError');
    const msjExito = document.getElementById('msjExito');

    if (!titulo || !descripcion || !imagen) {
        msjExito.style.display = 'none';
        msjError.style.display = 'block';
        msjError.textContent = 'Porfavor compruebe que el formulario este completo.'
        return;
    }
    msjError.style.display = 'none';

    // uso formData para mandar la imagen 
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('image', imagen);
    formData.append('usuario', usuario);

    fetch(imagenesApi, {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log('error al crear la publicacion')
        }
    }).then(data => {
        document.getElementById('form-titulo').value = ""
        document.getElementById('form-descripcion').value = ""
        document.getElementById('form-imagen').value = ""
        msjExito.style.display = 'block';
        msjExito.textContent = 'Publicacion creada con exito'
    }).catch(error => {
        console.error(error);
    });
}