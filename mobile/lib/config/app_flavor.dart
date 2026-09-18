class AppFlavor {
  static const String flavor = String.fromEnvironment('FLAVOR', defaultValue: 'prod');

  static bool get isDev => flavor == 'dev';

  static String get appName => isDev ? 'Task Manager Dev' : 'Task Manager';

  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080/api',
  );
}
