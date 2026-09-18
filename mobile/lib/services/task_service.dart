import '../models/task.dart';
import 'api_client.dart';

class TaskService {
  static Future<List<Task>> getTasks({TaskStatus? status, String? search}) async {
    final params = <String, String>{};
    if (status != null) params['status'] = taskStatusToJson(status);
    if (search != null && search.isNotEmpty) params['search'] = search;

    final query = params.isNotEmpty
        ? '?${Uri(queryParameters: params).query}'
        : '';

    final data = await ApiClient.get('/tasks$query');
    return (data as List).map((json) => Task.fromJson(json as Map<String, dynamic>)).toList();
  }

  static Future<Task> createTask(String title, String? description) async {
    final data = await ApiClient.post('/tasks', {
      'title': title,
      'description': description ?? '',
    });
    return Task.fromJson(data as Map<String, dynamic>);
  }

  static Future<Task> updateTask(int id, String title, String? description, TaskStatus status) async {
    final data = await ApiClient.put('/tasks/$id', {
      'title': title,
      'description': description ?? '',
      'status': taskStatusToJson(status),
    });
    return Task.fromJson(data as Map<String, dynamic>);
  }

  static Future<void> deleteTask(int id) async {
    await ApiClient.delete('/tasks/$id');
  }
}
