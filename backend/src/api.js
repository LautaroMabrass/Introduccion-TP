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
} = require('./acceso-db');


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Crear un nuevo sueño
app.post('/api/suenios-personales', async (req, res) => {
  try {
    const { firma, contenido, fecha, emociones } = req.body;

    if (!firma || !contenido || !fecha || !emociones) {
      return res.status(400).json({ error: 'Falta información requerida' });
    }

    const suenio = await createSuenio(firma, contenido, fecha, emociones);
    if (!suenio) {
      return res.status(500).json({ error: 'Error al crear el sueño' });
    }

    res.status(201).json(suenio);
  } catch (e) {
    console.error("Error al crear el sueño:", e);
    res.status(500).json({ e: "Error del servidor" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
