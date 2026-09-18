package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(
            Authentication authentication,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(taskService.getTasks(email, status, search));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest request
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(taskService.createTask(email, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(taskService.updateTask(email, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            Authentication authentication,
            @PathVariable Long id
    ) {
        String email = authentication.getName();
        taskService.deleteTask(email, id);
        return ResponseEntity.noContent().build();
    }
}
