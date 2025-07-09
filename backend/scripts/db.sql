CREATE TABLE creencias_sobre_suenios (
    id SERIAL PRIMARY KEY,
    firma VARCHAR(100),
    tipo TEXT,
    contenido TEXT
);

CREATE TABLE suenios_lucidos (
    id SERIAL PRIMARY KEY,
    firma VARCHAR(100),
    contenido TEXT,
    fecha DATE,
    nivel_de_lucidez INTEGER,
);

CREATE TABLE suenios_personales (
    id SERIAL PRIMARY KEY,
    firma VARCHAR(100),
    contenido TEXT,
    fecha DATE,
    emociones TEXT
);

CREATE TABLE comentarios_lucidos (
    id SERIAL PRIMARY KEY,
    contenido TEXT,
    suenio_lucido_id INTEGER REFERENCES suenios_lucidos(id) ON DELETE CASCADE
);

CREATE TABLE comentarios_personales (
    id SERIAL PRIMARY KEY,
    contenido TEXT,
    suenios_personales_id INTEGER REFERENCES suenios_personales(id) ON DELETE CASCADE
);

CREATE TABLE emociones (
    id SERIAL PRIMARY KEY,
    emocion TEXT,
    suenios_personales_id INTEGER REFERENCES suenios_personales(id) ON DELETE CASCADE
);