# Connect your phone and PC (online database)

This lets the Admin (on a PC or a phone) and the Client app (on another device) work together. It uses Google Firebase, which is free for this size of test. All data is still SIMULATION.

## Part 1: Create the database (once, about 5 minutes, works on a phone browser)
1. Go to console.firebase.google.com and sign in with a Google account.
2. Tap Create a project. Name it investo-kings-test. Turn Google Analytics OFF. Create.
3. In the menu choose Build > Realtime Database > Create Database.
4. Pick the location Belgium (europe-west1), the closest to South Africa. Start in Locked mode.
5. Open the Rules tab. Delete everything and paste this, then tap Publish:

{
  "rules": {
    ".read": false,
    ".write": false,
    "$room": {
      ".read": "$room.matches(/^ik_[a-z0-9]{10,40}$/)",
      ".write": "$room.matches(/^ik_[a-z0-9]{10,40}$/)"
    }
  }
}

6. Open the Data tab. Copy the address shown at the top. It looks like  https://investo-kings-test-default-rtdb.europe-west1.firebasedatabase.app

## Part 2: Connect each device (same address and same room code everywhere)
- Admin: open admin.html, sign in, go to AI Trading > Settings, scroll to Online database. Paste the address. The room code is already filled in (a long random code). Write it down. Tap Connect.
- Client: open the app, tap the orange TEST MODE bar, then Online database. Paste the same address and the same room code. Tap Connect.
- Shortcut: open this link once on each device and it connects by itself:
  https://yourusername.github.io/admin.html?db=ADDRESS&room=ROOMCODE
  https://yourusername.github.io/index.html?db=ADDRESS&room=ROOMCODE

## How it works
- The Admin device runs the AI engine and publishes it. The Client reads it and sends commands (register, start, stop).
- Only one Admin screen runs the engine at a time. Opening the Admin on a second device shows "Another device is running the AI engine". Tap Take over to move it. The first device stops.
- Keep the Admin page open while testing. If it closes, the client shows "AI engine offline".

## Important
- The room code is the only protection. Anyone who has the address and room code can read and change the test data. Never put real customer data in it. A real launch needs proper sign-in, rules per user, and a server.
- Firebase's free plan allows about 10 GB of downloads a month. Test sessions use a small fraction of that. The app polls once a second.
- I tested this against a stand-in copy of the Firebase interface, not Google's live service. If the Connect step shows an error, tell me the exact message.
