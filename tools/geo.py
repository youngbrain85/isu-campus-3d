#!/usr/bin/env python3
"""위경도 ↔ 로컬 평면(피트) 변환과 Web-Mercator 타일 픽셀 계산. 원점은 캠퍼스 중심."""
import json, math

ORIGIN = (39.4710, -87.4100)          # (lat, lon)
FT_PER_M = 3.28083989501312
M_PER_DEG_LAT = 110540.0
M_PER_DEG_LON = 111320.0 * math.cos(math.radians(ORIGIN[0]))


def ll_to_xz(lat, lon):
    """(lat, lon) → (x east ft, z south ft)"""
    x = (lon - ORIGIN[1]) * M_PER_DEG_LON * FT_PER_M
    z = -(lat - ORIGIN[0]) * M_PER_DEG_LAT * FT_PER_M
    return (x, z)


def xz_to_ll(x, z):
    lon = ORIGIN[1] + x / FT_PER_M / M_PER_DEG_LON
    lat = ORIGIN[0] - z / FT_PER_M / M_PER_DEG_LAT
    return (lat, lon)


def merc_px(lat, lon, zoom):
    """전역 Web-Mercator 픽셀 좌표 (256px 타일 기준)"""
    n = 2 ** zoom * 256
    px = (lon + 180.0) / 360.0 * n
    py = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return (px, py)


def merc_px_to_ll(px, py, zoom):
    n = 2 ** zoom * 256
    lon = px / n * 360.0 - 180.0
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * py / n))))
    return (lat, lon)


class MosaicBounds:
    """collect_isu_data.py 가 저장한 bounds JSON 으로 모자이크 픽셀 위치를 계산"""

    def __init__(self, path):
        b = json.load(open(path))
        self.zoom = b["zoom"]; self.w = b["width_px"]; self.h = b["height_px"]
        self.x0, self.y0 = merc_px(b["north"], b["west"], self.zoom)
        self.x1, self.y1 = merc_px(b["south"], b["east"], self.zoom)
        self.north, self.south, self.west, self.east = b["north"], b["south"], b["west"], b["east"]

    def px_of(self, lat, lon):
        px, py = merc_px(lat, lon, self.zoom)
        return ((px - self.x0) / (self.x1 - self.x0) * self.w, (py - self.y0) / (self.y1 - self.y0) * self.h)

    def ll_of(self, col, row):
        """모자이크 픽셀 → (lat, lon)"""
        px = self.x0 + col / self.w * (self.x1 - self.x0)
        py = self.y0 + row / self.h * (self.y1 - self.y0)
        return merc_px_to_ll(px, py, self.zoom)
