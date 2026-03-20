import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import {
  DroneShow, DroneData, TrajectoryPoint, LedCommand,
  Vec3, ShowSegment, CuePoint
} from '../models/drone-show.model';

const LED_FPS = 50;

@Injectable({ providedIn: 'root' })
export class SkycParserService {

  async parseSkycFile(file: File): Promise<DroneShow> {
    const buffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buffer);

    const showJson = await this.readJson(zip, 'show.json');
    const cuesJson = await this.readJsonSafe(zip, 'cues.json');

    const droneEntries = showJson.swarm?.drones ?? [];
    const drones: DroneData[] = [];

    for (let i = 0; i < droneEntries.length; i++) {
      const entry = droneEntries[i];
      const settings = entry.settings ?? {};
      const name = settings.name ?? `Drone ${i + 1}`;
      const home = settings.home ?? [0, 0, 0];

      const trajPath = this.findFile(zip, `drones/${name}/trajectory.json`)
        ?? this.findFile(zip, `drones/Drone ${i + 1}/trajectory.json`);
      const lightPath = this.findFile(zip, `drones/${name}/lights.json`)
        ?? this.findFile(zip, `drones/Drone ${i + 1}/lights.json`);

      let trajectory: TrajectoryPoint[] = [];
      let trajVersion: any = '?';
      if (trajPath) {
        const trajJson = await this.readJson(zip, trajPath);
        trajVersion = trajJson?.version;
        trajectory = this.decodeTrajectory(trajJson);
      }

      let ledCommands: LedCommand[] = [];
      if (lightPath) {
        const lightJson = await this.readJson(zip, lightPath);
        ledCommands = this.decodeLightProgram(lightJson);
      } else if (settings.lights) {
        ledCommands = this.decodeLightProgram(settings.lights);
      }

      if (trajectory.length === 0 && settings.trajectory) {
        trajectory = this.decodeTrajectory(settings.trajectory);
      }

      if (i === 0) {
        const withCP = trajectory.filter(p => p.controlPoints !== null);
        console.log(`[skyc] Drone "${name}": ${trajectory.length} pts, ${withCP.length} with CP, ver=${trajVersion}`);
        console.log('[skyc] Points with control points:');
        for (const p of withCP.slice(0, 6)) {
          const idx = trajectory.indexOf(p);
          const cp = p.controlPoints!;
          console.log(
            `  [${idx}] t=${p.time.toFixed(3)} pos=(${p.position.x.toFixed(2)}, ${p.position.y.toFixed(2)}, ${p.position.z.toFixed(2)})` +
            ` cp0=(${cp[0].x.toFixed(2)}, ${cp[0].y.toFixed(2)}, ${cp[0].z.toFixed(2)})` +
            ` cp1=(${cp[1].x.toFixed(2)}, ${cp[1].y.toFixed(2)}, ${cp[1].z.toFixed(2)})`
          );
        }
      }

      drones.push({
        name,
        homePosition: { x: home[0], y: home[1], z: home[2] },
        trajectory,
        ledCommands
      });
    }

    const rawSegments = showJson.meta?.segments ?? {};
    const segments: ShowSegment[] = Object.entries(rawSegments).map(([name, range]: [string, any]) => ({
      name,
      start: Array.isArray(range) ? range[0] : 0,
      end: Array.isArray(range) ? range[1] : 0
    }));

    const cues: CuePoint[] = (cuesJson?.items ?? []).map((c: any) => ({
      time: c.time ?? 0,
      name: c.name ?? ''
    }));

    const duration = showJson.settings?.duration
      ?? (drones.length > 0
        ? Math.max(...drones.map(d => d.trajectory.length > 0
          ? d.trajectory[d.trajectory.length - 1].time : 0))
        : 0);

