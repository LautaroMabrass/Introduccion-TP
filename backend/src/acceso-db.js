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

const createSuenio = async (firma, contenido, fecha, emociones) => {
  const result = await dbClient.query('INSERT INTO suenios_personales (firma, contenido, fecha, emociones) VALUES ($1, $2, $3, $4) RETURNING *', [firma, contenido, fecha, emociones]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

module.exports = {
  createSuenio
}