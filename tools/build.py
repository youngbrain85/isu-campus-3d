#!/usr/bin/env python3
"""index_template.html → viewer/index.html (CDN), index_local.html (node_modules), index_artifact.html (본문만)."""
import os, re
S = os.path.dirname(os.path.abspath(__file__))
V = os.path.join(S, '..', 'viewer')
t = open(os.path.join(S, 'index_template.html'), encoding='utf-8').read()
CDN = 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js'
CDN_ADD = 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/'
N8AO_CDN = 'https://cdn.jsdelivr.net/npm/n8ao@2.0.1/dist/N8AO.js'
PP_CDN = 'https://cdn.jsdelivr.net/npm/postprocessing@6.36.4/build/index.js'
cdn = t.replace('__THREE__', CDN).replace('__ADDONS__', CDN_ADD).replace('__N8AO__', N8AO_CDN).replace('__PP__', PP_CDN).replace('__APP__', 'app.js')
open(os.path.join(V, 'index.html'), 'w', encoding='utf-8').write(cdn)
loc = (t.replace('__THREE__', '../node_modules/three/build/three.module.js').replace('__ADDONS__', '../node_modules/three/examples/jsm/')
       .replace('__N8AO__', '../node_modules/n8ao/dist/N8AO.js').replace('__PP__', '../node_modules/postprocessing/build/index.js').replace('__APP__', 'app.js'))
open(os.path.join(V, 'index_local.html'), 'w', encoding='utf-8').write(loc)
head = re.search(r'(<title>.*?</script>\s*)</head>', cdn, re.S).group(1)
body = re.search(r'<body>(.*?)</body>', cdn, re.S).group(1)
body = re.sub(r'\s*<button id="btnExport">.*?</button>', '', body, flags=re.S)
open(os.path.join(V, 'index_artifact.html'), 'w', encoding='utf-8').write(head + body)
print('built viewer/index.html, index_local.html, index_artifact.html')
