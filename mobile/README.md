# Mobile

Task Manager Flutter app (Android/iOS only), consuming the same API as the
web frontend.

A prebuilt release APK is available on the
[GitHub Releases page](https://github.com/Agirem/task-manager/releases/tag/mobile-v1.0.0)
if you just want to try the app without building it.

## Run locally

```bash
flutter pub get
flutter run --flavor dev -t lib/main_dev.dart --dart-define=FLAVOR=dev --dart-define=API_BASE_URL=http://localhost:8080/api
```

`API_BASE_URL` defaults to `http://localhost:8080/api`, which works
out of the box on an emulator/simulator. On a **physical Android device**
connected via USB, `localhost` on the device is not your computer - first
forward the port with:

```bash
adb reverse tcp:8080 tcp:8080
```

This redirects the device's `localhost:8080` to your machine's
`localhost:8080`, so the app can reach the locally running backend without
being on the same Wi-Fi network. Run this once per `adb` session (it
resets when the device disconnects or the computer restarts).

On a **physical iOS device**, `adb reverse` doesn't apply - instead point
`API_BASE_URL` at your machine's LAN IP (e.g.
`http://192.168.1.x:8080/api`), reachable from the same Wi-Fi network as
the backend.

## Flavors

Two flavors are configured, `dev` and `prod`, with dedicated entry points
(`lib/main_dev.dart` / `lib/main_prod.dart`) and a distinct `applicationId`
(`.dev` suffix) so both can be installed side by side on the same device.

```bash
flutter run --flavor dev -t lib/main_dev.dart --dart-define=FLAVOR=dev --dart-define=API_BASE_URL=http://localhost:8080/api
flutter run --flavor prod -t lib/main_prod.dart --dart-define=FLAVOR=prod --dart-define=API_BASE_URL=https://api.taskmanager.meriga.cm/api
```

## Release build (obfuscated)

```bash
flutter build apk --release --flavor prod -t lib/main_prod.dart --dart-define=FLAVOR=prod --dart-define=API_BASE_URL=https://api.taskmanager.meriga.cm/api --obfuscate --split-debug-info=build/symbols/prod
flutter build apk --release --flavor dev -t lib/main_dev.dart --dart-define=FLAVOR=dev --dart-define=API_BASE_URL=http://localhost:8080/api --obfuscate --split-debug-info=build/symbols/dev
```

Keep the `build/symbols/` folder (outside the repo) to be able to
de-obfuscate crash report stack traces (`flutter symbolize`) - never
distribute it. On Android, `minifyEnabled`/`shrinkResources` + ProGuard/R8
are already enabled on the `release` build type (see
`android/app/build.gradle.kts`).

## Notes

- On Android, sideloading the release APK requires enabling "Install
  unknown apps" for the app used to open the file.
- iOS flavor build configurations (`Debug-dev.xcconfig`,
  `Release-prod.xcconfig`, etc.) are in place, but the Xcode schemes
  (`Runner-dev` / `Runner-prod`) still need to be created once in Xcode -
  not doable from a non-macOS machine.
