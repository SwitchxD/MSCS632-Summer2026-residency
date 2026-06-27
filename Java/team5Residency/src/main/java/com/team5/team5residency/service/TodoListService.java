package com.team5.team5residency.service;

import com.team5.team5residency.entity.TaskEntity;
import com.team5.team5residency.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoListService {

    private final TaskRepository taskRepository;

    public TaskEntity addTask(String userName, String taskName, String category) {
        TaskEntity task = new TaskEntity();
        task.setUsername(userName);
        task.setTaskName(taskName);
        task.setCategory(category);
        task.setStatus("PENDING");
        return taskRepository.save(task);
    }

    public List<TaskEntity> getTasksForUser(String userName) {
        return taskRepository.findByUsername(userName);
    }

    public TaskEntity updateStatus(String userName, int taskId, String status) {
        TaskEntity task = taskRepository.findByIdAndUsername(taskId, userName)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or access denied"));
        task.setStatus(status.toUpperCase());
        return taskRepository.save(task);
    }

    public void deleteTask(int taskId) throws Exception {
        try {
            TaskEntity task = taskRepository.findById(taskId);
            taskRepository.delete(task);
        } catch (Exception e) {
            throw new Exception("Failed to find the task ID");
        }
    }
}