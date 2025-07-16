const crearUsuarioApi = 'http://localhost:3000/api/register';
const msjerror = document.getElementById("msjerror");

const registrarNuevoUsuario = () => {

    const clave = document.getElementById("clave").value.trim();
    const username = document.getElementById("username").value.trim();
    const confirmar_clave = document.getElementById("confirmar-clave").value.trim();

    if (!confirmar_clave || !username || !clave) {
        msjerror.textContent = 'Verifica que todos los campos estén completos y que las contraseñas coincidan.';
        msjerror.style.display = 'block';
        return;
    }
    if (confirmar_clave !== clave) {
        msjerror.textContent = 'Verifica que las contraseñas coincidan.';
        msjerror.style.display = 'block';
        return;
    }

    const regex = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
    // lookahead de 0 o mas veces ?=.* de letras mayusculas y numeros

    if (!regex.test(clave)) {
        msjerror.style.display = 'block';
        msjerror.textContent = 'La contraseña debe tener al menos 5 caracteres, una mayúscula y un número.';
        return;
    }
    const nuevoUsuario = {
        username,
        clave
    }
    fetch(crearUsuarioApi, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
    })
        .then((response) => {
            if (response.ok) {
                msjerror.style.display = 'none';
                location.href = 'login.html';
            } else {
                msjerror.textContent = 'El usuario elegido ya esta en uso';
                msjerror.style.display = 'block';
            }
        }).catch(e => {
            console.log(e);
        });
}