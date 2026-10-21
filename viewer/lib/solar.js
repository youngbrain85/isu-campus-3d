// 태양 위치 계산 (SunCalc, BSD-2-Clause, Vladimir Agafonkin 의 공식을 옮김: https://github.com/mourner/suncalc)
// 반환: 고도 elev (도, 지평선 위 +), 방위 az (도, 나침반: 0 = 북, 90 = 동, 180 = 남)
const RAD = Math.PI / 180, DAY_MS = 864e5, J1970 = 2440588, J2000 = 2451545, E = RAD * 23.4397;
const toDays = d => d.valueOf() / DAY_MS - 0.5 + J1970 - J2000;
const meanAnomaly = d => RAD * (357.5291 + 0.98560028 * d);
function eclipticLongitude(M) {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)), P = RAD * 102.9372;
  return M + C + P + Math.PI;
}
const declination = l => Math.asin(Math.sin(E) * Math.sin(l));
const rightAscension = l => Math.atan2(Math.sin(l) * Math.cos(E), Math.cos(l));
const siderealTime = (d, lw) => RAD * (280.16 + 360.9856235 * d) - lw;

export function sunPosition(date, lat, lon) {
  const lw = RAD * -lon, phi = RAD * lat, d = toDays(date);
  const L = eclipticLongitude(meanAnomaly(d)), dec = declination(L), ra = rightAscension(L);
  const H = siderealTime(d, lw) - ra;
  const alt = Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  const azS = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));   // 남쪽 기준, 서쪽 +
  return { elev: alt / RAD, az: ((azS / RAD + 180) % 360 + 360) % 360 };
}

/** 'YYYY-MM-DD', 시각(소수 시간, 현지) → Date. 현지 = Terre Haute (America/Indiana/Indianapolis, 미 동부 시간·서머타임) */
export function localToDate(ymd, hours, tz = 'America/Indiana/Indianapolis') {
  const [y, m, dd] = ymd.split('-').map(Number), h = Math.floor(hours), mi = Math.round((hours - h) * 60);
  const guess = Date.UTC(y, m - 1, dd, h, mi);            // 현지 시각을 UTC 로 가정한 뒤 오프셋 보정
  const off = tzOffsetMin(new Date(guess), tz);
  return new Date(guess - off * 60000);
}
function tzOffsetMin(date, tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    .formatToParts(date).map(x => [x.type, x.value]));
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
  return Math.round((asUTC - date.valueOf()) / 60000);
}
