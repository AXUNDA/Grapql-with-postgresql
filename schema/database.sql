CREATE DATABASE graphql;
CREATE TYPE mood AS ENUM ('not started', 'in progress', 'completed')
CREATE TABLE projects(
    id SERIAL PRIMARY KEY,
    clientid VARCHAR(255),
    name VARCHAR(255),
    description VARCHAR(255),
    status mood
    
);


CREATE TABLE clients(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255)  
    
);




