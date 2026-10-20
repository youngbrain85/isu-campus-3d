#!/usr/bin/env python3
"""index_template.html → viewer/index.html (CDN), index_local.html (node_modules), index_artifact.html (본문만)."""
import os, re
S = os.path.dirname(os.path.abspath(__file__))
V = os.path.join(S, '..', 'viewer')
t = open(os.path.join(S, 'index_template.html'), encoding='utf-8').read()
CDN = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js'
CDN_ADD = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/'
cdn = t.replace('__THREE__', CDN).replace('__ADDONS__', CDN_ADD).replace('__APP__', 'app.js')
open(os.path.join(V, 'index.html'), 'w', encoding='utf-8').write(cdn)
loc = t.replace('__THREE__', '../node_modules/three/build/three.module.js').replace('__ADDONS__', '../node_modules/three/examples/jsm/').replace('__APP__', 'app.js')
open(os.path.join(V, 'index_local.html'), 'w', encoding='utf-8').write(loc)
head = re.search(r'(<title>.*?</script>\s*)</head>', cdn, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', cdn, re.S).group(1)
body = re.sub(r'\s*<button id="btnExport">.*?</button>', '', body, flags=re.S)
open(os.path.join(V, 'index_artifact.html'), 'w', encoding='utf-8').write(head + body)
print('built viewer/index.html, index_local.html, index_artifact.html')
