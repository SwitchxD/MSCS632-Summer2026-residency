# Team 5 Residency — Todo List API

A multi-user task management REST API built with Java Spring Boot and H2 in-memory database.

## Tech Stack
- Java 17+, Spring Boot 3.x, Spring Data JPA, H2, Lombok, Maven

## Run

```bash
mvn clean install
mvn spring-boot:run
```
Server starts on `http://localhost:8090`

## H2 Console
URL: `http://localhost:8090/h2`  
JDBC URL: `jdbc:h2:mem:todoAppDb` | Username: `sa` | Password: *(blank)*

---

## Endpoints

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| POST | `/api/tasks` | `userName`, `taskName`, `category` | Create a task |
| GET | `/api/tasks` | `userName` | Get all tasks for a user |
| PUT | `/api/tasks/{taskId}/status` | `userName`, `status` | Update task status |
| DELETE | `/api/tasks/{taskId}` | — | Delete a task |

Status values: `PENDING`, `COMPLETED`

---

## Concurrency
Each `addTask` and `getTasksForUser` operation runs on a dedicated Java `Thread`. Active thread names are logged to the console on each request:

```
>> addTask running on thread: Thread-0
>> getTasksForUser running on thread: Thread-1
```