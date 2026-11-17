# Investo Kings: manual activation and MT5 remote control

## Parts
- Admin panel: AI Trading Control page. Chooses BUY or SELL MODE and issues commands.
- Backend (test): Firebase Realtime Database, plus the engine that runs inside the admin page.
- MT5: IK_Bridge.mq5 (control and reporting) and IK_Gate.mqh (entry gate in your EA).
- Client app: shows the confirmed status, never a button press.

## Command flow
1. Admin issues a command: unique ID, timestamp, administrator name, status PENDING.
2. The command is signed (SHA-256 of key, id, type, time and admin name) and written to `mt5cmd/current`. Status SENT.
3. The EA polls, verifies the signature (and that the command is under 10 minutes old), writes RECEIVED.
4. The EA executes and writes EXECUTED or FAILED with an error message.
5. Only on EXECUTED does the engine activate or stop the mode, notify clients and update dashboards.

Commands: ACTIVATE_BUY, ACTIVATE_SELL, STOP_AI, CLOSE_ALL, EMERGENCY_STOP, GET_STATUS.
One command at a time. EMERGENCY_STOP may replace a command in progress. Every command is kept in the audit log.

## Direction protection
- One global direction. A mode cannot be switched directly: STOP, wait until positions are closed, then activate the other direction.
- The EA refuses BUY MODE while SELL positions exist (and the reverse).
- The gate returns false for the opposite direction, so your EA cannot open it.
- In the simulation the engine blocks opposite entries the same way.

## Connection failure
- No heartbeat for 12 seconds: the admin shows DISCONNECTED and does not send or report commands.
- The EA keeps local safety: no new entries after FailSafeSeconds without contact, optional close after a long outage. Positions keep their own SL and TP.
- Command IDs are stored in MT5 global variables, so a reconnect or a repeated command never executes twice.

## Data sources
The admin shows two separate cards. "Simulated client trading" comes from the app's simulation. "MT5 demo account (actual)" comes only from the EA. Old EA data is hidden when the EA is silent.

## Limits of this test build
- Live multi-client execution is not built. Clients trade in simulation while the EA trades your demo account.
- Notifications appear inside the app and as phone notifications while the app is open. True background push needs a push service (Firebase Cloud Messaging) and a server. That is a later stage.
- Security is a shared key and a room code. A real launch needs real admin sign-in, per-user database rules and a secure server.
- Nothing here has been tested on a live MT5 yet. It was tested against a stand-in that follows the same rules.
