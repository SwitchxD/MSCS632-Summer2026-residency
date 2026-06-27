// Predefined users for the Collaborative To-Do List Application.
// Registration and login are intentionally not part of this assignment.
export const PREDEFINED_USERS = ["Charan", "Lokesh", "Jay"];

// Valid task statuses used throughout the application.
// Object.freeze prevents accidental changes to these required status values.
export const TASK_STATUS = Object.freeze({
  PENDING: "Pending",
  COMPLETED: "Completed",
});

// Predefined task categories for every task in the application.
export const TASK_CATEGORIES = ["Work", "School", "Personal", "Recreation"];

// In-memory task storage. Tasks are added, updated, viewed, and deleted
// through taskService.js so business rules stay in one place.
export const tasks = [];

// Tracks the next task ID. The generated ID is the primary key for each task
// while the application is running.
let nextTaskId = 1;

// Generates the next available primary key for newly created tasks.
export const generateTaskId = () => nextTaskId++;
