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
    fecha DATE
);

CREATE TABLE comentarios_lucidos (
    id SERIAL PRIMARY KEY,
    contenido TEXT,
    suenio_lucido_id INTEGER REFERENCES suenios_lucidos(id)
);

CREATE TABLE niveles_de_control (
    id SERIAL PRIMARY KEY,
    nivel TEXT,
    suenio_lucido_id INTEGER REFERENCES suenios_lucidos(id)
);

CREATE TABLE suenios_personales (
    id SERIAL PRIMARY KEY,
    firma VARCHAR(100),
    contenido TEXT,
    fecha DATE
);

CREATE TABLE comentarios_personales (
    id SERIAL PRIMARY KEY,
    contenido TEXT,
    suenios_personales_id INTEGER REFERENCES suenios_personales(id)
);

CREATE TABLE emociones (
    id SERIAL PRIMARY KEY,
    emocion TEXT,
    suenios_personales_id INTEGER REFERENCES suenios_personales(id)
);