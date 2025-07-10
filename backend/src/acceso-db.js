// PostgreSQL client imports
const { Pool } = require('pg')

// Conexion con PostgreSQL database
const dbClient = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dbname",
  password: "postgres",
  port: 5432,
});


// Funciones de acceso a la base de datos para los sueños personales
const getAllSuenios = async () => {
  const result = await dbClient.query('SELECT * FROM suenios_personales');
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

const createSuenio = async (firma, contenido, fecha, emociones) => {
  const result = await dbClient.query('INSERT INTO suenios_personales (firma, contenido, fecha, emociones) VALUES ($1, $2, $3, $4) RETURNING *', [firma, contenido, fecha, emociones]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Funciones de acceso a la base de datos para los comentarios
const getComentariosRelacionadosASuenios = async (id_suenio) => {
  const result = await dbClient.query('SELECT * FROM comentarios_personales WHERE suenios_personales_id = $1', [id_suenio]);
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

const createComentarioPersonal = async (contenido, suenios_personales_id) => {
  const result = await dbClient.query('INSERT INTO comentarios_personales (contenido, suenios_personales_id) VALUES ($1, $2) RETURNING *', [contenido, suenios_personales_id]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}


module.exports = {
  createSuenio,
  getAllSuenios,
  getComentariosRelacionadosASuenios,
  createComentarioPersonal
}