# Real Android apps (APK): Investo Kings Admin and Client

These are real Android apps. The app files are packed inside the APK, so they open full screen with their own icon and splash screen. There is no Chrome, no address bar and no verification file. GitHub builds the APK for you in the cloud, like the Windows .exe build.

Package names: IK Admin = com.investokings.adminapp, Investo Kings (client) = com.investokings.clientapp.

## One-time setup (about 10 minutes, all on your phone)
1. Upload everything from the latest zip to the main folder of your repository, as you did before. It now contains a folder called `mobile-assets`. Make sure that folder is uploaded with all its files.
2. In your repository tap **Add file > Create new file**. Name it  `.github/workflows/build-android.yml`  and paste the text from `desktop-build/build-android.yml` in the zip. Tap **Commit changes**.

## Build an app
1. Open the **Actions** tab, choose **Build Android App**, tap **Run workflow**.
2. Pick **admin** (or **client**) and tap the green **Run workflow** button.
3. Wait 8 to 12 minutes for the green tick.
4. Open the finished run and scroll to **Artifacts** at the bottom. Download the file named like `IK-admin-1.0.1.apk`. It comes as a zip, so unzip it first.
5. Open the APK on your phone and install it. If Android asks, allow installing from this source.

Delete any older IK Admin you installed from PWABuilder first, and any home-screen shortcut of the website. Then open the new app, go to Settings (under AI Trading) > Online database and enter your database address and room code. Enter the control key on the MT5 Broker page.

## Updating later
Upload the new files to GitHub, run the workflow again and install the new APK over the old one. Your login and settings stay, because every build is signed with the same key.

## Good to know
- The admin app works as before: remote control of the PC, bottom bar, back button.
- Exporting CSV files does not work inside the app yet. Use the PC for exports.
- The phone does not stay awake by itself. If the phone is the engine, keep the screen on. If the PC is the engine, this does not matter.
- The client app asks for camera permission for identity checks. Phone notifications from the client app only appear as in-app alerts for now. Real push notifications need a push service and server, which is a later stage.
- This is a test build. The signing key is in the repository, which is fine for a personal test but not for a public store release. For a real release we would create a private key and save it in GitHub Secrets (names ANDROID_KEYSTORE_B64 and ANDROID_KEYSTORE_PASSWORD, already supported by the workflow).
- I could not run this build myself. If a step fails, open the failed step, take a screenshot of the last lines, and I will fix it.
