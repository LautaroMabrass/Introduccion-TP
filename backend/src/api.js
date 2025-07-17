// Creacion de API

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt');
// multer
const multer = require('multer')

const path = require('path')
const uploadPath = path.join(__dirname, '../uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // Se guarda en uploads
    },
    filename: function (req, file, cb) {
        const nombreFinal = Date.now() + path.extname(file.originalname); // nombre para cada imagen
        cb(null, nombreFinal);
    }
});
const upload = multer({ storage })
app.use(express.json());
app.use(cors());


// Importar funciones de acceso a la base de datos
const {
  getAllDreams,
  getDreamRelatedToUser,
  createNewDream,
  getAllCommentsRelatedToDream,
  createComment,
  deleteComment,
  createNewUser,
  getOneUser,
  deleteDream,
  updateUser,
  saveImage,
  allImages,
  deleteImage
} = require('./acceso-db');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});


// Endpoint para obtener todos los suenios
app.get('/api/suenios', async (req, res) => {
  try {
    const sueños = await getAllDreams();
    return res.status(200).json(sueños);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al obtener los sueños' });
  }
});

// Endpoint para crear un nuevo sueño
app.post('/api/suenios', async (req, res) => {
  try {
    const usuario = req.body.usuario
    const titulo = req.body.titulo
    const contenido = req.body.contenido
    const emociones = req.body.emociones
    const fecha = req.body.fecha
    const nivel_lucidez = req.body.nivel_lucidez
    if (!usuario || !titulo || !contenido || !fecha || !emociones || !nivel_lucidez) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }
    const usuario_id = await getOneUser(usuario)
    const nuevoSuenio = await createNewDream(usuario_id.id, titulo, contenido, fecha, emociones, nivel_lucidez);
    return res.status(201).json(nuevoSuenio);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al crear el sueño' });
  }
});

// Endpoint para eliminar los sueños
app.delete('/api/suenios/:id', async (req, res) => {
  try {
    suenio_id = req.params.id
    const eliminado = await deleteDream(suenio_id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Sueño no encontrado' });
    }
    return res.status(200).json({ message: 'Sueño eliminado' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al eliminar el Sueño' });
  }
});

// Endpoint para buscar suenios con id de usuarios
app.get('/api/suenios/:id', async (req, res) => {
  try {
    const user_id = req.params.id
    const sueños = await getDreamRelatedToUser(user_id);
    return res.status(200).json(sueños);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al obtener los sueños del usuario' });
  }
});

// Endpoint para obtener los comentarios relacionados a un sueño
app.get('/api/comentarios/:suenio_id', async (req, res) => {
  try {
    const comentarios = await getAllCommentsRelatedToDream(req.params.suenio_id);
    return res.status(200).json(comentarios);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// End point para crear un comentario
app.post('/api/comentarios', async (req, res) => {
  try {
    const usuario = req.body.usuario
    const suenio = req.body.suenio
    const contenido = req.body.contenido
    if (!usuario || !suenio || !contenido) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }
    const usuario_id = await getOneUser(usuario)
    const comentario = await createComment(usuario_id.id, suenio, contenido);
    return res.status(201).json(comentario);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al crear el comentario' });
  }
});

// Endpoint para eliminar un comentario
app.delete('/api/comentarios/:id', async (req, res) => {
  try {
    comentario_id = req.params.id
    const eliminado = await deleteComment(comentario_id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    return res.status(200).json({ message: 'Comentario eliminado' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al eliminar el comentario' });
  }
});

// Endpoint para crear un nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    const username = req.body.username;
    const clave = req.body.clave;
    if (!username || !clave) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }
    // Verifico si el usuario ya existe
    const existe = await getOneUser(username);
    if (existe) {
      return res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
    }
    const nuevoUsuario = await createNewUser(username, clave);
    return res.status(201).json(nuevoUsuario);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Endpoit para iniciar sesion

app.post('/api/login', async (req, res) => {
  try {
    const username = req.body.username
    const clave = req.body.clave

    if (!username || !clave) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const usuario = await getOneUser(username);
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const coincide = await bcrypt.compare(clave, usuario.clave_hash);

    if (!coincide) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
    return res.status(200).json({ usuario: usuario.nombre });

  } catch (e) {
    console.error('Error en /api/login:', e);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Endpoint para obtener datos del usuario con el nombre
app.get('/api/user/:nombre', async (req, res) => {
  try {
    const user_nombre = req.params.nombre;
    if (!user_nombre) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const result = await getOneUser(user_nombre);
    if (!result) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

// Endpoint para verificar y actualizar los datos del usuario
app.put('/api/user/:usuario', async (req, res) => {
  try {
    const usuario_actual = req.params.usuario;
    const { password_actual, nuevo_usuario, nueva_biografia, nueva_password } = req.body;

    if (!password_actual || !nuevo_usuario) {
      return res.status(400).json({ error: 'Faltan datos obligatorios: contraseña actual y nuevo nombre de usuario' });
    }

    const usuario_datos = await getOneUser(usuario_actual);

    if (!usuario_datos) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const verificacion = await bcrypt.compare(password_actual, usuario_datos.clave_hash);

    if (!verificacion) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (nuevo_usuario !== usuario_actual) {
      const existente = await getOneUser(nuevo_usuario);
      if (existente) {
        return res.status(409).json({ error: 'Nombre de usuario ya en uso' });
      }
    }

    if (nueva_password) {
      const clave_final = await bcrypt.hash(nueva_password, 10);
      const result = await updateUser(usuario_actual, nuevo_usuario, nueva_biografia, clave_final);
      if (!result) {
        return res.status(400).json({ error: 'No se pudo actualizar el usuario' });
      }
      return res.status(200).json({
        cambio_usuario: usuario_actual !== nuevo_usuario,
        cambio_password: !!nueva_password
      });
    }

    const result = await updateUser(usuario_actual, nuevo_usuario, nueva_biografia, usuario_datos.clave_hash);

    if (!result) {
      return res.status(400).json({ error: 'No se pudo actualizar el usuario' });
    }

    return res.status(200).json({
      cambio_usuario: usuario_actual !== nuevo_usuario,
      cambio_password: !!nueva_password
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Endpoints para las imagenes 
// upload.single('image') procesa la imagen que mande en el body
app.post('/api/imagenes', upload.single('image'), async (req, res) => {
    try {
        const usuario = req.body.usuario;
        const titulo = req.body.titulo;
        const descripcion = req.body.descripcion;
        const archivo = req.file;

        if (!usuario || !titulo || !descripcion || !archivo) {
            return res.status(400).json({ error: 'Faltan datos o imagen' });
        }
        const usuario_id = await getOneUser(usuario)
        const resultado = await saveImage(usuario_id.id, archivo.filename, titulo, descripcion);

        if (!resultado) {
            return res.status(500).json({ error: 'No se pudo guardar la imagen en la base de datos' });
        }

        return res.status(201).json({ resultado });

    } catch (e) {
        console.error('Error al subir la imagen:', e);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
});

app.get('/api/imagenes', async (req, res) => {
    const result = await allImages();
    if (!result) {
        return res.status(404).json({ error: 'Error al buscar todas las imagenes' });
    }
    return res.status(200).json(result);
})

app.delete('/api/imagenes/:imagen_id', async (req, res) => {
    const result = await deleteImage(req.params.imagen_id)
    if (!result) {
        return res.status(404).json({ error: 'Imagen no encontrado' });
    }
    return res.status(200).json({ message: 'Imagen eliminado' });
})

// Expongo mi carpeta uploads para que el frontend pueda acceder

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Inciar server
app.listen(port, () => {
  console.log(`API LISTA`);
});