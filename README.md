# INVESTO KINGS - installable test app (PWA) and APK guide

This is a TEST build. Money, prices, trades, banks, vouchers and verification are all SIMULATED. Nothing here moves real money.

## What is in this folder
All files sit in one flat folder on purpose, so you can upload them from a phone.

- index.html, app.css, core.js, config.js, screens-a.js, screens-b.js, screens-c.js: the app
- manifest.webmanifest: the PWA manifest (name, colours, icons, screenshots)
- sw.js: the service worker (makes the app work offline)
- icon-192.png, icon-512.png, icon-maskable-512.png, icon-monochrome-512.png, apple-touch-icon.png, favicon-48.png: icons
- bg-map.png, bg-words.png: the dotted world map and INVESTO KINGS wordmark backgrounds
- screenshot-1.png, screenshot-2.png, screenshot-3.png: screenshots for PWABuilder
- .nojekyll and .well-known/assetlinks.json: two hidden helper files (you create these on GitHub, see Step 5)

## Edit these before sharing
Open config.js to set your company name, registration numbers, support email and phone, bank details for deposits, and limits. Set IK.cfg.TEST=false to hide the orange TEST MODE bar.

---------------------------------------------------------------------
# PART 1. Put the app online (needed for both installing and packaging)
PWABuilder needs a public https web address. The easiest free way from a phone is GitHub Pages.

## Step 1. Get the files onto your phone
1. Download investo-kings-pwa.zip to your phone.
2. Open the Files app, tap the zip, tap Extract. You now have a folder with about 22 files.

## Step 2. Make a GitHub account and the website repository
1. In Chrome go to github.com and sign up (free). Confirm your email.
2. Tap the + (top right), then New repository.
3. Repository name: type EXACTLY  yourusername.github.io  (your GitHub username, all lowercase, then .github.io).
4. Choose Public. Tap Create repository.
Tip: if buttons are missing or tiny, open Chrome menu (three dots) and tick Desktop site.

## Step 3. Upload the files
1. In the new repository tap "uploading an existing file".
2. Tap choose your files, open the extracted folder, select ALL files, then confirm.
3. Wait until every file shows, scroll down and tap Commit changes.
(Hidden files do not show in the picker. That is fine, you add them next.)

## Step 4. Add the .nojekyll file
1. Tap Add file, then Create new file.
2. In the name box type  .nojekyll
3. In the big box type any single character, for example a dot.
4. Tap Commit changes.

## Step 5. Turn on the website
1. Tap Settings, then Pages (left menu).
2. Under Build and deployment choose Deploy from a branch, branch main, folder / (root), then Save.
3. Wait 1 to 3 minutes and refresh. A link appears: https://yourusername.github.io/
4. Open that link in Chrome on your phone. You should see the Investo Kings splash screen.

## Step 6. Install it as an app straight away (no APK needed)
In Chrome tap the menu (three dots) and choose Install app (or Add to Home screen). Android adds Investo Kings to your home screen and it opens full screen like a normal app. This is the fastest way to test.

---------------------------------------------------------------------
# PART 2. Make a real APK with PWABuilder (only on your phone)
1. In Chrome open pwabuilder.com.
2. Paste your link  https://yourusername.github.io/  and tap Start. Wait for the report (manifest, service worker and security should all be green).
3. Tap Package for stores, then Android.
4. Fill in:
   - App name: Investo Kings
   - Package ID: com.investokings.app  (lowercase, no spaces; you cannot change it later if you publish)
   - App version: 1.0.0  and version code: 1
   - Host: yourusername.github.io
   - Start URL: /index.html
   - Display mode: Standalone, orientation Portrait
   - Signing key: choose "New" (PWABuilder creates one for you)
5. Tap Generate (or Download). Wait, then download the zip.
6. In Files extract that zip. Keep the whole zip safe. It contains your signing key. Without it you cannot update the app later.
7. Inside you will find a file ending in .apk. Tap it.
8. If Android asks, allow your Files app to Install unknown apps, then tap Install. If Play Protect warns, tap Install anyway (it is your own test build).
9. Open Investo Kings from your app drawer.

## Step 7. Remove the thin address bar at the top (Digital Asset Links)
At first the app may show a small bar with the web address. To remove it:
1. In the extracted PWABuilder zip open the file named assetlinks.json (Files app, open with a text viewer) and copy ALL of its text.
2. In GitHub open your repository, tap Add file, then Create new file.
3. In the name box type  .well-known/assetlinks.json  (typing the slash creates the folder).
4. Paste the copied text, tap Commit changes.
5. Wait two minutes. In Chrome open  https://yourusername.github.io/.well-known/assetlinks.json  and check you can read the text.
6. Uninstall the Investo Kings APK, install it again. The bar should now be gone.

