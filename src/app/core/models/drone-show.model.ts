export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface TrajectoryPoint {
  time: number;
  position: Vec3;
  controlPoints: [Vec3, Vec3] | null;
}

export interface LedCommand {
  time: number;
  type: 'set_color' | 'set_black' | 'fade_to_color' | 'fade_to_black' | 'sleep';
  color: { r: number; g: number; b: number };
  duration: number;
}

export interface ShowSegment {
  name: string;
  start: number;
  end: number;
}

export interface CuePoint {
  time: number;
  name: string;
}

export interface DroneData {
  name: string;
  homePosition: Vec3;
  trajectory: TrajectoryPoint[];
  ledCommands: LedCommand[];
}

export interface DroneShow {
  title: string;
  duration: number;
  environment: string;
  drones: DroneData[];
  segments: ShowSegment[];
  cues: CuePoint[];
}
