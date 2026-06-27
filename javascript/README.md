# Collaborative To-Do List Application

## Project Overview

This project is the JavaScript portion of a university assignment for a Collaborative To-Do List Application. It uses plain Node.js, ES modules, in-memory task storage, modular business logic, and a browser-based graphical user interface.

The application does not use Express, React, a database, login, or registration. It keeps exactly three predefined users: `Charan`, `Lokesh`, and `Jay`.

## Features

- Browser GUI served by plain Node.js
- Three predefined users: `Charan`, `Lokesh`, and `Jay`
- Four predefined task categories: `Work`, `School`, `Personal`, and `Recreation`
- Unique task ID used as the primary key for each task
- Switch the active user from the GUI
- Add tasks and assign them to any predefined user
- View only the active user's tasks
- Update task status between `Pending` and `Completed`
- Delete only tasks owned by the active user
- Clear error messages for invalid or unauthorized actions
- Concurrent task creation simulation for all three users
- In-memory task storage using an array

## Folder Structure

```text
javascript/
|-- app.js
|-- taskData.js
|-- taskService.js
|-- package.json
|-- README.md
`-- public/
    |-- index.html
    |-- styles.css
    `-- client.js
```

## Technologies Used

- JavaScript ES6+
- Node.js
- Node.js built-in `http` module
- ES modules
- Browser Fetch API
- HTML
- CSS
- Promises
- `async` / `await`
- `Promise.allSettled()`
- `setTimeout()`

## Prerequisites

Install Node.js before running the project.

Check that Node.js is available:

```powershell
node -v
```

Check that npm is available:

```powershell
npm.cmd -v
```

## Installation

Move into the JavaScript project folder:

```powershell
cd C:\Users\77199\OneDrive\Desktop\Python\MSCS632-Summer2026-residency\javascript
```

No external npm packages are required. The project uses only built-in Node.js and browser features.

## Running the Project

Start the Node.js server:

```powershell
node app.js
```

Or use the npm start script:

```powershell
npm.cmd start
```

Then open this URL in a browser:

```text
http://localhost:3000
```

## Expected GUI Behavior

The GUI displays:

- Current user selector
- Add task form
- Category selector for predefined categories
- Assign To selector for choosing which predefined user receives a new task
- Task list for the selected user
- Task status controls
- Delete controls
- Concurrent task creation button
- Activity log

Changing the current user updates the task list. New tasks can be assigned to any predefined user. Update and delete operations still use the selected current user and only work on tasks owned by that user.

Each task has a unique `id`. This `id` is the task's primary key and is used internally when updating or deleting a task.

## Concurrency Demonstration

The concurrency simulation is triggered with the `Run Simulation` button.

It simulates `Charan`, `Lokesh`, and `Jay` creating tasks at the same time. Each simulated operation uses `setTimeout()` with a random delay so operations may finish in a different order.

The implementation uses:

- `async` functions
- Promises
- `await`
- `Promise.allSettled()`
- `setTimeout()`

Node.js also logs when each concurrent operation starts and finishes.

## Project Structure Explanation

### `app.js`

Starts the plain Node.js web server, serves the GUI files, defines API routes, and runs the concurrency simulation.

### `taskData.js`

Stores shared application data and constants:

- `PREDEFINED_USERS`
- `TASK_CATEGORIES`
- `TASK_STATUS`
- The in-memory `tasks` array
- The task ID generator, which creates each task's primary key

### `taskService.js`

Contains the core task business logic:

- `addTask(taskName, category, assignedUser)`
- `viewTasksByUser(assignedUser)`
- `updateTaskStatus(taskId, assignedUser, status)`
- `deleteTask(taskId, assignedUser)`

This module validates users, statuses, task IDs, task ownership, and required task fields.

### `public/index.html`

Defines the browser interface structure.

### `public/styles.css`

Styles the GUI layout, task list, controls, and activity log.

### `public/client.js`

Handles browser interactions, calls the Node.js API with `fetch()`, updates the task list, switches users, and displays activity messages.

### `package.json`

Defines project metadata and scripts. The project uses `"type": "module"` so ES module `import` and `export` syntax can be used.
