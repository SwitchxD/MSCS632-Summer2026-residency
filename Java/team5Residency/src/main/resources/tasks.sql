-- Create Table --
CREATE TABLE tasks (
                       id        INT AUTO_INCREMENT PRIMARY KEY,
                       task_name VARCHAR(255) NOT NULL,
                       category  VARCHAR(255),
                       username  VARCHAR(255) NOT NULL,
                       status    VARCHAR(20)  NOT NULL
);

SELECT * from TASKS;

