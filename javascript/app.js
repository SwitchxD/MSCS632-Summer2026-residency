import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PREDEFINED_USERS, TASK_CATEGORIES } from "./taskData.js";
import {
  addTask,
  deleteTask,
  updateTaskStatus,
  viewTasksByUser,
} from "./taskService.js";

const PORT = 3000;
const MINIMUM_DELAY_MILLISECONDS = 500;
const MAXIMUM_DELAY_MILLISECONDS = 2000;
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDirectory = join(__dirname, "public");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

// Sends a JSON response with a consistent shape for the frontend.
const sendJson = (response, statusCode, data) => {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
};

// Reads and parses the JSON request body for POST, PATCH, and DELETE routes.
const readJsonBody = async (request) =>
  new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });

    request.on("error", reject);
  });

// Serves static frontend files from the public folder.
const serveStaticFile = async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const filePath = join(publicDirectory, requestedPath);
  const extension = extname(filePath);

  try {
    const fileContents = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    });
    response.end(fileContents);
  } catch {
    sendJson(response, 404, { error: "File not found." });
  }
};

// Returns a random delay for the concurrency simulation.
const getRandomDelayMilliseconds = () =>
  Math.floor(
    Math.random() * (MAXIMUM_DELAY_MILLISECONDS - MINIMUM_DELAY_MILLISECONDS + 1)
  ) + MINIMUM_DELAY_MILLISECONDS;

// Wraps setTimeout in a Promise so each simulated user operation can await it.
const wait = (delayMilliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMilliseconds);
  });

// Simulates one user creating a task after a random delay.
const simulateUserCreatingTask = async ({ assignedUser, taskName, category }) => {
  const delayMilliseconds = getRandomDelayMilliseconds();

  console.log(
    `${assignedUser} started creating "${taskName}" with a ${delayMilliseconds}ms delay.`
  );

  await wait(delayMilliseconds);

  const createdTask = addTask(taskName, category, assignedUser);

  console.log(`${assignedUser} finished creating task ${createdTask.id}.`);

  return createdTask;
};

// Demonstrates concurrent task creation with Promise.allSettled().
const simulateConcurrentTaskCreation = async () => {
  const taskRequests = PREDEFINED_USERS.map((user, index) => ({
    assignedUser: user,
    taskName: `Concurrent task ${index + 1}`,
    category: TASK_CATEGORIES[index % TASK_CATEGORIES.length],
  }));

  const taskCreationPromises = taskRequests.map(simulateUserCreatingTask);
  return Promise.allSettled(taskCreationPromises);
};

// Converts Promise.allSettled() results into JSON-friendly objects.
const serializeSettledResults = (results) =>
  results.map((result) => {
    if (result.status === "fulfilled") {
      return result;
    }

    return {
      status: "rejected",
      reason: {
        message: result.reason.message,
      },
    };
  });

// Handles all API routes used by the browser GUI.
const handleApiRequest = async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (request.method === "GET" && requestUrl.pathname === "/api/users") {
      sendJson(response, 200, { users: PREDEFINED_USERS });
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/categories") {
      sendJson(response, 200, { categories: TASK_CATEGORIES });
      return;
    }

    if (request.method === "GET" && requestUrl.pathname === "/api/tasks") {
      const assignedUser = requestUrl.searchParams.get("assignedUser");
      sendJson(response, 200, { tasks: viewTasksByUser(assignedUser) });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/tasks") {
      const { taskName, category, assignedUser } = await readJsonBody(request);
      const task = addTask(taskName, category, assignedUser);
      sendJson(response, 201, { task });
      return;
    }

    if (request.method === "PATCH" && requestUrl.pathname === "/api/tasks/status") {
      const { taskId, assignedUser, status } = await readJsonBody(request);
      const task = updateTaskStatus(Number(taskId), assignedUser, status);
      sendJson(response, 200, { task });
      return;
    }

    if (request.method === "DELETE" && requestUrl.pathname === "/api/tasks") {
      const { taskId, assignedUser } = await readJsonBody(request);
      const task = deleteTask(Number(taskId), assignedUser);
      sendJson(response, 200, { task });
      return;
    }

    if (request.method === "POST" && requestUrl.pathname === "/api/concurrency") {
      const results = await simulateConcurrentTaskCreation();
      const tasksByUser = PREDEFINED_USERS.map((user) => ({
        user,
        tasks: viewTasksByUser(user),
      }));

      sendJson(response, 200, {
        results: serializeSettledResults(results),
        tasksByUser,
      });
      return;
    }

    sendJson(response, 404, { error: "API route not found." });
  } catch (error) {
    sendJson(response, 400, { error: error.message });
  }
};

// Routes API calls to the backend and all other requests to static frontend files.
const server = createServer(async (request, response) => {
  if (request.url.startsWith("/api/")) {
    await handleApiRequest(request, response);
    return;
  }

  await serveStaticFile(request, response);
});

server.listen(PORT, () => {
  console.log("Collaborative To-Do List Application GUI is running.");
  console.log(`Open http://localhost:${PORT} in your browser.`);
});
