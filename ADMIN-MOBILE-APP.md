# Investo Kings Admin as a phone app

## Install it (about 1 minute, no APK needed)
1. On your Android phone open Chrome and go to  https://calvinmaggz-maker.github.io/admin.html
2. Tap the three dots, then **Install app** (or **Add to Home screen**).
3. Open **IK Admin** from your home screen. It opens full screen with the gold crown icon, separate from the client app.
4. Sign in. The first time use admin / admin and code 123456, then change it straight away: tap **Default login in use** at the top, or go to menu > Settings (under AI Trading) > Security.

Inside the app: the bottom bar has Home, AI, Compliance, MT5 and More. **More** (or the menu button, top left) opens every page, the install button and Log out. The Android back button goes back one page.

## Connect it
- Settings (under AI Trading) > Online database: same address and room code as before.
- MT5 Broker page > Control key: enter your control key on this phone too. The key is stored on each device separately.

## Optional: a real APK
1. Go to pwabuilder.com on your phone, enter  https://calvinmaggz-maker.github.io/admin.html  and tap Start.
2. Choose Package for stores, then Android. Use a package name such as com.investokings.admin. Create a new signing key and keep the file and its passwords safe.
3. Download the zip and install the APK.
4. To remove the address bar at the top, add the new app's fingerprint to `.well-known/assetlinks.json` in your repository. If that file already exists for the client app, keep its entry and add the new one to the same list.

## Important: keep the app open
The simulation engine and the command channel run inside the admin app, because there is no server yet.
- While the admin app is open and the screen is on, everything works. The app asks the phone to keep the screen awake.
- If the phone sleeps or you close the app, the engine stops. Clients then see AI Trading as offline after about 20 seconds, and commands cannot be sent. Your EA keeps its own stop and safety rules.
- Only one admin screen can run the engine at a time. If the PC admin is running, the phone shows "Another device is running the AI engine". Tap Take over only if you want to move it.

The proper fix is to run the engine on an always-on computer or server, and use the phone only as a remote control. That is the next build step.

## Security note
The login is a lock stored on the device, not real security. Anyone who knows the address can see the sign-in screen. Do not put real client data behind it until real sign-in and a server are added.
