const userSelect = document.querySelector("#currentUserSelect");
const assignedUserSelect = document.querySelector("#assignedUserSelect");
const addTaskForm = document.querySelector("#addTaskForm");
const taskNameInput = document.querySelector("#taskNameInput");
const categorySelect = document.querySelector("#categorySelect");
const taskList = document.querySelector("#taskList");
const activityLog = document.querySelector("#activityLog");
const refreshTasksButton = document.querySelector("#refreshTasksButton");
const runConcurrencyButton = document.querySelector("#runConcurrencyButton");
const clearLogButton = document.querySelector("#clearLogButton");

let currentUser = "Charan";

// Writes a readable line to the activity log.
const addLogEntry = (message, type = "info") => {
  const entry = document.createElement("p");
  entry.className = `log-entry ${type}`;
  entry.textContent = message;
  activityLog.prepend(entry);
};

// Calls the built-in Node.js API and normalizes error handling.
const apiRequest = async (path, options = {}) => {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed.");
  }

  return data;
};

// Builds a single task row with update and delete actions.
const createTaskRow = (task) => {
  const row = document.createElement("article");
  row.className = "task-row";

  const completedClass = task.status === "Completed" ? " completed" : "";

  row.innerHTML = `
    <div class="task-id">Task ID ${task.id}</div>
    <div>
      <div class="task-name"></div>
      <div class="task-meta"></div>
    </div>
    <div class="status-pill${completedClass}"></div>
    <div class="task-meta"></div>
    <div class="task-actions">
      <button class="secondary" type="button" data-action="toggle"></button>
      <button class="danger" type="button" data-action="delete">Delete</button>
    </div>
  `;

  row.querySelector(".task-name").textContent = task.taskName;
  row.querySelector(".task-meta").textContent = task.category;
  row.querySelector(".status-pill").textContent = task.status;
  row.querySelectorAll(".task-meta")[1].textContent = task.assignedUser;

  const toggleButton = row.querySelector("[data-action='toggle']");
  toggleButton.textContent = task.status === "Completed" ? "Mark Pending" : "Complete";
  toggleButton.addEventListener("click", () => toggleTaskStatus(task));

  row.querySelector("[data-action='delete']").addEventListener("click", () =>
    deleteTask(task)
  );

  return row;
};

// Loads and displays only tasks assigned to the active user.
const loadTasks = async () => {
  try {
    const data = await apiRequest(
      `/api/tasks?assignedUser=${encodeURIComponent(currentUser)}`
    );

    taskList.innerHTML = "";

    if (data.tasks.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = `No tasks found for ${currentUser}.`;
      taskList.append(emptyState);
      return;
    }

    data.tasks.forEach((task) => {
      taskList.append(createTaskRow(task));
    });
  } catch (error) {
    addLogEntry(error.message, "error");
  }
};

// Adds a task and assigns it to the selected predefined user.
// The current user is still used for viewing, updating, and deleting tasks.
const addTask = async (event) => {
  event.preventDefault();

  try {
    const data = await apiRequest("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        assignedUser: assignedUserSelect.value,
        taskName: taskNameInput.value,
        category: categorySelect.value,
      }),
    });

    addLogEntry(
      `${currentUser} created task ${data.task.id} for ${data.task.assignedUser}.`
    );
    addTaskForm.reset();
    assignedUserSelect.value = currentUser;
    await loadTasks();
  } catch (error) {
    addLogEntry(error.message, "error");
  }
};

// Toggles a task between Pending and Completed for the current user.
const toggleTaskStatus = async (task) => {
  const nextStatus = task.status === "Completed" ? "Pending" : "Completed";

  try {
    const data = await apiRequest("/api/tasks/status", {
      method: "PATCH",
      body: JSON.stringify({
        taskId: task.id,
        assignedUser: currentUser,
        status: nextStatus,
      }),
    });

    addLogEntry(`Updated task ${data.task.id} to ${data.task.status}.`);
    await loadTasks();
  } catch (error) {
    addLogEntry(error.message, "error");
  }
};

// Deletes a task for the current user.
const deleteTask = async (task) => {
  try {
    const data = await apiRequest("/api/tasks", {
      method: "DELETE",
      body: JSON.stringify({
        taskId: task.id,
        assignedUser: currentUser,
      }),
    });

    addLogEntry(`Deleted task ${data.task.id}.`);
    await loadTasks();
  } catch (error) {
    addLogEntry(error.message, "error");
  }
};

// Runs the backend concurrency simulation and logs each settled result.
const runConcurrencySimulation = async () => {
  runConcurrencyButton.disabled = true;
  runConcurrencyButton.textContent = "Running...";
  addLogEntry("Concurrent task creation started.");

  try {
    const data = await apiRequest("/api/concurrency", { method: "POST" });

    data.results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        addLogEntry(
          `${result.value.assignedUser} created task ${result.value.id}.`
        );
        return;
      }

      addLogEntry(`Concurrent task failed: ${result.reason.message}`, "error");
    });

    await loadTasks();
  } catch (error) {
    addLogEntry(error.message, "error");
  } finally {
    runConcurrencyButton.disabled = false;
    runConcurrencyButton.textContent = "Run Simulation";
  }
};

// Adds predefined values to a select element.
const populateSelect = (selectElement, values) => {
  selectElement.innerHTML = "";
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.append(option);
  });
};

// Loads predefined users into the Current User and Assign To selectors.
const initializeUsers = async () => {
  const data = await apiRequest("/api/users");

  populateSelect(userSelect, data.users);
  populateSelect(assignedUserSelect, data.users);

  currentUser = data.users[0];
  userSelect.value = currentUser;
  assignedUserSelect.value = currentUser;
};

// Loads predefined task categories into the Category selector.
const initializeCategories = async () => {
  const data = await apiRequest("/api/categories");
  populateSelect(categorySelect, data.categories);
};

userSelect.addEventListener("change", async () => {
  currentUser = userSelect.value;
  assignedUserSelect.value = currentUser;
  addLogEntry(`Current user changed to ${currentUser}.`);
  await loadTasks();
});

addTaskForm.addEventListener("submit", addTask);
refreshTasksButton.addEventListener("click", loadTasks);
runConcurrencyButton.addEventListener("click", runConcurrencySimulation);
clearLogButton.addEventListener("click", () => {
  activityLog.innerHTML = "";
});

await initializeUsers();
await initializeCategories();
await loadTasks();
addLogEntry(`Application ready for ${currentUser}.`);
