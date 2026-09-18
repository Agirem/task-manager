import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../models/task.dart';
import '../theme/app_colors.dart';

class TaskTile extends StatelessWidget {
  final Task task;
  final void Function(Task task, TaskStatus status) onStatusChange;
  final void Function(Task task) onDelete;
  final void Function(Task task) onEdit;

  const TaskTile({
    super.key,
    required this.task,
    required this.onStatusChange,
    required this.onDelete,
    required this.onEdit,
  });

  Future<void> _confirmDelete(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Supprimer cette tache ?'),
        content: Text('"${task.title}" sera definitivement supprimee.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Annuler'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      onDelete(task);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDone = task.status == TaskStatus.done;
    final hasDescription = task.description != null && task.description!.isNotEmpty;

    return InkWell(
      onTap: () => onEdit(task),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 2),
              child: Material(
                type: MaterialType.transparency,
                child: InkWell(
                  customBorder: const CircleBorder(),
                  onTap: () {
                    onStatusChange(task, isDone ? TaskStatus.todo : TaskStatus.done);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDone ? AppColors.primary : Colors.transparent,
                      border: Border.all(
                        color: isDone ? AppColors.primary : AppColors.textHint,
                        width: 1.5,
                      ),
                    ),
                    child: isDone
                        ? const Icon(LucideIcons.check, size: 14, color: Colors.white)
                        : null,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    style: TextStyle(
                      fontSize: 16,
                      color: isDone ? AppColors.textHint : AppColors.textPrimary,
                      decoration: isDone ? TextDecoration.lineThrough : null,
                    ),
                  ),
                  if (hasDescription) ...[
                    const SizedBox(height: 2),
                    Text(
                      task.description!,
                      style: TextStyle(
                        fontSize: 13,
                        color: isDone ? AppColors.textHint : AppColors.textSecondary,
                        decoration: isDone ? TextDecoration.lineThrough : null,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            IconButton(
              icon: const Icon(LucideIcons.trash2, size: 20, color: AppColors.textHint),
              onPressed: () => _confirmDelete(context),
              visualDensity: VisualDensity.compact,
            ),
          ],
        ),
      ),
    );
  }
}
