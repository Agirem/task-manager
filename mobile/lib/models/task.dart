enum TaskStatus { todo, done }

TaskStatus taskStatusFromJson(String value) {
  return value == 'DONE' ? TaskStatus.done : TaskStatus.todo;
}

String taskStatusToJson(TaskStatus status) {
  return status == TaskStatus.done ? 'DONE' : 'TODO';
}

class Task {
  final int id;
  final String title;
  final String? description;
  final TaskStatus status;
  final String createdAt;
  final String updatedAt;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      status: taskStatusFromJson(json['status'] as String),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Task copyWith({String? title, String? description, TaskStatus? status}) {
    return Task(
      id: id,
      title: title ?? this.title,
      description: description ?? this.description,
      status: status ?? this.status,
      createdAt: createdAt,
      updatedAt: updatedAt,
    );
  }
}
