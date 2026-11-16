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

## Control the PC from your phone (remote control)
Run the engine on your PC and use the phone as a remote. The phone never takes over, so closing it or switching to the client app does not disturb anything.

How to set it up:
1. On the PC open the admin page first and sign in. In Settings (under AI Trading) > Online database, turn ON "Always take the engine when this device opens". Leave the PC admin open and keep the PC awake. Your MT5 and the bridge EA also stay open on the PC.
2. On the PC and on the phone enter the SAME control key on the MT5 Broker page. The phone signs every action with it, and the PC rejects anything that does not match.
3. Open the admin app on the phone. It detects the PC engine and shows a green REMOTE tag and a banner. It does not take over.

What you can do from the phone: choose BUY or SELL MODE and instruments, Activate, Stop, Close All, Emergency Stop, Get status, freeze or restore a client, review compliance alerts, change risk and account levels, send signals and notifications, stop a client, retry a failed close. Everything is recorded as "Admin (phone)" in the command log and audit log.

What stays on the PC only: simulation speed, market mood, time jumps, resets and the other test tools.

If the phone cannot reach the PC engine for about 12 seconds, it shows PC OFFLINE, keeps the last data on screen, and refuses to send actions, so a command is never reported as done when nobody ran it. The Take over button then lets you run the engine from the phone. Do not use it while the PC is running.

Data use: while the phone app is open it downloads a small update about every 2 seconds. It stops when you close the app.

If you open the phone first (PC off), the phone runs the engine itself. Then you must keep the phone app open and awake. When you later open the PC with the switch above ON, the PC takes the engine back and the phone becomes the remote.

## Security note
The login is a lock stored on the device, not real security. Anyone who knows the address can see the sign-in screen. Do not put real client data behind it until real sign-in and a server are added.
