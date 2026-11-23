"use client";

import { useState } from "react";
import { buildTrack, createSim } from "@/lib/pid/sim";

/** Mutable simulation handle shared by the 3D scene (writer) and the HUD (reader). */
export class LabController {
  readonly sim = createSim(buildTrack());
  readonly telemetry = { err: new Float32Array(360), out: new Float32Array(360), head: 0, len: 0 };
  private _paused = false;
  private _trailReset = false;

  get paused() {
    return this._paused;
  }
  setPaused(p: boolean) {
    this._paused = p;
  }
  reset() {
    this.sim.respawn(true);
    this._trailReset = true;
  }
  /** Returns true once after reset() so the scene can clear its trail. */
  consumeTrailReset() {
    const r = this._trailReset;
    this._trailReset = false;
    return r;
  }
  record(error: number, output: number) {
    const t = this.telemetry;
    t.err[t.head] = error;
    t.out[t.head] = Math.max(-1.5, Math.min(1.5, output));
    t.head = (t.head + 1) % t.err.length;
    t.len = Math.min(t.len + 1, t.err.length);
  }
}

export type Telemetry = LabController["telemetry"];

export function usePidSim() {
  const [lab] = useState(() => new LabController());
  return lab;
}
