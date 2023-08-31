DROP DATABASE IF EXISTS buisiness_db;

CREATE DATABASE buisiness_db;

USE buisiness_db;

CREATE TABLE departments (
    id INT NOT NULL PRIMARY KEY,
    department_name VARCHAR(50)
);

CREATE TABLE roles (
    id INT NOT NULL PRIMARY KEY,
    position_title VARCHAR(50),
    position_salary INT NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

