const apiUser = 'http://localhost:3000/api/user'
const usuario = localStorage.getItem('usuarioLogueado');
const inputUsername = document.getElementById('perfil-username');
const msjError = document.getElementById('perfil-mensaje-error')
const msjExito = document.getElementById('perfil-mensaje-exito')
inputUsername.value = usuario
const inputBiografia = document.getElementById('perfil-biografia')
fetch(apiUser + `/${usuario}`).then(response => {
    if (response.ok) {
        return response.json()
    } else {
        console.log('error al obtener el usuario')
    }
}).then(data => {
    inputBiografia.value = data.biografia
})

const guardarBoton = () => {
    const usuario_nuevo = document.getElementById('perfil-username').value;
    const passwordActual = document.getElementById('perfil-password-actual').value;
    const passwordNueva = document.getElementById('perfil-password-nueva').value;
    const biografia = document.getElementById('perfil-biografia').value;

    if (!passwordActual) {
        msjError.textContent = 'Debes ingresar tu contraseña actual.';
        msjError.style.display = 'block';
        return;
    }

    if (passwordNueva) {
        const regex = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
        if (!regex.test(passwordNueva)) {
            msjError.style.display = 'block';
            msjError.textContent = 'La nueva contraseña debe tener al menos 5 caracteres, una mayúscula y un número.';
            return;
        }
    }
    msjError.style.display = 'none';
    const usuarioActualizado = {
        password_actual: passwordActual,
        nuevo_usuario: usuario_nuevo || usuario,
        nueva_password: passwordNueva || "",
        nueva_biografia: biografia || ""
    };

    fetch(apiUser + `/${usuario}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioActualizado)
    })
        .then(res => {
            if (res.ok) {
                return res.json()
            } else {
                msjError.style.display = 'block';
                msjError.textContent = 'El nombre de usuario ya esta en uso, ingrese otro'
                throw new Error('Nombre de usuario en uso');
            }
        })
        .then(data => {
            const requiereReinicio = data.cambio_usuario || data.cambio_password;
            if (requiereReinicio) {
                localStorage.clear();
                location.href = 'index.html'
            } else {
                msjExito.style.display = 'block';
                msjExito.textContent = 'Biografia actualizada correctamente';
            }


        })
        .catch(e => {
            console.error(e);
        });
};
