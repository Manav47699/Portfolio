// Physics + control simulation of a differential-drive line follower.
// Units are metres / seconds. Pure TS, no rendering: the 3D scene and HUD read from it.

export type Vec2 = { x: number; z: number };

export type Gains = { kp: number; ki: number; kd: number; speed: number };

export const ROBOT = {
  wheelBase: 0.125, // distance between wheels
  wheelRadius: 0.0215,
  sensorAhead: 0.07, // sensor bar distance in front of the axle
  sensorCount: 5,
  sensorPitch: 0.016, // spacing between IR sensors
  motorTau: 0.07, // first-order motor + chassis lag (s): makes high Kp oscillate like real hardware
  controlHz: 100, // the microcontroller's loop rate (sample-and-hold)
  sensorDelay: 0.005, // ADC + processing latency (s)
  maxSpeed: 1.25, // m/s at full PWM
};

export const LINE_WIDTH = 0.019; // standard 19 mm electrical tape

// Closed circuit control points (m): straights, sweepers, a chicane and a hairpin.
export const CONTROL: Vec2[] = [
  { x: -1.6, z: 0.0 },
  { x: -1.45, z: -0.7 },
  { x: -0.85, z: -1.0 },
  { x: -0.2, z: -0.88 },
  { x: 0.2, z: -0.55 },
  { x: 0.65, z: -0.9 },
  { x: 1.3, z: -0.95 },
  { x: 1.7, z: -0.45 },
  { x: 1.6, z: 0.2 },
  { x: 1.1, z: 0.45 },
  { x: 0.75, z: 0.8 },
  { x: 0.25, z: 1.05 },
  { x: -0.3, z: 0.95 },
  { x: -0.6, z: 0.6 },
  { x: -1.15, z: 0.75 },
];

function catmull(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const t2 = t * t, t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), z: f(p0.z, p1.z, p2.z, p3.z) };
}

/** Uniformly resampled closed polyline of the track centre line. */
export function buildTrack(step = 0.006, control: Vec2[] = CONTROL) {
  const dense: Vec2[] = [];
  const n = control.length;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [control[(i - 1 + n) % n], control[i], control[(i + 1) % n], control[(i + 2) % n]];
    for (let s = 0; s < 60; s++) dense.push(catmull(p0, p1, p2, p3, s / 60));
  }
  // arc-length resample
  const pts: Vec2[] = [dense[0]];
  let carry = 0;
  for (let i = 1; i <= dense.length; i++) {
    const a = dense[i - 1], b = dense[i % dense.length];
    let segLen = Math.hypot(b.x - a.x, b.z - a.z);
    let t0 = 0;
    while (carry + segLen >= step) {
      const need = step - carry;
      t0 += need / Math.hypot(b.x - a.x, b.z - a.z);
      pts.push({ x: a.x + (b.x - a.x) * t0, z: a.z + (b.z - a.z) * t0 });
      segLen -= need;
      carry = 0;
    }
    carry += segLen;
  }
  if (Math.hypot(pts[0].x - pts.at(-1)!.x, pts[0].z - pts.at(-1)!.z) < step * 0.5) pts.pop();
  const length = pts.length * step;
  return { pts, step, length };
}

export type Track = ReturnType<typeof buildTrack>;

/** Distance from p to the track near `hint` (windowed search). Returns distance and closest index. */
function nearest(track: Track, p: Vec2, hint: number, window: number) {
  const { pts } = track;
  const n = pts.length;
  let best = Infinity, bestI = hint;
  for (let k = -window; k <= window; k++) {
    const i = (((hint + k) % n) + n) % n;
    const a = pts[i], b = pts[(i + 1) % n];
    const abx = b.x - a.x, abz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.z - a.z) * abz) / (abx * abx + abz * abz)));
    const dx = a.x + abx * t - p.x, dz = a.z + abz * t - p.z;
    const d = dx * dx + dz * dz;
    if (d < best) { best = d; bestI = i; }
  }
  return { d: Math.sqrt(best), i: bestI };
}

