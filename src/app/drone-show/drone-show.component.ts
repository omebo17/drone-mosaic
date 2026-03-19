import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, HostListener
} from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SkycParserService } from '../core/services/skyc-parser.service';
import { DroneShow } from '../core/models/drone-show.model';

interface DroneSceneObject {
  mesh: THREE.Mesh;
  glow: THREE.PointLight;
  trail: THREE.Line;
  trailPositions: number[];
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

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private animFrameId = 0;
  private lastFrameTime = 0;
  private droneObjects: DroneSceneObject[] = [];
  private readonly MAX_TRAIL_POINTS = 120;
  private isDraggingScrubber = false;

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

  get progressPercent(): number {
    if (!this.show || this.show.duration <= 0) return 0;
    return (this.currentTime / this.show.duration) * 100;
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
    this.updateDronePositions();
  }

  restart(): void {
    this.currentTime = 0;
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

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(0, 5, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.update();

    const ambientLight = new THREE.AmbientLight(0x333333, 0.6);
    this.scene.add(ambientLight);

    const goldColor = 0xc19957;
    const grid = new THREE.GridHelper(120, 120, goldColor, 0x3a3020);
    this.scene.add(grid);

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

    for (const drone of this.show.drones) {
      const sphereGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 2,
        roughness: 0.2,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(drone.homePosition.x, drone.homePosition.z, drone.homePosition.y);
      this.scene.add(mesh);

      const glow = new THREE.PointLight(0xffffff, 3, 15);
      mesh.add(glow);

      const trailPositions = new Array(this.MAX_TRAIL_POINTS * 3).fill(0);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
      const trailMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4
      });
      const trail = new THREE.Line(trailGeo, trailMat);
      trail.frustumCulled = false;
      this.scene.add(trail);

      this.droneObjects.push({ mesh, glow, trail, trailPositions });
    }
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const now = performance.now();
    if (this.isPlaying && !this.isDraggingScrubber && this.show) {
      const dt = (now - this.lastFrameTime) / 1000;
      this.currentTime += dt * this.playbackSpeed;
      if (this.currentTime >= this.show.duration) {
        this.currentTime = this.show.duration;
        this.isPlaying = false;
      }
    }
    this.lastFrameTime = now;

    this.updateDronePositions();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private updateDronePositions(): void {
    if (!this.show) return;

    for (let i = 0; i < this.show.drones.length; i++) {
      const drone = this.show.drones[i];
      const obj = this.droneObjects[i];
      if (!obj) continue;

      const pos = this.parser.interpolatePosition(drone.trajectory, this.currentTime);
      obj.mesh.position.set(pos.x, pos.z, pos.y);

      const color = this.parser.getColorAtTime(drone.ledCommands, this.currentTime);
      const threeColor = new THREE.Color(color.r / 255, color.g / 255, color.b / 255);
      const mat = obj.mesh.material as THREE.MeshStandardMaterial;
      mat.color.copy(threeColor);
      mat.emissive.copy(threeColor);
      obj.glow.color.copy(threeColor);
      (obj.trail.material as THREE.LineBasicMaterial).color.copy(threeColor);

      this.updateTrail(obj, pos.x, pos.z, pos.y);
    }
  }

  private updateTrail(obj: DroneSceneObject, x: number, y: number, z: number): void {
    const arr = obj.trailPositions;
    for (let i = arr.length - 3; i >= 3; i -= 3) {
      arr[i] = arr[i - 3];
      arr[i + 1] = arr[i - 2];
      arr[i + 2] = arr[i - 1];
    }
    arr[0] = x;
    arr[1] = y;
    arr[2] = z;

    const geo = obj.trail.geometry as THREE.BufferGeometry;
    const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
    posAttr.set(arr);
    posAttr.needsUpdate = true;
  }

  private resetTrails(): void {
    for (const obj of this.droneObjects) {
      obj.trailPositions.fill(0);
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
