import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import fragmentShader from './shader/fragment.frag?raw'
import fragmentLineShader from './shader/fragment_line.frag?raw'
import vertexShader from './shader/vertex.vert?raw'
import matcapTexture from './matcap.png'

import './style.css'

class Sketch {
  constructor(el) {
    this.domElement = el

    this.windowSize = new THREE.Vector2(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    )

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.windowSize.x / this.windowSize.y,
      0.1,
      100
    )
    this.camera.position.z = 2
    this.scene.add(this.camera)

    this.clock = new THREE.Clock()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.domElement.append(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true

    this.addObject()
    this.addEventListener()
    this.resize()
    this.render()
  }

  addObject() {
    this.geometry = new THREE.IcosahedronBufferGeometry(1, 8)
    this.material = new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: { uTime: { value: 0 } },
      fragmentShader,
      vertexShader,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.edgeGeometry = new THREE.EdgesGeometry(this.geometry)
    this.lineMaterial = new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: { uTime: { value: 0 } },
      fragmentShader: fragmentLineShader,
      vertexShader,
    })
    this.meshLines = new THREE.LineSegments(
      this.edgeGeometry,
      this.lineMaterial
    )
    this.meshLines.scale.set(1.001, 1.001, 1.001)

    this.particleMaterial = new THREE.ShaderMaterial({
      extensions: { derivatives: true },
      uniforms: { uTime: { value: 0 } },
      fragmentShader: fragmentLineShader,
      vertexShader,
    })
    this.pointsMesh = new THREE.Points(this.geometry, this.particleMaterial)
    this.pointsMesh.scale.set(1.005, 1.005, 1.005)

    this.meshSphere = new THREE.Mesh(
      this.geometry,
      new THREE.MeshMatcapMaterial({
        matcap: new THREE.TextureLoader().load(matcapTexture),
        opacity: 0.8,
        transparent: true,
      })
    )

    this.scene.add(this.mesh)
    // this.scene.add(this.meshLines)
    this.scene.add(this.pointsMesh)
    this.scene.add(this.meshSphere)
  }

  resize() {
    this.windowSize.set(
      this.domElement.offsetWidth,
      this.domElement.offsetHeight
    )

    this.camera.aspect = this.windowSize.x / this.windowSize.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.windowSize.x, this.windowSize.y)
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
  }

  addEventListener() {
    window.addEventListener('resize', this.resize.bind(this))
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime()

    this.material.uniforms.uTime.value = elapsedTime
    this.lineMaterial.uniforms.uTime.value = elapsedTime
    this.particleMaterial.uniforms.uTime.value = elapsedTime

    this.scene.rotation.x = 0.3 * Math.sin(0.5 * elapsedTime * 2 * Math.PI)
    this.scene.rotation.z = 0.4 * Math.sin(0.5 * elapsedTime * 2 * Math.PI)

    this.controls.update()

    this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch(document.getElementById('app'))
