CREATE DATABASE zoifyllon;

USE zoifyllon;

CREATE TABLE users(
  user_id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  image_url varchar(255) NOT NULL,
  PRIMARY KEY (user_id)
);

TRUNCATE users;

DROP TABLE users;