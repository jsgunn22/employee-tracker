DROP DATABASE IF EXISTS buisiness_db;

CREATE DATABASE buisiness_db;

USE buisiness_db;

CREATE TABLE departments (
    id INT NOT NULL,
    name VARCHAR(50) 
);

CREATE TABLE roles (
    id INT NOT NULL,
    title VARCHAR(50),
    salary INT NOT NULL
);

CREATE TABLE employees (
    id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);