# Connect your Exness MT5 demo account (step 1, read-only)

The MT5 program `IK_Bridge_Reader.mq5` reads your DEMO account and shows it on the admin page "MT5 Broker". It places no trades and cannot change anything. It refuses to run on a real account.

You need: the online database already connected (see SETUP-ONLINE-DATABASE.md), MT5 on your PC, and the admin page open.

## 1. Open an Exness demo account
1. Sign in at exness.com, go to your Personal Area, then My Accounts, then Open New Account, then Demo.
2. Choose MT5 and an account type (Standard, Pro, Raw Spread or Zero). Pick the type you plan to use for the real EA later.
3. Note the login, password and server name (for example Exness-MT5Trial).

## 2. Log in to MT5 on your PC
1. Open MT5 and choose File, then Login to Trade Account. Enter the demo login, password and server.
2. Open Market Watch (Ctrl+M). Right-click it and choose Symbols. Search for XAUUSD and see how Gold is written. Whatever comes after XAUUSD is your suffix. On Exness Standard it is usually m (XAUUSDm). Pro accounts often have no suffix. Please check it yourself, because it differs by account type.

## 3. Install the program
1. In MT5 choose File, then Open Data Folder. Open MQL5, then Experts. Copy `IK_Bridge_Reader.mq5` into that folder.
2. In MT5 press F4 to open MetaEditor. Open IK_Bridge_Reader.mq5 and press F7 to compile. The bottom panel should say 0 errors.
   If you see errors, take a screenshot and send it to me. I could not compile MQL5 myself, so this step needs your help.
3. Back in MT5, right-click Expert Advisors in the Navigator (Ctrl+N) and choose Refresh.

## 4. Allow the database address
1. Tools, then Options, then Expert Advisors.
2. Tick "Allow WebRequest for listed URL".
3. Add your database address, for example  https://yourproject-default-rtdb.europe-west1.firebasedatabase.app  (the same address you use in the admin, with nothing after .app).
4. Tap OK.

## 5. Start it
1. Open an extra chart for the bridge, for example XAUUSDm. If your own EA is already on a chart, do not use that chart, because MT5 allows only one EA per chart.
2. Drag IK_Bridge_Reader from the Navigator onto the chart.
3. In the Inputs tab set:
   - DbUrl: your database address
   - Room: your room code (same as the admin)
   - SymbolSuffix: the suffix from step 2 (m, or leave empty)
4. Tap OK. A smiling face should appear in the top right corner of the chart. The chart shows "Status: OK".

## 6. Check the admin
Open the admin, then MT5 Broker on the left. You should see MT5 ONLINE, DEMO, your balance, the four symbols marked FOUND, and any open positions.

## If something is wrong
- Status says "Add the database address...": repeat step 4 exactly, then remove and re-attach the EA.
- Status says "Database replied 401": the database rules are not published (see SETUP-ONLINE-DATABASE.md).
- Admin says Waiting for MT5: the Room code differs, or the admin is not connected to the database.
- A symbol shows NOT FOUND: change SymbolSuffix, then remove and re-attach the EA.
- EA refuses to start: you are logged in to a real account. Log in to the demo.

## What to watch while it runs
Leave it running for a few days. Look at: how steady the connection is, the spread and connection delay at busy times (news, market open), and whether prices match the simulation. Send me what you see before we build step 2, which sends trade commands from the AI engine to this demo account.
