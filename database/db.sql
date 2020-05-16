CREATE DATABASE db_links;

USE db_links;

-- TABLE USER
-- all pasword wil be encrypted using SHA1
CREATE TABLE users (
  id INT(11) NOT NULL,
  username VARCHAR(16) NOT NULL,
  password VARCHAR(60) NOT NULL,
  fullname VARCHAR(100) NOT NULL
);

ALTER TABLE users
  ADD PRIMARY KEY (id);

ALTER TABLE users
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

INSERT INTO users (id, username, password, fullname) 
  VALUES (1, 'john', 'password1', 'John Carter');

SELECT * FROM users;

-- LINKS TABLE
CREATE TABLE links (
  id INT(11) NOT NULL,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE links
  ADD PRIMARY KEY (id);

ALTER TABLE links
  MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE links;

-- BD usuarios registrados 
create table bd_conjunto_datos (
    id INT not null,
    nombres_apalledios varchar(200) not null,
    param_vivienda_1 varchar(60) not null,
    param_vivienda_2 varchar(60) null,
    correo_electronico varchar(200) null,
    numero_documento varchar (30) null,
    coeficiente float not null,
    user_id int(11),
    create_at timestamp not null DEFAULT current_timestamp,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
)

Alter table bd_conjunto_datos
    add primary key (id);

Alter table bd_conjunto_datos
    MODIFY id INT(11) not null AUTO_INCREMENT, AUTO_INCREMENT = 2;

-- Porcentajes 

CREATE table porcentaje (
	Id Int PRIMARY KEY AUTO_INCREMENT,
    porcen double(3,3),
    user_id int,
	CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)

)
-- votacion save

Create table votaviones (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Titulopregunta varchar (50),
    texto varchar (50), 
    opcionesvotacion varchar (50), 
    textoopcionesvotos varchar (50),
    pregunta varchar(1000),
    create_at timestamp NOT NULL DEFAULT current_timestamp
)