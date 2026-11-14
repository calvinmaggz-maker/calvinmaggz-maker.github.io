# Remote control of your EA (demo account only)

The app does not trade. Your existing EA stays the trading engine and keeps its own entry, lot size, stop loss and take profit rules. Two small files connect it to the app:

- **IK_Bridge.mq5** runs on one chart. It reports the account to the admin, receives signed commands, and closes positions when told to.
- **IK_Gate.mqh** is an include file. Your EA asks it one question before each new trade: "may I open a BUY or a SELL right now?"

## 1. Install
1. Copy `IK_Gate.mqh` into the MT5 folder `MQL5\Include` (File, Open Data Folder).
2. Copy `IK_Bridge.mq5` into `MQL5\Experts`. Open it in MetaEditor (F4) and press F7. The panel should say 0 errors. If not, send me a screenshot of the errors.
3. This replaces the older read-only IK_Bridge_Reader. Remove that one from the chart first.

## 2. Add two lines to your EA
At the top of your EA:

    #include <IK_Gate.mqh>

Right before your EA opens a new BUY, and before a new SELL:

    if(!IK_AllowBuy())  return;     // before opening a BUY
    if(!IK_AllowSell()) return;     // before opening a SELL

Nothing else in your EA changes. If you send me your EA file, I will add these lines in the right places for you and check that nothing else is touched.

With no active mode the gate says no, so your EA cannot open trades until you activate BUY or SELL MODE in the admin.

## 3. Settings in IK_Bridge (Inputs tab)
- DbUrl and Room: the same as in the admin.
- ControlKey: a secret you choose, at least 12 characters. Enter the same key in the admin on the MT5 Broker page, then Save key.
- SymbolSuffix: for example m on Exness Standard.
- ManagedMagics: the magic number of your EA. Use 0 to manage every position on the account.
- FailSafeSeconds (60): if the bridge cannot reach the database for this long, your EA is blocked from NEW entries. Existing positions keep their own stop loss and take profit.
- CloseOnStop (true): STOP AI TRADING also closes the managed positions.
- CloseOnLongOutage (false): optional. Closes managed positions after a long outage (LongOutageSeconds).
- AllowRealAccount stays false. The bridge refuses to run on a real account.

Attach IK_Bridge to one chart and make sure Algo Trading is switched on (green button). Add the database address under Tools, Options, Expert Advisors, Allow WebRequest, as before.

## 4. How a command travels
Admin button, then a signed command in the database, then the EA picks it up (every 2 seconds), checks the signature and age, acknowledges, executes, and reports back. The admin shows each step: PENDING, SENT, RECEIVED, EXECUTED or FAILED. Nothing is called active until the EA says EXECUTED. A command that was already executed is never executed again.

## 5. Safety behaviour
- Starting or restarting the bridge turns trading OFF. You must activate a mode again.
- BUY MODE is refused while SELL positions are open, and the other way round. You cannot hedge.
- EMERGENCY STOP disables entries first, then closes everything with extra retries.

## 6. Test checklist (demo account)
Use the Control target "MT5 demo EA" on the admin control page.
1. ACTIVATE BUY: the EA should open only BUY trades.
2. STOP AI: new entries stop and positions close.
3. ACTIVATE SELL: only SELL trades.
4. CLOSE ALL.
5. EMERGENCY STOP: entries stay off.
6. Close MT5: the admin shows DISCONNECTED and commands are not sent.
7. Open MT5 again: the connection returns and nothing is repeated.
8. Use "Send last command again" on the Test Lab page: the EA must ignore it.

Tell me what you see at each step.
