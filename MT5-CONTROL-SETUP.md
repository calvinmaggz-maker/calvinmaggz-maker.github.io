# Remote control of your EA (demo account only)

The app does not trade. Your existing EA stays the trading engine and keeps its own entry, lot size, stop loss and take profit rules. Two small files connect it to the app:

- **IK_Bridge.mq5** runs on one chart. It reports the account to the admin, receives signed commands, and closes positions when told to.
- **IK_Gate.mqh** is an include file. Your EA asks it one question before each new trade: "may I open a BUY or a SELL right now?"

## 1. Install
1. Copy `IK_Gate.mqh` into the MT5 folder `MQL5\Include` (File, Open Data Folder).
2. Copy `IK_Bridge.mq5` into `MQL5\Experts`. Open it in MetaEditor (F4) and press F7. The panel should say 0 errors. If not, send me a screenshot of the errors.
3. This replaces the older read-only IK_Bridge_Reader. Remove that one from the chart first.

## 2. Your EA: Velocity_MeanReversion_XAUUSD
I have already added the gate to a copy of your EA: `Velocity_MeanReversion_XAUUSD_IK.mq5`. Use that file instead of the original. Compare the two files and you will see only added lines, nothing removed.

What was added:
- `#include <IK_Gate.mqh>` and a new input `UseIKGate` (default true).
- `IK_Tick()` at the start of OnTick, so the admin can see the EA is on this chart.
- A check before the SELL branch and the BUY branch of your entry logic, and a last check inside `OpenTrade`. If the admin has not activated that direction for this symbol, no order is sent.

Your entry rule, lot sizing, take profit, panel and auto-stop are unchanged.

How it behaves:
- Keep `TradeDirection = Hedge` and let the admin choose the direction. BUY MODE means only BUY signals can trade. SELL MODE means only SELL signals. The opposite signal is simply skipped.
- If you set `TradeDirection` to Buys only and the admin selects SELL MODE, nothing trades, because both filters apply.
- `UseIKGate = false` runs the EA on its own exactly as before, with no admin control.
- Set `ManagedMagics = 778001` in the bridge (already the default) so STOP and CLOSE ALL close only your EA's trades.
- Your panel's Stop button and AutoStopOnTarget still work. If the EA stopped itself at its target, press Start on the panel again before the admin activates a new mode.

### For any other EA, the lines to add are:

## 2b. Add two lines to your EA
At the top of your EA:

    #include <IK_Gate.mqh>

Right before your EA opens a new BUY, and before a new SELL (the gate uses the chart's own symbol automatically):

    if(!IK_AllowBuy())  return;     // before opening a BUY
    if(!IK_AllowSell()) return;     // before opening a SELL

Three small additions in total. Nothing else in your EA changes. If you send me your EA file, I will add these lines in the right places for you and check that nothing else is touched.

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

Add the database address under Tools, Options, Expert Advisors, Allow WebRequest, as before.

## 3b. Which charts? (important)
MT5 allows only ONE EA per chart. If you drop the bridge on a chart that already has your EA, your EA is removed. So:

- **Open an extra chart just for the bridge.** Any symbol, any timeframe (for example EURUSD M1). Attach IK_Bridge there. Leave it open all the time.
- **Your trading EA stays on its own chart(s).** Attach it to the Gold chart for Gold, to the Silver chart for Silver, and so on, exactly as you do today. One chart per symbol.
- Both run in the same MT5 terminal. They talk to each other through MT5 global variables, so nothing else is needed.

SymbolList in the bridge settings must contain EVERY symbol your EA runs on (without the suffix). The default is XAUUSD,XAGUSD,GBPUSD,EURUSD,BTCUSD. A symbol that is not in the list is never allowed to trade. The same list is used to report live prices to the app.

## 3c. Choosing instruments
On the admin control page, tick the instruments the EA may trade before pressing ACTIVATE. The choice is sent inside the signed command. Each chart is checked by its own symbol, so you can run Gold and Silver and leave GBPUSD off. An instrument you tick but have no EA on shows NO EA SEEN. Nothing trades on it until you attach the EA to that chart.

To let the admin see which charts have your EA, add one line at the start of OnTick in your EA: `IK_Tick();`

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

## 7. Live prices in the app and admin
- The admin control page lists every instrument with bid, ask, spread and a label: MT5 LIVE (from your MT5 account) or SIMULATED.
- The client app shows the same prices on the AI screen, and the Gold and Silver boxes on the home screen follow them.
- If MT5 does not have a symbol, that row falls back to the simulated price and says so.
- Clients still trade in simulation. The prices they see are live, but their trades are not sent to MT5 until multi-client execution is authorised.
