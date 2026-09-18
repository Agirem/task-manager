# Add project specific ProGuard rules here.

# dio / OkHttp / Okio: reflection-based, get stripped by R8 without these.
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-keep class okio.** { *; }
-dontwarn okio.**

# flutter_secure_storage uses reflection to access Android Keystore APIs.
-keep class androidx.security.crypto.** { *; }
