const crearUsuarioApi = 'http://localhost:3000/api/register';
const msjexito = document.getElementById("msjexito");
const msjerror = document.getElementById("msjerror");

const registrarNuevoUsuario = () => {

    const clave = document.getElementById("clave").value.trim();
    const username = document.getElementById("username").value.trim();
    const confirmar_clave = document.getElementById("confirmar-clave").value.trim();

    if (!confirmar_clave || !username || !clave || confirmar_clave !== clave) {
        msjerror.textContent = 'Verifica que todos los campos estén completos y que las contraseñas coincidan.';
        msjerror.style.display = 'block';
        msjexito.style.display = 'none';
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
                msjexito.style.display = 'block';
            } else {
                msjerror.textContent = 'El usuario elegido ya esta en uso';
                msjerror.style.display = 'block';
                msjexito.style.display = 'none';
            }
        }).catch(e => {
            console.log(e);
        });
}
