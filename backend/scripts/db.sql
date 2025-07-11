CREATE TABLE creencias (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id),
    tipo VARCHAR(50),
    origen VARCHAR(50),
    fecha DATE DEFAULT CURRENT_DATE,
    contenido TEXT
);

CREATE TABLE suenios (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(100),
    contenido TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    emociones TEXT,
    nivel_lucidez INTEGER
);

CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id),
    suenio INTEGER REFERENCES suenios(id) ON DELETE CASCADE,
    contenido TEXT,
    fecha DATE DEFAULT CURRENT_DATE
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(36) UNIQUE,
    biografia VARCHAR(255),
    clave_hash VARCHAR(255)
);
