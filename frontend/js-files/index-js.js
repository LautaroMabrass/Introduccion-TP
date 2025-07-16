const usuarioNombre = localStorage.getItem('usuarioLogueado');
const suenioApi = 'http://localhost:3000/api/suenios';


const msjexito = document.getElementById("msjexito");
const msjerror = document.getElementById("msjerror");
const botonIndex = document.getElementById("boton-index");
const botonLogin = document.getElementById("boton-login");
const botonRegister = document.getElementById("boton-register");
const botonExplorar = document.getElementById("boton-explorar");
const botonMisSuenios = document.getElementById("boton-suenios");
const botonMiPerfil = document.getElementById("boton-perfil")
const botonCerrar = document.getElementById("boton-cerrar");
const tarjetaSueniosLucidos = document.getElementById("tarjeta-suenios-lucidos");
const tarjetaPerfil = document.getElementById("tarjeta-perfil");
const tarjetaSuenios = document.getElementById("tarjeta-suenios")

if (usuarioNombre) {
    botonLogin.style.display = "none";
    botonRegister.style.display = "none";
} else {
    botonExplorar.style.display = "none";
    botonMiPerfil.style.display = "none";
    botonMisSuenios.style.display = "none";
    botonCerrar.style.display = "none";
    tarjetaSueniosLucidos.href = "login.html"
    tarjetaPerfil.href = "login.html"
    tarjetaSuenios.href = "login.html"
}

const crearSuenio = () => {
    msjexito.style.display = "none";
    msjerror.style.display = "none";

    if (!usuarioNombre) {
        location.href = 'login.html';
        return;
    }

    const titulo = document.getElementById("titulo_suenio").value.trim();
    const contenido = document.getElementById("suenio").value.trim();
    const emociones = document.getElementById("emociones_del_suenio").value.trim();
    const nivel_lucidez = document.getElementById("nivel_lucidez").value.trim();
    const fecha = document.getElementById("fecha_del_suenio").value.trim();

    if (!titulo || !contenido || !emociones || !nivel_lucidez || !fecha) {
        msjerror.style.display = "block";
        return;
    }

    const nuevoSuenio = {
        usuario: usuarioNombre,
        titulo,
        contenido,
        emociones,
        fecha,
        nivel_lucidez
    };

    fetch(suenioApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoSuenio)
    })
        .then(response => {
            if (response.ok) {
                msjexito.style.display = "block";
                document.getElementById("titulo_suenio").value = "";
                document.getElementById("suenio").value = "";
                document.getElementById("emociones_del_suenio").value = "";
                document.getElementById("fecha_del_suenio").value = "";
            } else {
                msjerror.style.display = "block";
                console.error('Error en el servidor');
            }
        })
        .catch(e => {
            msjerror.style.display = "block";
            console.error(e);
        });
};