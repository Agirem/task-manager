package com.taskmanager.backend.service;

import com.taskmanager.backend.dto.TaskRequest;
import com.taskmanager.backend.dto.TaskResponse;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.repository.TaskRepository;
import com.taskmanager.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
    }

    public List<TaskResponse> getTasks(String email, TaskStatus status, String search) {
        User user = getUserByEmail(email);
        List<Task> tasks;

        boolean hasStatus = status != null;
        boolean hasSearch = search != null && !search.isBlank();

        if (hasStatus && hasSearch) {
            tasks = taskRepository.findByUserAndStatusAndTitleContainingIgnoreCase(user, status, search);
        } else if (hasStatus) {
            tasks = taskRepository.findByUserAndStatus(user, status);
        } else if (hasSearch) {
            tasks = taskRepository.findByUserAndTitleContainingIgnoreCase(user, search);
        } else {
            tasks = taskRepository.findByUser(user);
        }

        return tasks.stream().map(TaskResponse::fromEntity).toList();
    }

    public TaskResponse createTask(String email, TaskRequest request) {
        User user = getUserByEmail(email);

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setUser(user);

        taskRepository.save(task);
        return TaskResponse.fromEntity(task);
    }

    public TaskResponse updateTask(String email, Long taskId, TaskRequest request) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tache introuvable"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Vous n'avez pas acces a cette tache");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        taskRepository.save(task);
        return TaskResponse.fromEntity(task);
    }

    public void deleteTask(String email, Long taskId) {
        User user = getUserByEmail(email);
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tache introuvable"));

        if (!task.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Vous n'avez pas acces a cette tache");
        }

        taskRepository.delete(task);
    }
}
