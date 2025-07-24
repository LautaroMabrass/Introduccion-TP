CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(36) UNIQUE,
    biografia VARCHAR(255) DEFAULT NULL,
    clave_hash VARCHAR(255)
);


CREATE TABLE suenios (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(100),
    contenido TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    emociones TEXT,
    nivel_lucidez INTEGER
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    suenio INTEGER REFERENCES suenios(id) ON DELETE CASCADE,
    contenido TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    titulo VARCHAR(255),
    descripcion TEXT,
    fecha DATE DEFAULT CURRENT_DATE
);