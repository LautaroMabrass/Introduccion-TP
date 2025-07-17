// PostgreSQL client imports
const { Pool, Result } = require('pg')

// Conexion con PostgreSQL database
const dbClient = new Pool({
  user: "postgres",
  host: "localhost",
  database: "suenios",
  password: "postgres",
  port: 5432,
});

// Creacion de hash para usuarios
const bcrypt = require('bcrypt');

// Funciones de acceso a la base de datos para los sueños

// Funcion para obtener todos los sueños todos los sueños
const getAllDreams = async () => {
  const result = await dbClient.query("SELECT suenios.*, usuarios.nombre, usuarios.biografia FROM suenios JOIN usuarios ON suenios.usuario = usuarios.id");
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

// Funcion para la creacion de un nuevo sueño

const createNewDream = async (usuario, titulo, contenido, fecha, emociones, nivel_lucidez) => {
  const result = await dbClient.query('INSERT INTO suenios (usuario, titulo, contenido, fecha, emociones, nivel_lucidez) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [usuario, titulo, contenido, fecha, emociones, nivel_lucidez]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Funcion para obtener el sueño de un usuario

const getDreamRelatedToUser = async (user_id) => {
  const result = await dbClient.query('SELECT * from suenios WHERE usuario = $1 ', [user_id]);
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

// Funcion para eliminar un sueño
const deleteDream = async (suenio_id) => {
  const result = await dbClient.query('DELETE FROM suenios WHERE id = $1 RETURNING *', [suenio_id]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}
// Funciones de acceso a la base de datos para los comentarios

// Obtener comentarios relacionados a un sueño específico
const getAllCommentsRelatedToDream = async (id_suenio) => {
  const result = await dbClient.query(`
    SELECT comentarios.id, comentarios.contenido, comentarios.fecha, usuarios.nombre
    FROM comentarios
    JOIN usuarios ON comentarios.usuario = usuarios.id
    WHERE comentarios.suenio = $1;
  `, [id_suenio]);
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

// Crear un nuevo comentario personal 
const createComment = async (usuario_id, suenio_id, contenido) => {
  const result = await dbClient.query('INSERT INTO comentarios (usuario, suenio, contenido) VALUES ($1, $2, $3) RETURNING *', [usuario_id, suenio_id, contenido]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Eliminar un comentario personal
const deleteComment = async (id_comentario) => {
  const result = await dbClient.query('DELETE FROM comentarios WHERE id = $1 RETURNING *', [id_comentario]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Funciones de usuarios

// Crear un nuevo usuario
const createNewUser = async (nombre, clave) => {
  const claveHash = await bcrypt.hash(clave, 10);
  const result = await dbClient.query(' INSERT INTO usuarios (nombre, clave_hash )VALUES ($1, $2) RETURNING *', [nombre, claveHash]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// Buscar el nombre del usuario
const getOneUser = async (username) => {
  const result = await dbClient.query('SELECT * FROM usuarios WHERE nombre = $1', [username]);
  if (result.rowCount === 0) {
    return undefined;
  }
  return result.rows[0];
}

// actualizar usuario
const updateUser = async (usuario_actual, nuevo_usuario, nueva_biografia, nueva_clave_hash) => {
  const result = await dbClient.query(
    'UPDATE usuarios SET nombre = $1, biografia = $2, clave_hash = $3 WHERE nombre = $4 RETURNING *',
    [nuevo_usuario, nueva_biografia || '', nueva_clave_hash, usuario_actual]
  );

  if (result.rowCount === 0) {
    return undefined
  }
  return result.rows[0]
};

// Funciones para la seccion ilustraciones

// Guardar imagen

const saveImage = async (usuario_id, imagen, titulo, descripcion) => {
  const result = await dbClient.query('INSERT INTO imagenes(usuario, url, titulo, descripcion) VALUES ($1, $2, $3, $4) RETURNING *', [usuario_id, imagen, titulo, descripcion])
  if (result.rowCount === 0) {
    return undefined
  }
  return result.rows;
}

const allImages = async () => {
  const result = await dbClient.query("SELECT imagenes.*, usuarios.nombre FROM imagenes JOIN usuarios ON imagenes.usuario = usuarios.id");
  if (result.rowCount === 0) {
    return undefined
  }
  return result.rows;
}

const deleteImage = async (imagen_id) => {
  const result = await dbClient.query('DELETE FROM imagenes WHERE id = $1 RETURNING *', [imagen_id])
  if (result.rowCount === 0) {
    return undefined
  }
  return result.rows;
}
module.exports = {
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
}