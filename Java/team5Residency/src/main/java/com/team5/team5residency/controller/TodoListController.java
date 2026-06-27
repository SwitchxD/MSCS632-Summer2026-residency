package com.team5.team5residency.controller;

import com.team5.team5residency.entity.TaskEntity;
import com.team5.team5residency.repository.TaskRepository;
import com.team5.team5residency.service.TodoListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TodoListController {

    private final TodoListService todoListService;
    private final TaskRepository taskRepository;

    // POST /api/tasks?userName=alice&taskName=Buy groceries&category=Personal
    @PostMapping
    public ResponseEntity<TaskEntity> addTask(@RequestParam String userName,
                                              @RequestParam String taskName,
                                              @RequestParam String category) {
        return ResponseEntity.status(HttpStatus.CREATED).body(todoListService.addTask(userName, taskName, category));
    }

    // GET /api/tasks?userName=alice
    @GetMapping
    public ResponseEntity<List<TaskEntity>> getTasks(@RequestParam String userName) {
        return ResponseEntity.ok(todoListService.getTasksForUser(userName));
    }

    // PUT /api/tasks/{taskId}/status?userName=alice&status=COMPLETED
    @PutMapping("/{taskId}/status")
    public ResponseEntity<TaskEntity> updateStatus(@PathVariable int taskId,
                                                   @RequestParam String userName,
                                                   @RequestParam String status) {
        return ResponseEntity.ok(todoListService.updateStatus(userName, taskId, status));
    }

    // DELETE /api/tasks/{taskId}
    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@PathVariable int taskId) throws Exception {
        todoListService.deleteTask(taskId);
        return ResponseEntity.ok("Successfully deleted record with Task ID: " + taskId);
    }
}