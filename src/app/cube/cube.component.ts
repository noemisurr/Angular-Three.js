import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three'

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef; 

  @Input() public cubeProp: any = {
    rotationSpeedX: 0.05, 
    rotationSpeedY: 0.01,
    size: 200
  }

  @Input() public stageProp: any = {
    cameraZ: 400, 
    fieldOfView: 1,
    nearClippingPlane: 1,
    farClippingPlane: 1000
  }

  private camera!: THREE.PerspectiveCamera
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
  private loader = new THREE.TextureLoader()
  private geometry = new THREE.BoxGeometry(1, 1, 1)
  private material = new THREE.MeshBasicMaterial({color: 'red'})
  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene


  constructor() { }

  ngAfterViewInit(): void {
    this.createScene()
    this.startRenderingLoop()
  }

  ngOnInit(): void {
  }

  private createScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x000000)
    this.scene.add(this.cube)
    this.camera = new THREE.PerspectiveCamera(this.stageProp.fieldOfView, this.getAspectRadio(), this.stageProp.nearClippingPlane, this.stageProp.farClippingPlane)
    this.camera.position.z = this.stageProp.cameraZ
  }

  private getAspectRadio() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private animateCube() {
    this.cube.rotation.x += this.cubeProp.rotationSpeedX 
    this.cube.rotation.y += this.cubeProp.rotationSpeedY 
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)
    let component: CubeComponent = this;
    (function render() {
      requestAnimationFrame(render)
      component.animateCube()
      component.renderer.render(component.scene, component.camera)
    }())
  }

}


