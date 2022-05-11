import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss'],
})
export class CubeComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize')
  onResize() {
    // Update sizes
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Update camera
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  @Input() public cubeProp: any = {
    rotationSpeedX: 0.01,
    rotationSpeedY: 0.01,
    size: 200,
  };

  @Input() public stageProp: any = {
    cameraZ: 400,
    fieldOfView: 1,
    nearClippingPlane: 1,
    farClippingPlane: 1000,
  };

  private camera!: THREE.PerspectiveCamera;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  private loader = new THREE.TextureLoader();
  bricksColorTexture = this.loader.load('./assets/textures/bricks/color.jpg');
  bricksAmbientOcclusionTexture = this.loader.load(
    './assets/textures/bricks/ambientOcclusion.jpg'
  );
  bricksNormalTexture = this.loader.load('./assets/textures/bricks/normal.jpg');
  bricksRoughnessTexture = this.loader.load(
    './assets/textures/bricks/roughness.jpg'
  );

  grassColorTexture = this.loader.load('./assets/textures/grass/color.jpg');
  grassAmbientOcclusionTexture = this.loader.load(
    './assets/textures/grass/ambientOcclusion.jpg'
  );
  grassNormalTexture = this.loader.load('./assets/textures/grass/normal.jpg');
  grassRoughnessTexture = this.loader.load(
    './assets/textures/grass/roughness.jpg'
  );

  private room = new THREE.Group();
  private sheet = new THREE.BoxGeometry(4, 4, 0.1);
  private material = new THREE.MeshStandardMaterial({
    map: this.grassColorTexture,
    aoMap: this.grassAmbientOcclusionTexture,
    normalMap: this.grassNormalTexture,
    roughnessMap: this.grassRoughnessTexture,
  });
  private wallMaterial = new THREE.MeshStandardMaterial({
    map: this.bricksColorTexture,
    aoMap: this.bricksAmbientOcclusionTexture,
    normalMap: this.bricksNormalTexture,
    roughnessMap: this.bricksRoughnessTexture,
  });
  private floor: THREE.Mesh = new THREE.Mesh(this.sheet, this.material);
  private wallRight: THREE.Mesh = new THREE.Mesh(this.sheet, this.wallMaterial);
  private wallLeft: THREE.Mesh = new THREE.Mesh(this.sheet, this.wallMaterial);
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private axesHelper = new THREE.AxesHelper(5);
  private light = new THREE.AmbientLight(0x404040, 4);
  private controls!: OrbitControls;
  private gui = new dat.GUI();
  private rectLight = new THREE.RectAreaLight("purple", 2, 2, 2);
  private helper = new RectAreaLightHelper( this.rectLight );

  constructor() {}

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }

  ngOnInit(): void {}

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.scene.add(this.room);

    this.floor.rotateX(Math.PI / 2);
    this.floor.position.y = 0;
    this.floor.position.x = 2;
    this.floor.position.z = 2;
    this.room.add(this.floor);

    this.wallLeft.rotateY(Math.PI / 2);
    this.wallLeft.position.y = 2;
    this.wallLeft.position.x = 0;
    this.wallLeft.position.z = 2;
    this.room.add(this.wallLeft);

    this.wallRight.position.y = 2;
    this.wallRight.position.x = 2;
    this.wallRight.position.z = 0;
    this.room.add(this.wallRight);

    this.camera = new THREE.PerspectiveCamera(
      this.stageProp.fieldOfView,
      this.getAspectRadio(),
      this.stageProp.nearClippingPlane,
      this.stageProp.farClippingPlane
    );
    this.camera.position.z = 400;
    this.camera.position.x = 400;
    this.camera.position.y = 400;
    this.camera.lookAt(new Vector3());
    this.scene.add(this.axesHelper);

    this.rectLight.position.set(0.1, 1.1, 1.1);
    this.rectLight.rotateY(Math.PI / 2)
    this.scene.add(this.rectLight);
    this.scene.add(this.light);

    const controls = new OrbitControls(this.camera, this.canvas);
    controls.enableDamping = true;
  }

  private getAspectRadio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private animateCube() {
    // this.cube.rotation.x += this.cubeProp.rotationSpeedX;
    // this.cube.rotation.y += this.cubeProp.rotationSpeedY;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.animateCube();
      component.renderer.render(component.scene, component.camera);
    })();
  }
}
