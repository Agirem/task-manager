import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../theme/app_colors.dart';

class AllDoneIllustration extends StatelessWidget {
  const AllDoneIllustration({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 48),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 160,
            height: 160,
            child: Lottie.asset(
              'assets/lottie/task-done.json',
              repeat: false,
              fit: BoxFit.contain,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(LucideIcons.circleCheck, color: AppColors.primary, size: 64);
              },
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Toutes les taches sont terminees',
            style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 4),
          const Text(
            'Bravo !',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }
}
