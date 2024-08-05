CREATE DATABASE final_mencos 

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre_github VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL
);