---------------------------------------------------------------------
# PART 3. How to test the app
Everything below is simulated.

Quick start: tap the orange TEST MODE bar at the top, then Load demo account. You get a verified account with R 25,000 virtual funds, a bank account and trade history. Later you can log in with thabo@example.com and Test@1234.

Full sign-up test: Register, enter the code 123456 when asked, accept the agreement, add the ID, face scan and address (use "Use a sample photo (test)" or the real camera), submit. Verification is approved automatically after about 12 seconds.

The orange bar is also your "owner dashboard" for testing:
- Send a trade signal (Gold or Silver, BUY or SELL, window length, risk amount). The client gets the pop-up, countdown and notification.
- Make a running trade hit take profit or stop loss.
- Approve or reject verification, confirm deposits and withdrawals, fail a withdrawal, mark a deposit as not found.
- Show the session expired, account on hold, maintenance and update-required screens.
- Reset all data.

Money rules built in: minimum deposit R500, minimum withdrawal R100, maximum withdrawal R200,000, 30% fee only after the client has placed a trade, no withdrawals while a trade is running, deposits and trading blocked until verified, pending withdrawals can be cancelled.

1Voucher test PINs (16 digits): ending 0500 adds R500, 1000 adds R1,000, 5000 adds R5,000, 0100 is below the minimum, 0000 is already used. Anything else is invalid.

Bank deposits and withdrawals complete by themselves after about 20 seconds (switch this off in the test controls to confirm them yourself).


---------------------------------------------------------------------
# NEW in this version (test build 1.1)
- Slide and fade transitions on every screen and pop-up (280 ms, cubic-bezier 0.4, 0, 0.2, 1).
- Clients choose their own risk amount on the Place trade screen. Minimum R300, maximum their balance. The owner's signal only suggests a risk.
- South African flag next to the client's name on the Dashboard and Profile.
- New AI tab in the bottom menu with a Coming soon screen.
- Dashboard footer: live traders now and floating profit across all clients' live trades. In this test build these numbers are SIMULATED: when you send a signal, a pretend crowd of 40 to 150 clients joins.
- Settings > Display: zoom slider (Small to Big, 85% to 125%) and background choice (World map, Wordmark, Plain).
- Backgrounds: a dark linear gradient on every screen, with a faint grey dotted world map (default) or INVESTO KINGS wordmark pattern.
- Tag line is now "Trade your future" (change it in core.js: tagline).
- Sounds (made inside the app, no files): notification, screen transition, trade placed, trade closed (win and loss versions), wrong PIN, and a separate unique trade alert sound that repeats about every 7 seconds while the alert pop-up is open. Switch them in Settings: "Trade alert sound and vibration" and "App sounds". Sounds start after your first tap on the app (Android rule), and they only play while the app is open. Alerts while the app is closed need a server and a native app notification channel.
- Live trades: logo, title and Running profit stay fixed, only the trades scroll.
- Wallet: the balance box with Deposit and Withdraw is fixed at the top with the Withdrawals/Deposits bar, only the transactions scroll. User details were removed from this screen.
- History: header, totals and filters stay fixed, only the trades scroll.
This version already uses ik-cache-v2 in sw.js, so phones that had the first version will update by themselves. For your next update after this one, change it to ik-cache-v3.

---------------------------------------------------------------------
# Updating the app later
1. Change the files in GitHub (Add file, Upload files, same names replace the old ones).
2. Open sw.js and change ik-cache-v1 to ik-cache-v2 so phones pick up the new version.

# Troubleshooting
- Blank page or 404: the repository name must be exactly yourusername.github.io and Pages must be turned on (Step 5).
- Old version still showing: close the app, or in Chrome tap the lock icon, Site settings, Clear data.
- No notifications: allow notifications for the app in Android Settings. Alerts while the app is fully closed need a server, which this test build does not have.
- Camera does not open: allow Camera for Chrome (or the app) in Android Settings.
- PWABuilder asks for icons or screenshots: they are already in this folder and listed in the manifest.

# What this build is NOT
No real accounts, money, bank, 1Voucher, ID check or trading platform is connected. Data lives only on your phone. Before a real launch you need a backend, a KYC provider, payment handling, your trading platform link, and a compliance review.
