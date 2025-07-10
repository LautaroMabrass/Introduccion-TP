// Express imports
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Importar funciones de acceso a la base de datos
const {
  createSuenio,
  getAllSuenios,
  getComentariosRelacionadosASuenios,
  createComentarioPersonal,
  deleteOneComentarioPersonal
} = require('./acceso-db');


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Crear un nuevo sueño
app.post('/api/suenios-personales', async (req, res) => {
  try {
    const firma = req.body.firma;
    const contenido = req.body.contenido;
    const fecha = req.body.fecha;
    const emociones = req.body.emociones;

    if (!firma || !contenido || !fecha || !emociones) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const suenio = await createSuenio(firma, contenido, fecha, emociones);
    if (!suenio) {
      return res.status(500).json({ error: 'Error al crear el sueño' });
    }

    return res.status(201).json(suenio);
  } catch (e) {
    console.error(e);
    res.status(500).json({ e: "Error del servidor" });
  }
});

// obtener todos los sueños
app.get('/api/suenios-personales', async (req, res) => {
  try {
    const suenios = await getAllSuenios();
    return res.status(200).json(suenios);
  } catch (e) {
    console.error("Error al obtener los sueños:", e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
  }
);


// Obtener comentarios relacionados a un sueño especifico
app.get('/api/comentarios-personales/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const comentarios = await getComentariosRelacionadosASuenios(id);
    return res.status(200).json(comentarios);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

// Crear un nuevo comentario
app.post('/api/comentarios-personales', async (req, res) => {
  try {
    const contenido = req.body.contenido;
    const suenios_personales_id = req.body.suenios_personales_id;

    if (!contenido || !suenios_personales_id) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const result = await createComentarioPersonal(contenido, suenios_personales_id);
    if (!result) {
      return res.status(500).json({ error: 'Error al crear el comentario' });
    }
    return res.status(201).json(result);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// Eliminar un comentario
app.delete('/api/comentarios-personales/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteOneComentarioPersonal(id);
    if (!result) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }
    return res.status(200).json({ message: 'Comentario eliminado' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});