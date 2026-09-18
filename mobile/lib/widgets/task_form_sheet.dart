import 'package:flutter/material.dart';
import 'app_bottom_sheet.dart';
import 'primary_button.dart';

class TaskFormResult {
  final String title;
  final String? description;

  TaskFormResult(this.title, this.description);
}

class TaskFormSheet extends StatefulWidget {
  const TaskFormSheet({super.key, this.initialTitle = '', this.initialDescription});

  final String initialTitle;
  final String? initialDescription;

  static Future<TaskFormResult?> show(
    BuildContext context, {
    required String title,
    String initialTitle = '',
    String? initialDescription,
  }) {
    return AppBottomSheet.show<TaskFormResult>(
      context,
      title: title,
      child: TaskFormSheet(
        initialTitle: initialTitle,
        initialDescription: initialDescription,
      ),
    );
  }

  @override
  State<TaskFormSheet> createState() => _TaskFormSheetState();
}

class _TaskFormSheetState extends State<TaskFormSheet> {
  late final _titleController = TextEditingController(text: widget.initialTitle);
  late final _descriptionController = TextEditingController(text: widget.initialDescription ?? '');

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _submit() {
    final title = _titleController.text.trim();
    if (title.isEmpty) return;
    final description = _descriptionController.text.trim();
    Navigator.of(context).pop(
      TaskFormResult(title, description.isEmpty ? null : description),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        TextField(
          controller: _titleController,
          autofocus: true,
          decoration: const InputDecoration(labelText: 'Titre de la tache'),
          textInputAction: TextInputAction.next,
        ),
        const SizedBox(height: 12),
        TextField(
          controller: _descriptionController,
          decoration: const InputDecoration(labelText: 'Description'),
          minLines: 2,
          maxLines: 4,
          textInputAction: TextInputAction.done,
          onSubmitted: (_) => _submit(),
        ),
        const SizedBox(height: 20),
        PrimaryButton(
          label: 'Enregistrer',
          onPressed: _submit,
        ),
        const SizedBox(height: 8),
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Annuler'),
        ),
      ],
    );
  }
}
