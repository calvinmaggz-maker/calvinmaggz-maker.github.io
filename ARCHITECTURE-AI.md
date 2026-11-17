# INVESTO KINGS AI Trading: architecture for the live version

Everything in this test build is SIMULATION with virtual funds. The screens and the messages between the parts are designed so the simulated pieces can be swapped for real ones later without redesigning the interface.

## The chain

MASTER EA  ->  SIGNAL SERVER  ->  MULTI-ACCOUNT EXECUTION ENGINE  ->  INDIVIDUAL CUSTOMER ACCOUNTS

| Part | In the test build (ai-engine.js) | In the live version |
|---|---|---|
| Master EA | `masterEA()` creates scalp signals from a simulated price feed | Your MT5 EA sends signals to the server over an authenticated connection |
| Signal server | the shared store (`ik_ai_state_v1`) | A server and database that the admin app and client app both talk to |
| Execution engine | `executeSignal()` sizes and opens positions per account | A service that places orders on each customer's own broker account |
| Customer accounts | virtual accounts A to D plus the app user | Authorised broker connections, one per customer |
| Guardian | checks the master heartbeat, then closes everything | An independent process (server watchdog and a protective EA on each account) |
| Broker closes | mock close with retries and failure tests | Real order close with confirmation from the broker |

## What must stay the same (the contracts)

**Signal** `{ id, sym, side, entry, sl, tp, at, expireAt, scalp }`
**Commands from the client app** `register`, `start {instruments, lot, perScalp, target}`, `stop`, `release`
**Account state** `balance, equity, margin, free, positions[], status, run{startBalance,target,trades[],scalps,wins,losses,pnl}`
**Statuses** IDLE, RUNNING, STOPPING, STOPPED, TARGET_REACHED, RISK_STOPPED, ENDED, NOT_ELIGIBLE
**Session states** SCHEDULED, ACTIVE, ENDING, ENDED
**Notice** `{ id, to ('all' or account), type, title, body, ts }`
**Report** one per ended session: counts, win rate, targets, P/L, positions left open, per customer and per instrument.

## Swap points

1. **Store adapter.** `IKAI.read()`, `IKAI.cmd()` and the engine's `save()` are the only places that touch storage. Replace them with calls to the server (for example Firebase, Supabase or your own API) and the client and admin screens do not change.
2. **Execution adapter.** `realize()` and `processCloses()` are the mock broker. Replace them with a broker call that returns "confirmed" or "failed", and keep the retry and escalation logic.
3. **Clock.** The test clock can run faster. In production the server clock is the only clock, and countdowns are measured from it.
4. **Price feed.** `movePrices()` is simulated. In production use the broker feed, and apply the same bid and ask spread rules.

## Safety rules to keep in production

- Every position carries a stop loss at the broker.
- Every close is verified. 3 retries, then alert the admin and show "our team has been alerted" to the client.
- A customer's STOP only touches that customer. The admin's terminate or the session expiry closes everyone.
- No new entries in the last minutes of a session. No restart after a stop, a target, or expiry.
- Weekend: only BTCUSD. Other instruments are closed before the market shuts.
- Withdrawals and deposits are paused while a customer's AI run is active.
- Reports contain recorded executions only. Never invented figures.

## Security and compliance to add before going live

- Admin sign-in with real accounts, 2FA and roles, and an audit log of every admin action.
- Broker credentials stored in a secrets vault, never in the apps.
- Customer AI agreement stored with date and version.
- Your FSP licence must cover automated trading on customer accounts. Have your compliance officer or an attorney confirm the wording, the fee rules, and how customer money is held.
