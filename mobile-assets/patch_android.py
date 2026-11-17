"""Step 3 of the Android build: icons, splash, status bar, orientation, permissions and version.
Usage: python3 mobile-assets/patch_android.py admin|client RUN_NUMBER   (run from the repository root)"""
import sys, os, re, glob, shutil
app = sys.argv[1] if len(sys.argv) > 1 else 'admin'
run = sys.argv[2] if len(sys.argv) > 2 else '1'
A = 'mobile/android/app/src/main'
R = A + '/res'
SRC = 'mobile-assets/android-res/' + app
bg = open(SRC + '/colors.txt').read().strip()
bar = '#070708' if app == 'admin' else '#0b0b0b'
done, warn = [], []

def rd(p):
    return open(p, encoding='utf-8').read()
def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True); open(p, 'w', encoding='utf-8').write(s)

# 1. icons and splash logo
shutil.copytree(SRC, R, dirs_exist_ok=True, ignore=shutil.ignore_patterns('colors.txt'))
wr(R + '/values/ic_launcher_background.xml', '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % bg)
done.append('icons')

# 2. splash screen: remove the default pictures, use a dark screen with the crown
for f in glob.glob(R + '/drawable*/splash.png'):
    os.remove(f)
wr(R + '/drawable/splash.xml', '''<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item><shape android:shape="rectangle"><solid android:color="%s"/></shape></item>
    <item android:gravity="center"><bitmap android:gravity="center" android:src="@drawable/splash_logo"/></item>
</layer-list>
''' % bar)
done.append('splash')

# 3. status bar and navigation bar colours
sp = R + '/values/styles.xml'
if os.path.exists(sp):
    s = rd(sp)
    m = re.search(r'(<style name="AppTheme\.NoActionBar"[^>]*>)(.*?)(</style>)', s, re.S)
    if m and 'statusBarColor' not in m.group(2):
        s = s[:m.end(2)] + '\n        <item name="android:statusBarColor">%s</item>\n        <item name="android:navigationBarColor">%s</item>\n    ' % (bar, bar) + s[m.end(2):]
        wr(sp, s); done.append('bars')
    else:
        warn.append('styles.xml: AppTheme.NoActionBar not found (bar colours skipped)')
else:
    warn.append('styles.xml not found')

# 4. manifest: portrait only, camera for the client app
mp = A + '/AndroidManifest.xml'
s = rd(mp)
if 'screenOrientation' in s:
    done.append('portrait (already set)')
elif 'android:name=".MainActivity"' in s:
    s = s.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:screenOrientation="portrait"', 1); done.append('portrait')
else:
    warn.append('manifest: MainActivity not found (portrait skipped)')
if app == 'client' and 'android.permission.CAMERA' not in s:
    s = s.replace('</manifest>', '    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />\n</manifest>', 1); done.append('camera')
wr(mp, s)

# 5. version
for gp in (A + '/../../build.gradle',):
    if os.path.exists(gp):
        g = rd(gp)
        g2 = re.sub(r'versionCode\s+\d+', 'versionCode %s' % run, g)
        g2 = re.sub(r'versionName\s+"[^"]*"', 'versionName "1.0.%s"' % run, g2)
        wr(gp, g2); done.append('version 1.0.' + run)
    else:
        warn.append('app/build.gradle not found (version skipped)')
print('Patched Android project:', ', '.join(done))
for w in warn:
    print('WARNING:', w)
