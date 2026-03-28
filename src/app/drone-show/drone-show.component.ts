import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, HostListener
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SkycParserService } from '../core/services/skyc-parser.service';
import { DroneShow } from '../core/models/drone-show.model';

interface DroneSceneObject {
  mesh: THREE.Mesh;
  trail: THREE.Line;
  trailBuffer: Float32Array;
  /** Reused when reordering circular trail buffer — avoids per-frame allocation */
  trailScratch: Float32Array;
  trailHead: number;
  trailCount: number;
  colorScratch: THREE.Color;
}

@Component({
  selector: 'app-drone-show',
  templateUrl: './drone-show.component.html',
  styleUrls: ['./drone-show.component.css']
})
export class DroneShowComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  show: DroneShow | null = null;
  loading = false;
  errorMessage = '';

  isPlaying = false;
  currentTime = 0;
  playbackSpeed = 1;
  speedOptions = [0.25, 0.5, 1, 2, 4];
  progressPercent = 0;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animFrameId = 0;
  private lastFrameTime = 0;
  private droneObjects: DroneSceneObject[] = [];
  private maxTrailPoints = 120;
  private highDroneCount = false;
  private isDraggingScrubber = false;
  private fineGrid!: THREE.GridHelper;
  private coarseGrid!: THREE.GridHelper;

  constructor(
    private ngZone: NgZone,
    private parser: SkycParserService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopAnimation();
    this.disposeScene();
  }

  get formattedCurrentTime(): string {
    return this.formatTime(this.currentTime);
  }

  get formattedDuration(): string {
    return this.formatTime(this.show?.duration ?? 0);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    await this.loadFile(input.files[0]);
  }

  async onFileDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.name.endsWith('.skyc')) {
      await this.loadFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  async loadFile(file: File): Promise<void> {
    this.loading = true;
    this.errorMessage = '';
    this.isPlaying = false;
    this.currentTime = 0;
    this.progressPercent = 0;

    try {
      this.show = await this.parser.parseSkycFile(file);
      setTimeout(() => this.initScene(), 0);
    } catch (e: any) {
      this.errorMessage = e.message ?? 'Failed to parse file';
      this.show = null;
    } finally {
      this.loading = false;
    }
  }

  togglePlayPause(): void {
    if (!this.show) return;
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      if (this.currentTime >= this.show.duration) {
        this.currentTime = 0;
      }
      this.lastFrameTime = performance.now();
    }
  }

  setSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  onScrubStart(): void {
    this.isDraggingScrubber = true;
  }

  onScrubEnd(): void {
    this.isDraggingScrubber = false;
  }

  onScrub(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentTime = parseFloat(input.value);
    this.progressPercent = this.show ? (this.currentTime / this.show.duration) * 100 : 0;
    this.resetTrails();
    this.updateDronePositions();
  }

  restart(): void {
    this.currentTime = 0;
    this.progressPercent = 0;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.resetTrails();
    this.updateDronePositions();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.renderer || !this.camera) return;
    const container = this.canvasRef?.nativeElement?.parentElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  private initScene(): void {
    this.disposeScene();
    if (!this.show) return;

    const canvas = this.canvasRef.nativeElement;
    const container = canvas.parentElement!;
    const w = container.clientWidth;
    const h = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x111111);
    this.scene.fog = new THREE.FogExp2(0x111111, 0.004);

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
    this.camera.position.set(20, 15, 20);
    this.camera.lookAt(0, 5, 0);

    const n = this.show.drones.length;
    this.highDroneCount = n >= 24;
    this.maxTrailPoints = this.highDroneCount ? 48 : 120;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.highDroneCount,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(w, h);
    const prCap = this.highDroneCount ? 1.25 : 2;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, prCap));
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 5, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.update();

    const ambientLight = new THREE.AmbientLight(0x555555, 0.85);
    this.scene.add(ambientLight);

    const goldColor = 0xc19957;
    const gridDiv = this.highDroneCount ? 60 : 120;

    this.fineGrid = new THREE.GridHelper(120, gridDiv, goldColor, 0x3a3020);
    (this.fineGrid.material as THREE.Material).transparent = true;
    (this.fineGrid.material as THREE.Material).opacity = 1;
    this.scene.add(this.fineGrid);

    this.coarseGrid = new THREE.GridHelper(120, this.highDroneCount ? 6 : 12, goldColor, 0x5a4830);
    this.coarseGrid.position.y = 0.005;
    (this.coarseGrid.material as THREE.Material).transparent = true;
    (this.coarseGrid.material as THREE.Material).opacity = 0;
    this.scene.add(this.coarseGrid);

    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 1,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    this.scene.add(ground);

    this.createDroneObjects();
    this.updateDronePositions();

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private createDroneObjects(): void {
    if (!this.show) return;

    const segs = this.highDroneCount ? 8 : 12;
    const sphereGeo = new THREE.SphereGeometry(0.25, segs, segs);

    for (const drone of this.show.drones) {
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(drone.homePosition.x, drone.homePosition.z, -drone.homePosition.y);
      this.scene.add(mesh);

      const trailBuffer = new Float32Array(this.maxTrailPoints * 3);
      const trailScratch = new Float32Array(this.maxTrailPoints * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(trailBuffer, 3));
      trailGeo.setDrawRange(0, 0);
      const trailMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: this.highDroneCount ? 0.45 : 0.6
      });
      const trail = new THREE.Line(trailGeo, trailMat);
      trail.frustumCulled = false;
      this.scene.add(trail);

      this.droneObjects.push({
        mesh,
        trail,
        trailBuffer,
        trailScratch,
        trailHead: 0,
        trailCount: 0,
        colorScratch: new THREE.Color()
      });
    }
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    let needsUiUpdate = false;

    if (this.isPlaying && !this.isDraggingScrubber && this.show) {
      const dt = (now - this.lastFrameTime) / 1000;
      this.currentTime += dt * this.playbackSpeed;

      if (this.currentTime >= this.show.duration) {
        this.currentTime = this.show.duration;
        this.isPlaying = false;
      }

      this.progressPercent = (this.currentTime / this.show.duration) * 100;
      needsUiUpdate = true;
    }
    this.lastFrameTime = now;

    this.updateDronePositions();
    this.updateGridLOD();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    if (needsUiUpdate) {
      this.ngZone.run(() => {});
    }
  }

  private updateGridLOD(): void {
    if (!this.fineGrid || !this.coarseGrid) return;
    const dist = this.camera.position.distanceTo(this.controls.target);
    const nearDist = 25;
    const farDist = 70;
    const t = Math.max(0, Math.min(1, (dist - nearDist) / (farDist - nearDist)));
    (this.fineGrid.material as THREE.Material).opacity = 1 - t;
    (this.coarseGrid.material as THREE.Material).opacity = t;
  }

  private updateDronePositions(): void {
    if (!this.show) return;

    for (let i = 0; i < this.show.drones.length; i++) {
      const drone = this.show.drones[i];
      const obj = this.droneObjects[i];
      if (!obj) continue;

      const pos = this.parser.interpolatePosition(drone.trajectory, this.currentTime);
      obj.mesh.position.set(pos.x, pos.z, -pos.y);

      const color = this.parser.getColorAtTime(drone.ledCommands, this.currentTime);
      const c = obj.colorScratch;
      c.setRGB(color.r / 255, color.g / 255, color.b / 255);
      (obj.mesh.material as THREE.MeshBasicMaterial).color.copy(c);
      (obj.trail.material as THREE.LineBasicMaterial).color.copy(c);

      this.updateTrail(obj, pos.x, pos.z, -pos.y);
    }
  }

  private updateTrail(obj: DroneSceneObject, x: number, y: number, z: number): void {
    const buf = obj.trailBuffer;
    const idx = obj.trailHead * 3;
    buf[idx] = x;
    buf[idx + 1] = y;
    buf[idx + 2] = z;

    obj.trailHead = (obj.trailHead + 1) % this.maxTrailPoints;
    if (obj.trailCount < this.maxTrailPoints) {
      obj.trailCount++;
    }

    const geo = obj.trail.geometry as THREE.BufferGeometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;

    if (obj.trailCount < this.maxTrailPoints) {
      posAttr.needsUpdate = true;
      geo.setDrawRange(0, obj.trailCount);
    } else {
      const ordered = obj.trailScratch;
      const startIdx = obj.trailHead * 3;
      const endBytes = buf.length - startIdx;
      ordered.set(buf.subarray(startIdx), 0);
      ordered.set(buf.subarray(0, startIdx), endBytes);
      posAttr.set(ordered);
      posAttr.needsUpdate = true;
      geo.setDrawRange(0, this.maxTrailPoints);
    }
  }

  private resetTrails(): void {
    for (const obj of this.droneObjects) {
      obj.trailBuffer.fill(0);
      obj.trailHead = 0;
      obj.trailCount = 0;
      const geo = obj.trail.geometry as THREE.BufferGeometry;
      geo.setDrawRange(0, 0);
    }
  }

  private stopAnimation(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }

  private disposeScene(): void {
    this.stopAnimation();
    this.droneObjects = [];
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