    return {
      title: showJson.meta?.title ?? file.name.replace('.skyc', ''),
      duration,
      environment: showJson.environment?.type ?? 'outdoor',
      drones,
      segments,
      cues
    };
  }

  decodeTrajectory(json: any): TrajectoryPoint[] {
    if (!json || typeof json !== 'object') return [];

    const version = json.version ?? 1;
    const takeoffTime = json.takeoffTime ?? 0;
    const points: TrajectoryPoint[] = [];
    const raw = json.points ?? [];

    if (version === 0) {
      for (const pt of raw) {
        if (!Array.isArray(pt) || pt.length < 4) continue;
        points.push({
          time: pt[0] + takeoffTime,
          position: { x: pt[1], y: pt[2], z: pt[3] },
          controlPoints: null
        });
      }
    } else if (version === 1) {
      for (const pt of raw) {
        if (!Array.isArray(pt) || pt.length < 2) continue;

        const time = pt[0] + takeoffTime;
        const pos = pt[1];
        if (!Array.isArray(pos) || pos.length < 3) continue;

        let controlPoints: [Vec3, Vec3] | null = null;
        if (pt.length > 2 && Array.isArray(pt[2]) && pt[2].length === 2) {
          const cp0 = pt[2][0];
          const cp1 = pt[2][1];
          if (Array.isArray(cp0) && cp0.length === 3 &&
              Array.isArray(cp1) && cp1.length === 3) {
            controlPoints = [
              { x: cp0[0], y: cp0[1], z: cp0[2] },
              { x: cp1[0], y: cp1[1], z: cp1[2] }
            ];
          }
        }

        points.push({
          time,
          position: { x: pos[0], y: pos[1], z: pos[2] },
          controlPoints
        });
      }
    }

    points.sort((a, b) => a.time - b.time);

    const cleaned: TrajectoryPoint[] = [];
    for (let i = 0; i < points.length; i++) {
      if (i > 0 && points[i].time === points[i - 1].time) continue;
      cleaned.push(points[i]);
    }

    for (let i = 1; i < cleaned.length - 1; i++) {
      const prev = cleaned[i - 1].position;
      const curr = cleaned[i].position;
      const next = cleaned[i + 1].position;

      const midX = (prev.x + next.x) / 2;
      const midY = (prev.y + next.y) / 2;
      const midZ = (prev.z + next.z) / 2;

      const spanDist = Math.sqrt(
        (next.x - prev.x) ** 2 + (next.y - prev.y) ** 2 + (next.z - prev.z) ** 2
      );
      const devDist = Math.sqrt(
        (curr.x - midX) ** 2 + (curr.y - midY) ** 2 + (curr.z - midZ) ** 2
      );

      const timeFrac = cleaned[i + 1].time - cleaned[i - 1].time;
      if (timeFrac > 0 && timeFrac < 0.15 && devDist > spanDist * 3 && devDist > 2) {
        console.warn(
          `[trajectory] spike at point ${i}, t=${cleaned[i].time.toFixed(3)}: ` +
          `deviation=${devDist.toFixed(2)}, span=${spanDist.toFixed(2)}`,
          { prev, curr, next }
        );
        cleaned[i] = {
          ...cleaned[i],
          position: { x: midX, y: midY, z: midZ },
          controlPoints: null
        };
      }
    }

    return cleaned;
  }

  decodeLightProgram(json: any): LedCommand[] {
    if (!json || typeof json !== 'object') return [];

    const data = json.data;
    if (data == null) return [];

    if (Array.isArray(data)) {
      return this.decodeLightJson(data);
    }

    if (typeof data === 'string') {
      return this.decodeLedBytecode(data);
    }

    return [];
  }

  private decodeLightJson(data: any[]): LedCommand[] {
    const commands: LedCommand[] = [];

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      if (!Array.isArray(entry) || entry.length < 2) continue;

      const time = entry[0];
      const colorArr = entry[1];
      if (!Array.isArray(colorArr) || colorArr.length < 3) continue;

      const color = { r: colorArr[0], g: colorArr[1], b: colorArr[2] };
      const isFade = entry.length > 2 ? entry[2] === 1 : false;

      const nextTime = (i + 1 < data.length && Array.isArray(data[i + 1]))
        ? data[i + 1][0]
        : time;
      const duration = nextTime - time;

      commands.push({
        time,
        type: isFade ? 'fade_to_color' : 'set_color',
        color,
        duration: Math.max(duration, 0)
      });
    }

    return commands;
  }

  private decodeLedBytecode(base64Data: string): LedCommand[] {
    let bytes: Uint8Array;
    try {
      const binary = atob(base64Data);
      bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
    } catch {
      return [];
    }

    const commands: LedCommand[] = [];
    let offset = 0;
    let currentTime = 0;

    while (offset < bytes.length) {
      const opcode = bytes[offset++];

      if (opcode === 0x00) {
        break;
      }

      switch (opcode) {
        case 0x02: {
          if (offset >= bytes.length) return commands;
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'sleep', color: { r: 0, g: 0, b: 0 }, duration });
          currentTime += duration;
          break;
        }

        case 0x04: {
          if (offset + 3 > bytes.length) return commands;
          const r = bytes[offset++];
          const g = bytes[offset++];
          const b = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'set_color', color: { r, g, b }, duration });
          currentTime += duration;
          break;
        }

        case 0x05: {
          if (offset + 1 > bytes.length) return commands;
          const w = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'set_color', color: { r: w, g: w, b: w }, duration });
          currentTime += duration;
          break;
        }

        case 0x06: {
          if (offset >= bytes.length) return commands;
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'set_black', color: { r: 0, g: 0, b: 0 }, duration });
          currentTime += duration;
          break;
        }

        case 0x07: {
          if (offset >= bytes.length) return commands;
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'set_color', color: { r: 255, g: 255, b: 255 }, duration });
          currentTime += duration;
          break;
        }

        case 0x08: {
          if (offset + 3 > bytes.length) return commands;
          const r = bytes[offset++];
          const g = bytes[offset++];
          const b = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'fade_to_color', color: { r, g, b }, duration });
          currentTime += duration;
          break;
        }

        case 0x09: {
          if (offset + 1 > bytes.length) return commands;
          const w = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'fade_to_color', color: { r: w, g: w, b: w }, duration });
          currentTime += duration;
          break;
        }

        case 0x0A: {
          if (offset >= bytes.length) return commands;
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'fade_to_black', color: { r: 0, g: 0, b: 0 }, duration });
          currentTime += duration;
          break;
        }

        case 0x0B: {
          if (offset >= bytes.length) return commands;
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({ time: currentTime, type: 'fade_to_color', color: { r: 255, g: 255, b: 255 }, duration });
          currentTime += duration;
          break;
        }

        case 0x0C: {
          if (offset >= bytes.length) return commands;
          offset++;
          break;
        }

        case 0x0D: {
          break;
        }

        case 0xFE:
        case 0xFF: {
          return commands;
        }

        default: {
          return commands;
        }
      }
    }

    return commands;
  }

  interpolatePosition(waypoints: TrajectoryPoint[], t: number): Vec3 {
    if (waypoints.length === 0) return { x: 0, y: 0, z: 0 };
    if (t <= waypoints[0].time) return { ...waypoints[0].position };
    if (t >= waypoints[waypoints.length - 1].time) return { ...waypoints[waypoints.length - 1].position };

    let lo = 0;
    let hi = waypoints.length - 1;
    while (lo < hi - 1) {
      const mid = (lo + hi) >>> 1;
      if (waypoints[mid].time <= t) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    const p0 = waypoints[lo];
    const p1 = waypoints[lo + 1];
    const segDuration = p1.time - p0.time;
    if (segDuration <= 0) return { ...p0.position };

    const u = (t - p0.time) / segDuration;

    if (p1.controlPoints) {
      return this.cubicBezier(p0.position, p1.controlPoints[0], p1.controlPoints[1], p1.position, u);
    }

    return {
      x: p0.position.x + (p1.position.x - p0.position.x) * u,
      y: p0.position.y + (p1.position.y - p0.position.y) * u,
      z: p0.position.z + (p1.position.z - p0.position.z) * u
    };
  }

  getColorAtTime(commands: LedCommand[], t: number): { r: number; g: number; b: number } {
    if (commands.length === 0) return { r: 255, g: 255, b: 255 };

    let prevColor = { r: 0, g: 0, b: 0 };

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      const cmdEnd = cmd.time + cmd.duration;

      if (t < cmd.time) {
        return prevColor;
      }

      switch (cmd.type) {
        case 'set_color':
          if (t >= cmd.time && t < cmdEnd) return { ...cmd.color };
          prevColor = { ...cmd.color };
          break;

        case 'set_black':
          if (t >= cmd.time && t < cmdEnd) return { r: 0, g: 0, b: 0 };
          prevColor = { r: 0, g: 0, b: 0 };
          break;

        case 'fade_to_color': {
          if (t >= cmd.time && t < cmdEnd) {
            const u = cmd.duration > 0 ? (t - cmd.time) / cmd.duration : 1;
            return {
              r: Math.round(prevColor.r + (cmd.color.r - prevColor.r) * u),
              g: Math.round(prevColor.g + (cmd.color.g - prevColor.g) * u),
              b: Math.round(prevColor.b + (cmd.color.b - prevColor.b) * u)
            };
          }
          prevColor = { ...cmd.color };
          break;
        }

        case 'fade_to_black': {
          if (t >= cmd.time && t < cmdEnd) {
            const u = cmd.duration > 0 ? (t - cmd.time) / cmd.duration : 1;
            return {
              r: Math.round(prevColor.r * (1 - u)),
              g: Math.round(prevColor.g * (1 - u)),
              b: Math.round(prevColor.b * (1 - u))
            };
          }
          prevColor = { r: 0, g: 0, b: 0 };
          break;
        }

        case 'sleep':
          break;
      }
    }

    return prevColor;
  }

  private cubicBezier(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
      y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y,
      z: mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z
    };
  }

  private readVarint(bytes: Uint8Array, offset: number): { value: number; bytesRead: number } {
    let value = 0;
    let shift = 0;
    let bytesRead = 0;

    while (offset < bytes.length) {
      const byte = bytes[offset++];
      bytesRead++;
      value |= (byte & 0x7F) << shift;
      if ((byte & 0x80) === 0) break;
      shift += 7;
    }

    return { value, bytesRead };
  }

  private async readJson(zip: JSZip, path: string): Promise<any> {
    const file = zip.file(path);
    if (!file) throw new Error(`File not found in archive: ${path}`);
    const text = await file.async('string');
    return JSON.parse(text);
  }

  private async readJsonSafe(zip: JSZip, path: string): Promise<any | null> {
    const file = zip.file(path);
    if (!file) return null;
    try {
      const text = await file.async('string');
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  private findFile(zip: JSZip, path: string): string | null {
    if (zip.file(path)) return path;
    const allFiles = Object.keys(zip.files);
    const match = allFiles.find(f => f.toLowerCase() === path.toLowerCase());
    return match ?? null;
  }
}
