// Creacion de API

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bcrypt = require('bcrypt');
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
  getOneUser
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

// Endpoint para buscar suenios con id de usuarios
app.get('/api/suenios/usuario/:id', async (req, res) => {
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

// Inciar server
app.listen(port, () => {
  console.log(`API LISTA`);
});