export type SimState = {
  x: number; z: number; heading: number;
  vL: number; vR: number; // actual wheel speeds (m/s)
  wheelAngleL: number; wheelAngleR: number;
  sensors: number[]; // 0..1 reflectance (1 = sees black line)
  error: number; // -1..1, + = line is to the right
  output: number; // PID correction
  integral: number; prevError: number; dFilt: number;
  lost: boolean; lostFor: number;
  trackIndex: number; progress: number; // metres along the track this lap
  lapTime: number; lastLap: number | null; bestLap: number | null; laps: number;
  derails: number; derailedFor: number;
  absErrSum: number; absErrN: number; lapAbsErr: number | null;
  time: number;
};

export function createSim(track: Track) {
  const start = 4;
  const a = track.pts[start], b = track.pts[start + 1];
  const state: SimState = {
    x: a.x, z: a.z, heading: Math.atan2(b.z - a.z, b.x - a.x),
    vL: 0, vR: 0, wheelAngleL: 0, wheelAngleR: 0,
    sensors: Array(ROBOT.sensorCount).fill(0),
    error: 0, output: 0, integral: 0, prevError: 0, dFilt: 0,
    lost: false, lostFor: 0,
    trackIndex: start, progress: 0,
    lapTime: 0, lastLap: null, bestLap: null, laps: 0,
    derails: 0, derailedFor: 0,
    absErrSum: 0, absErrN: 0, lapAbsErr: null,
    time: 0,
  };
  let lastGood = { x: a.x, z: a.z, heading: state.heading, i: start };
  let history: { t: number; e: number; lost: boolean }[] = [];
  let controlTimer = 0, cmdL = 0, cmdR = 0;

  function respawn(full = false) {
    const i = full ? start : lastGood.i;
    const p = track.pts[i], q = track.pts[(i + 2) % track.pts.length];
    Object.assign(state, {
      x: p.x, z: p.z, heading: Math.atan2(q.z - p.z, q.x - p.x),
      vL: 0, vR: 0, integral: 0, prevError: 0, dFilt: 0, error: 0, output: 0,
      lost: false, lostFor: 0, derailedFor: 0, trackIndex: i,
    });
    history = [];
    controlTimer = 0; cmdL = 0; cmdR = 0;
    if (full) Object.assign(state, {
      progress: 0, lapTime: 0, lastLap: null, bestLap: null, laps: 0, derails: 0,
      absErrSum: 0, absErrN: 0, lapAbsErr: null, time: 0,
    });
  }

  function step(dt: number, g: Gains) {
    state.time += dt;
    const fx = Math.cos(state.heading), fz = Math.sin(state.heading);
    // right-hand lateral vector (heading rotated -90° in x/z, with +z "down" on screen)
    const rx = -fz, rz = fx;

    // --- Sense --------------------------------------------------------------
    const half = (ROBOT.sensorCount - 1) / 2;
    let sum = 0, wsum = 0;
    const cx = state.x + fx * ROBOT.sensorAhead, cz = state.z + fz * ROBOT.sensorAhead;
    const hintNear = nearest(track, { x: cx, z: cz }, state.trackIndex, 60);
    for (let s = 0; s < ROBOT.sensorCount; s++) {
      const off = (s - half) * ROBOT.sensorPitch;
      const p = { x: cx + rx * off, z: cz + rz * off };
      const { d } = nearest(track, p, hintNear.i, 25);
      const edge = d - LINE_WIDTH / 2;
      let r = edge <= 0 ? 1 : Math.max(0, 1 - edge / 0.007); // IR spot blur ~7mm
      r = Math.min(1, Math.max(0, r + (Math.random() - 0.5) * 0.04));
      state.sensors[s] = r;
      sum += r;
      wsum += r * (s - half);
    }

    // --- Error (weighted sensor position, like readLine() on a QTR array) ----
    let measured: number, lostNow: boolean;
    if (sum > 0.12) {
      measured = wsum / sum / half; // -1..1
      lostNow = false;
    } else {
      lostNow = true;
      measured = state.error >= 0 ? 1 : -1; // remember which side we lost it on
    }
    history.push({ t: state.time, e: measured, lost: lostNow });
    while (history.length > 2 && history[1].t <= state.time - ROBOT.sensorDelay) history.shift();

    // --- Controller: runs at the MCU loop rate on delayed readings -------------
    controlTimer += dt;
    const Tc = 1 / ROBOT.controlHz;
    while (controlTimer >= Tc) {
      controlTimer -= Tc;
      const sample = history[0];
      state.error = sample.e;
      state.lost = sample.lost;
      state.lostFor = sample.lost ? state.lostFor + Tc : 0;
      state.integral = Math.max(-1.5, Math.min(1.5, state.integral + state.error * Tc));
      const rawD = (state.error - state.prevError) / Tc;
      state.dFilt += (rawD - state.dFilt) * 0.6;
      state.prevError = state.error;
      state.output = g.kp * state.error + g.ki * state.integral + g.kd * state.dFilt;
      const clampV = (v: number) => Math.max(-0.35, Math.min(1, v));
      cmdL = clampV(g.speed + state.output) * ROBOT.maxSpeed;
      cmdR = clampV(g.speed - state.output) * ROBOT.maxSpeed;
    }

    // --- Motors (first-order lag towards the held command) ---------------------
    const k = Math.min(1, dt / ROBOT.motorTau);
    state.vL += (cmdL - state.vL) * k;
    state.vR += (cmdR - state.vR) * k;

    // --- Kinematics -----------------------------------------------------------
    const v = (state.vL + state.vR) / 2;
    const w = (state.vL - state.vR) / ROBOT.wheelBase; // + = turn right
    state.heading += w * dt;
    state.x += Math.cos(state.heading) * v * dt;
    state.z += Math.sin(state.heading) * v * dt;
    state.wheelAngleL += (state.vL / ROBOT.wheelRadius) * dt;
    state.wheelAngleR += (state.vR / ROBOT.wheelRadius) * dt;

    // --- Progress / laps / derail ---------------------------------------------
    const body = nearest(track, { x: state.x, z: state.z }, state.trackIndex, 60);
    const n = track.pts.length;
    let di = body.i - state.trackIndex;
    if (di > n / 2) di -= n;
    if (di < -n / 2) di += n;
    state.trackIndex = body.i;
    state.progress += di * track.step;
    state.lapTime += dt;
    state.absErrSum += Math.abs(state.error);
    state.absErrN++;

    if (state.progress >= track.length) {
      state.progress -= track.length;
      state.laps++;
      state.lastLap = state.lapTime;
      if (state.bestLap === null || state.lapTime < state.bestLap) state.bestLap = state.lapTime;
      state.lapAbsErr = state.absErrSum / Math.max(1, state.absErrN);
      state.lapTime = 0;
      state.absErrSum = 0;
      state.absErrN = 0;
    }

    if (body.d < 0.03 && !state.lost) {
      lastGood = { x: state.x, z: state.z, heading: state.heading, i: body.i };
    }
    if (body.d > 0.16 || state.lostFor > 1.2) {
      state.derailedFor += dt;
      if (state.derailedFor > 0.6) {
        state.derails++;
        respawn();
        state.lapTime += 2; // penalty
      }
    } else state.derailedFor = 0;
  }

  /** Knock the robot sideways to show how the controller recovers. */
  function nudge(rad = 0.45) {
    state.heading += Math.random() < 0.5 ? rad : -rad;
  }

  return { state, step, respawn, nudge, track };
}

export const PRESETS: { id: string; label: string; hint: string; gains: Gains }[] = [
  { id: "tuned", label: "Well tuned", hint: "Balanced PD with a pinch of I: hugs the line and stays fast.", gains: { kp: 1.0, ki: 0.02, kd: 0.05, speed: 0.8 } },
  { id: "p-only", label: "P only", hint: "No damping. Every correction overshoots, so the robot snakes down the track.", gains: { kp: 1.4, ki: 0, kd: 0, speed: 0.62 } },
  { id: "lazy", label: "Too gentle", hint: "Kp too low: it can't steer hard enough and flies off the corners.", gains: { kp: 0.15, ki: 0, kd: 0.02, speed: 0.8 } },
  { id: "heavy-d", label: "Too much D", hint: "Over-damped: D fights every turn, so it's steady but slow.", gains: { kp: 1.0, ki: 0, kd: 0.35, speed: 0.62 } },
];

export const DEFAULT_GAINS = PRESETS[0].gains;
