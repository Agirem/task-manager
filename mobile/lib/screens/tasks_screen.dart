import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../models/task.dart';
import '../services/task_service.dart';
import '../services/auth_storage.dart';
import '../services/api_client.dart';
import '../widgets/task_tile.dart';
import '../widgets/task_form_sheet.dart';
import '../widgets/all_done_illustration.dart';
import 'login_screen.dart';

class TasksScreen extends StatefulWidget {
  const TasksScreen({super.key});

  @override
  State<TasksScreen> createState() => _TasksScreenState();
}

class _TasksScreenState extends State<TasksScreen> {
  List<Task> _tasks = [];
  bool _isLoading = true;
  String _search = '';

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    setState(() => _isLoading = true);
    try {
      final tasks = await TaskService.getTasks(search: _search.isEmpty ? null : _search);
      setState(() => _tasks = tasks);
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _handleStatusChange(Task task, TaskStatus status) async {
    final previous = List<Task>.from(_tasks);
    setState(() {
      _tasks = _tasks.map((t) => t.id == task.id ? t.copyWith(status: status) : t).toList();
    });

    try {
      await TaskService.updateTask(task.id, task.title, task.description, status);
      if (status == TaskStatus.done && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Tache marquee comme terminee')),
        );
      }
    } on ApiException catch (e) {
      setState(() => _tasks = previous);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  Future<void> _handleDelete(Task task) async {
    final previous = List<Task>.from(_tasks);
    setState(() => _tasks = _tasks.where((t) => t.id != task.id).toList());

    try {
      await TaskService.deleteTask(task.id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Tache supprimee')),
      );
    } on ApiException catch (e) {
      setState(() => _tasks = previous);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  Future<void> _handleCreate() async {
    final result = await TaskFormSheet.show(context, title: 'Nouvelle tache');
    if (result == null) return;

    final tempId = -DateTime.now().millisecondsSinceEpoch;
    final now = DateTime.now().toIso8601String();
    final optimisticTask = Task(
      id: tempId,
      title: result.title,
      description: result.description,
      status: TaskStatus.todo,
      createdAt: now,
      updatedAt: now,
    );

    setState(() => _tasks = [..._tasks, optimisticTask]);

    try {
      final created = await TaskService.createTask(result.title, result.description);
      setState(() {
        _tasks = _tasks.map((t) => t.id == tempId ? created : t).toList();
      });
    } on ApiException catch (e) {
      setState(() => _tasks = _tasks.where((t) => t.id != tempId).toList());
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  Future<void> _handleEdit(Task task) async {
    final result = await TaskFormSheet.show(
      context,
      title: 'Modifier la tache',
      initialTitle: task.title,
      initialDescription: task.description,
    );
    if (result == null) return;

    final previous = List<Task>.from(_tasks);
    setState(() {
      _tasks = _tasks
          .map((t) => t.id == task.id
              ? t.copyWith(title: result.title, description: result.description)
              : t)
          .toList();
    });

    try {
      await TaskService.updateTask(task.id, result.title, result.description, task.status);
    } on ApiException catch (e) {
      setState(() => _tasks = previous);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  Future<void> _handleLogout() async {
    await AuthStorage.clear();
    if (!mounted) return;
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (_) => const LoginScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeTasks = _tasks.where((t) => t.status != TaskStatus.done).toList();
    final completedTasks = _tasks.where((t) => t.status == TaskStatus.done).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mes taches'),
        actions: [
          IconButton(
            onPressed: _handleLogout,
            icon: const Icon(LucideIcons.logOut),
            tooltip: 'Deconnexion',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _handleCreate,
        child: const Icon(LucideIcons.plus),
      ),
      body: RefreshIndicator(
        onRefresh: _loadTasks,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(12),
              child: TextField(
                decoration: const InputDecoration(
                  hintText: 'Rechercher une tache...',
                  prefixIcon: Icon(LucideIcons.search),
                ),
                onChanged: (value) {
                  _search = value;
                  _loadTasks();
                },
              ),
            ),
            if (_isLoading)
              const Expanded(child: Center(child: CircularProgressIndicator()))
            else
              Expanded(
                child: ListView(
                  children: [
                    if (activeTasks.isEmpty)
                      const AllDoneIllustration()
                    else
                      for (final task in activeTasks) ...[
                        TaskTile(
                          task: task,
                          onStatusChange: _handleStatusChange,
                          onDelete: _handleDelete,
                          onEdit: _handleEdit,
                        ),
                        const Divider(height: 1, indent: 54),
                      ],
                    if (completedTasks.isNotEmpty)
                      ExpansionTile(
                        title: Text('Taches terminees (${completedTasks.length})'),
                        children: completedTasks
                            .map((task) => TaskTile(
                                  task: task,
                                  onStatusChange: _handleStatusChange,
                                  onDelete: _handleDelete,
                                  onEdit: _handleEdit,
                                ))
                            .toList(),
                      ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
