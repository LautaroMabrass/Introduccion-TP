const loginApi = 'http://localhost:3000/api/login';
const msjerror = document.getElementById("msjerror");

const iniciarSesion = () => {
    const username = document.getElementById("username").value.trim();
    const clave = document.getElementById("clave").value.trim();

    if (!username || !clave) {
        msjerror.style.display = 'block';
        return;
    }

    const userLogin = {
        username,
        clave
    }
    fetch(loginApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLogin)
    })
        .then((respuesta) => {
            if (respuesta.ok) {
                return respuesta.json();
            } else {
                msjerror.style.display = 'block';
            }
        })
        .then(data => {
            if (!data) {
                return;
            }
            localStorage.setItem('usuarioLogueado', data.usuario);
            location.href = 'index.html';
        })
        .catch(err => {
            console.error(err);
        });

};