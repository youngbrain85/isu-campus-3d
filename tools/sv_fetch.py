#!/usr/bin/env python3
"""Google Maps 파노라마 URL(브라우저에서 얻은 location.href)에서 썸네일 이미지를 여러 방위로 내려받는다 (모델링 참고 사진용).

입력: hrefs.txt (줄마다 'VP<i>|<href>'), targets.json (sv_targets.json: 뷰포인트 i 의 건물 id/이름/요청 heading)
출력: scratch/sv/<osm_id 의 숫자>/vp<i>_<yaw>.jpg  (요청 heading -45, 0, +45 도)
"""
import json, re, sys, urllib.parse, urllib.request, time
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("scratch/sv")
targets = json.load(open("scratch/sv_targets.json"))
W, H = 1280, 800
hdr = {"User-Agent": "Mozilla/5.0", "Referer": "https://www.google.com/"}
n_ok = 0
for line in open(root / "hrefs.txt", encoding="utf-8"):
    line = line.strip()
    if "|" not in line: continue
    tag, href = line.split("|", 1)
    i = int(tag[2:]); t = targets[i]
    m = re.search(r"!6s(https?[^!]+)", href)
    if not m: print("no thumb", tag); continue
    thumb = urllib.parse.unquote(m.group(1))
    req_h = t["heading"]
    outdir = root / t["id"].split("/")[1]; outdir.mkdir(parents=True, exist_ok=True)
    for dh in (-45, 0, 45):
        yaw = (req_h + dh) % 360
        if "googleusercontent.com" in thumb:            # 사용자 포토스피어: ya 는 상대값 → 요청값에 dh 더함
            ya0 = float(re.search(r"-ya([\d.]+)", thumb).group(1))
            url = re.sub(r"=w\d+-h\d+-k-no-pi-?[\d.]+-ya[\d.]+-ro0-fo\d+", f"=w{W}-h{H}-k-no-pi0-ya{(ya0 + dh) % 360:.1f}-ro0-fo90", thumb)
        else:                                            # 공식 파노라마: yaw 절대값
            url = re.sub(r"w=\d+&h=\d+", f"w={W}&h={H}", thumb)
            url = re.sub(r"yaw=[\d.]+", f"yaw={yaw}", url); url = re.sub(r"pitch=-?[\d.]+", "pitch=0", url)
        out = outdir / f"vp{i}_{yaw:03d}.jpg"
        if out.exists():
            n_ok += 1; continue
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers=hdr), timeout=30).read()
            if len(data) > 20000: out.write_bytes(data); n_ok += 1; print(t["name"][:30], out.name, len(data))
            else: print("small", t["name"][:30], yaw, len(data))
        except Exception as e:
            print("fail", t["name"][:30], yaw, e)
        time.sleep(0.3)
print("saved", n_ok)
