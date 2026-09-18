import 'package:dio/dio.dart';
import '../config/app_flavor.dart';
import 'auth_storage.dart';

class ApiException implements Exception {
  final int status;
  final String message;

  ApiException(this.status, this.message);

  @override
  String toString() => message;
}

class ApiClient {
  // localhost fonctionne sur device via `adb reverse tcp:8080 tcp:8080`.
  static const String baseUrl = AppFlavor.apiBaseUrl;

  static final Dio _dio = Dio(BaseOptions(baseUrl: baseUrl))
    ..interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await AuthStorage.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
      ),
    );

  static dynamic _handleResponse(Response response) {
    if (response.statusCode == 204) return null;
    return response.data;
  }

  static ApiException _handleError(DioException error) {
    final status = error.response?.statusCode ?? 0;
    final body = error.response?.data;
    final message = body is Map && body['message'] != null
        ? body['message'] as String
        : 'Une erreur est survenue';
    return ApiException(status, message);
  }

  static Future<dynamic> get(String path) async {
    try {
      final response = await _dio.get(path);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<dynamic> post(String path, Map<String, dynamic> body) async {
    try {
      final response = await _dio.post(path, data: body);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<dynamic> put(String path, Map<String, dynamic> body) async {
    try {
      final response = await _dio.put(path, data: body);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  static Future<dynamic> delete(String path) async {
    try {
      final response = await _dio.delete(path);
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
}
