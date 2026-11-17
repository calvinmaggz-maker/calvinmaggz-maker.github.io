"""Step 1 of the Android build: collect the web files and write the Capacitor settings.
Usage: python3 mobile-assets/prepare_web.py admin|client   (run from the repository root)"""
import sys, os, glob, json, shutil
app = sys.argv[1] if len(sys.argv) > 1 else 'admin'
CFG = {
  'admin':  {'id': 'com.investokings.adminapp',  'name': 'IK Admin',      'entry': 'admin.html', 'color': '#070708'},
  'client': {'id': 'com.investokings.clientapp', 'name': 'Investo Kings', 'entry': 'index.html', 'color': '#0b0b0b'},
}[app]
www = 'mobile/www'
shutil.rmtree('mobile', ignore_errors=True)
os.makedirs(www)
skip = {'electron-main.js', 'package.json', 'package-lock.json'}
n = 0
for pat in ('*.html', '*.css', '*.js', '*.png', '*.webmanifest'):
    for f in glob.glob(pat):
        if f in skip:
            continue
        shutil.copy(f, os.path.join(www, f)); n += 1
if CFG['entry'] != 'index.html':
    shutil.copy(CFG['entry'], os.path.join(www, 'index.html'))   # the app opens index.html
if not os.path.exists(os.path.join(www, 'index.html')):
    sys.exit('ERROR: no index.html found. Upload all the app files to the main folder of the repository.')
json.dump({
  'appId': CFG['id'], 'appName': CFG['name'], 'webDir': 'www', 'backgroundColor': CFG['color'],
  'server': {'androidScheme': 'https'},
  'android': {'allowMixedContent': False}
}, open('mobile/capacitor.config.json', 'w'), indent=2)
json.dump({
  'name': 'investo-kings-' + app, 'version': '1.0.0', 'private': True,
  'dependencies': {'@capacitor/android': '^6.2.0', '@capacitor/cli': '^6.2.0', '@capacitor/core': '^6.2.0'}
}, open('mobile/package.json', 'w'), indent=2)
print('Prepared %s app: %d web files, id %s' % (app, n, CFG['id']))
