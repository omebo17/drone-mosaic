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
    const cuesJson = await this.readJson(zip, 'cues.json');

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
      if (trajPath) {
        const trajJson = await this.readJson(zip, trajPath);
        trajectory = this.decodeTrajectory(trajJson);
      }

      let ledCommands: LedCommand[] = [];
      if (lightPath) {
        const lightJson = await this.readJson(zip, lightPath);
        ledCommands = this.decodeLedBytecode(lightJson.data);
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
    const version = json.version ?? 1;
    const points: TrajectoryPoint[] = [];

    if (version === 1) {
      const raw = json.points ?? [];
      for (const pt of raw) {
        const time = pt[0];
        const pos = pt[1];
        const cps = pt.length > 2 ? pt[2] : null;

        let controlPoints: [Vec3, Vec3] | null = null;
        if (cps && cps.length === 2 && cps[0].length === 3 && cps[1].length === 3) {
          controlPoints = [
            { x: cps[0][0], y: cps[0][1], z: cps[0][2] },
            { x: cps[1][0], y: cps[1][1], z: cps[1][2] }
          ];
        }

        points.push({
          time,
          position: { x: pos[0], y: pos[1], z: pos[2] },
          controlPoints
        });
      }
    }

    return points;
  }

  decodeLedBytecode(base64Data: string): LedCommand[] {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
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
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({
            time: currentTime,
            type: 'sleep',
            color: { r: 0, g: 0, b: 0 },
            duration
          });
          currentTime += duration;
          break;
        }

        case 0x04: {
          const r = bytes[offset++];
          const g = bytes[offset++];
          const b = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({
            time: currentTime,
            type: 'set_color',
            color: { r, g, b },
            duration
          });
          currentTime += duration;
          break;
        }

        case 0x06: {
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({
            time: currentTime,
            type: 'set_black',
            color: { r: 0, g: 0, b: 0 },
            duration
          });
          currentTime += duration;
          break;
        }

        case 0x08: {
          const r = bytes[offset++];
          const g = bytes[offset++];
          const b = bytes[offset++];
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({
            time: currentTime,
            type: 'fade_to_color',
            color: { r, g, b },
            duration
          });
          currentTime += duration;
          break;
        }

        case 0x0A: {
          const { value: frames, bytesRead } = this.readVarint(bytes, offset);
          offset += bytesRead;
          const duration = frames / LED_FPS;
          commands.push({
            time: currentTime,
            type: 'fade_to_black',
            color: { r: 0, g: 0, b: 0 },
            duration
          });
          currentTime += duration;
          break;
        }

        case 0x0C: {
          offset++;
          break;
        }

        case 0x0D: {
          break;
        }

        default:
          break;
      }
    }

    return commands;
  }

  interpolatePosition(waypoints: TrajectoryPoint[], t: number): Vec3 {
    if (waypoints.length === 0) return { x: 0, y: 0, z: 0 };
    if (t <= waypoints[0].time) return { ...waypoints[0].position };
    if (t >= waypoints[waypoints.length - 1].time) return { ...waypoints[waypoints.length - 1].position };

    let i = 0;
    for (; i < waypoints.length - 1; i++) {
      if (t >= waypoints[i].time && t <= waypoints[i + 1].time) break;
    }

    const p0 = waypoints[i];
    const p1 = waypoints[i + 1];
    const segDuration = p1.time - p0.time;
    if (segDuration <= 0) return { ...p0.position };

    const u = (t - p0.time) / segDuration;

    if (p0.controlPoints) {
      return this.cubicBezier(p0.position, p0.controlPoints[0], p0.controlPoints[1], p1.position, u);
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

  private findFile(zip: JSZip, path: string): string | null {
    if (zip.file(path)) return path;
    const allFiles = Object.keys(zip.files);
    const match = allFiles.find(f => f.toLowerCase() === path.toLowerCase());
    return match ?? null;
  }
}
