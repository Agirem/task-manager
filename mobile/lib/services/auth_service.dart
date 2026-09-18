import '../models/auth_response.dart';
import 'api_client.dart';

class AuthService {
  static Future<AuthResponse> register(String email, String password) async {
    final data = await ApiClient.post('/auth/register', {
      'email': email,
      'password': password,
    });
    return AuthResponse.fromJson(data as Map<String, dynamic>);
  }

  static Future<AuthResponse> login(String email, String password) async {
    final data = await ApiClient.post('/auth/login', {
      'email': email,
      'password': password,
    });
    return AuthResponse.fromJson(data as Map<String, dynamic>);
  }
}
