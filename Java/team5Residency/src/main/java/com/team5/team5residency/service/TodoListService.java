package com.team5.team5residency.service;

import com.team5.team5residency.entity.TaskEntity;
import com.team5.team5residency.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Slf4j
@Service
@RequiredArgsConstructor
public class TodoListService {

    private final TaskRepository taskRepository;

    @Transactional
    public TaskEntity addTask(String userName, String taskName, String category) throws InterruptedException {
        TaskEntity task = new TaskEntity();
        task.setUsername(userName);
        task.setTaskName(taskName);
        task.setCategory(category);
        task.setStatus("PENDING");

        // array to hold result from inside thread
        TaskEntity[] saved = new TaskEntity[1];

        Thread thread = new Thread(() -> {
            log.info(">> addTask running on thread: {}", Thread.currentThread().getName());
            synchronized (this) {
                saved[0] = taskRepository.save(task);
            }
        });

        thread.start();
        thread.join();

        return saved[0];
    }

    public List<TaskEntity> getTasksForUser(String userName) throws InterruptedException {
        List<TaskEntity> result = new CopyOnWriteArrayList<>();
        Thread thread = new Thread(() -> {
            log.info(">> getTasksForUser running on thread: {}", Thread.currentThread().getName());
            result.addAll(taskRepository.findByUsername(userName));
        });

        thread.start();
        thread.join(); // wait for thread to complete before returning

        return result;
    }

    public TaskEntity updateStatus(String userName, int taskId, String status) {
        TaskEntity task = taskRepository.findByIdAndUsername(taskId, userName)
                .orElseThrow(() -> new IllegalArgumentException("Task not found or access denied"));
        task.setStatus(status.toUpperCase());
        return taskRepository.save(task);
    }

    public void deleteTask(int taskId) throws Exception {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new Exception("Failed to find the task ID"));
        taskRepository.delete(task);
    }
}