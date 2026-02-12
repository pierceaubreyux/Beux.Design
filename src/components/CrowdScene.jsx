import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

/* ─── Performance detection ─── */
function detectPerformanceMode() {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
  const isLowPower = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return {
    isMobile,
    isLowPower: isMobile || isLowPower || prefersReducedMotion,
    shouldReduceEffects: isMobile || prefersReducedMotion,
    targetFPS: isMobile ? 30 : 60,
  }
}

/* ─── Procedural instanced-mesh crowd (fallback) ─── */
function createProceduralCrowd(scene, isMobile = false) {
  const group = new THREE.Group()

  // Reduce geometry complexity on mobile
  const bodyGeo = isMobile
    ? new THREE.CapsuleGeometry(0.12, 0.55, 3, 8)
    : new THREE.CapsuleGeometry(0.12, 0.55, 4, 12)
  const headGeo = isMobile
    ? new THREE.SphereGeometry(0.1, 8, 6)
    : new THREE.SphereGeometry(0.1, 12, 8)

  const bodyMat = new THREE.MeshStandardMaterial({
    roughness: 0.7,
    metalness: 0.15,
  })
  const headMat = bodyMat.clone()

  // Reduce crowd size on mobile
  const rows = isMobile ? 7 : 10
  const cols = isMobile ? 12 : 18
  const count = rows * cols
  const bodyMesh = new THREE.InstancedMesh(bodyGeo, bodyMat, count)
  const headMesh = new THREE.InstancedMesh(headGeo, headMat, count)

  bodyMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)

  const dummy = new THREE.Object3D()
  const color = new THREE.Color()

  const instanceData = []

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols

    const x = (col - cols / 2) * 0.55 + (Math.random() - 0.5) * 0.25
    const z = (row - rows / 2) * 0.5 + (Math.random() - 0.5) * 0.2
    const heightScale = 0.75 + Math.random() * 0.5
    const phase = Math.random() * Math.PI * 2

    instanceData.push({ x, z, heightScale, phase })

    /* Body */
    dummy.position.set(x, heightScale * 0.35, z)
    dummy.scale.set(1, heightScale, 1)
    dummy.rotation.set(0, Math.random() * 0.4 - 0.2, 0)
    dummy.updateMatrix()
    bodyMesh.setMatrixAt(i, dummy.matrix)

    /* Head */
    dummy.position.set(x, heightScale * 0.75 + 0.08, z)
    dummy.scale.set(1, 1, 1)
    dummy.updateMatrix()
    headMesh.setMatrixAt(i, dummy.matrix)

    /* Color variation in deep blue range */
    const hue = 0.59 + (Math.random() - 0.5) * 0.06
    const sat = 0.35 + Math.random() * 0.25
    const light = 0.12 + Math.random() * 0.18
    color.setHSL(hue, sat, light)
    bodyMesh.setColorAt(i, color)

    color.setHSL(hue, sat * 0.8, light + 0.05)
    headMesh.setColorAt(i, color)
  }

  bodyMesh.instanceMatrix.needsUpdate = true
  bodyMesh.instanceColor.needsUpdate = true
  headMesh.instanceMatrix.needsUpdate = true
  headMesh.instanceColor.needsUpdate = true

  group.add(bodyMesh)
  group.add(headMesh)
  scene.add(group)

  group.scale.set(4.5, 4.5, 4.5)
  group.position.y = 0

  return { group, bodyMesh, headMesh, instanceData, count, cols }
}

/* ─── Soft circle texture for particles ─── */
function createCircleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const center = 32
  const radius = 30
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, Math.PI * 2)
  ctx.fill()
  return new THREE.CanvasTexture(canvas)
}

/* ─── Atmospheric particles ─── */
function createParticles(scene, isMobile = false) {
  const count = isMobile ? 150 : 600
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30
    positions[i * 3 + 1] = Math.random() * 15 - 2
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    sizes[i] = Math.random() * 2 + 0.5
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const mat = new THREE.PointsMaterial({
    color: 0x4A90D9,
    size: 0.06,
    map: createCircleTexture(),
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(geo, mat)
  scene.add(points)
  return points
}

/* ─── Main Component ─── */
export default function CrowdScene({ className, ...rest }) {
  const containerRef = useRef(null)
  const sceneState = useRef({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    /* Detect performance mode */
    const perfMode = detectPerformanceMode()

    /* Scene */
    const scene = new THREE.Scene()
    scene.background = null
    // Disable fog on mobile (expensive shader calculation)
    if (!perfMode.isMobile) {
      scene.fog = new THREE.FogExp2(0x060D18, 0.025)
    }

    /* Camera */
    const camera = new THREE.PerspectiveCamera(
      68,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 4, 8)
    camera.lookAt(0, 4, 0)

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = false
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    /* Lighting */
    const ambientLight = new THREE.AmbientLight(0x8899BB, 0.5)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xCCDDFF, 0.9)
    mainLight.position.set(5, 10, 7.5)
    scene.add(mainLight)

    const rimLight = new THREE.DirectionalLight(0x4A90D9, 0.5)
    rimLight.position.set(-5, 3, -5)
    scene.add(rimLight)

    const fillLight = new THREE.DirectionalLight(0x1E3A5F, 0.3)
    fillLight.position.set(0, -2, 5)
    scene.add(fillLight)

    /* Particles (reduced on mobile) */
    const particles = createParticles(scene, perfMode.isMobile)

    /* State */
    const clock = new THREE.Clock()
    let mixer = null
    let crowd = null
    let proceduralData = null
    const targetPos = new THREE.Vector3(0, 0, 0)
    let mouseX = 0
    let mouseY = 0
    let animFrameId = null
    let isVisible = true
    let frameCount = 0
    const frameSkip = perfMode.isMobile ? 1 : 0 // Skip every other frame on mobile

    /* Try loading GLB model */
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(
      'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
    )
    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
      '/final-crows-test.glb',
      (gltf) => {
        crowd = gltf.scene
        crowd.scale.set(5, 5, 5)

        /* Center model in scene, then align camera to its center */
        const box = new THREE.Box3().setFromObject(crowd)
        const center = box.getCenter(new THREE.Vector3())
        crowd.position.sub(center)


        scene.add(crowd)

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(crowd)
          gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play()
          })
        }

        sceneState.current.loaded = true
        container.dispatchEvent(new CustomEvent('scene-loaded'))
        window.dispatchEvent(new CustomEvent('beux-scene-ready'))
      },
      undefined,
      () => {
        /* GLB failed — use procedural crowd */
        proceduralData = createProceduralCrowd(scene, perfMode.isMobile)
        crowd = proceduralData.group
        sceneState.current.loaded = true
        container.dispatchEvent(new CustomEvent('scene-loaded'))
        window.dispatchEvent(new CustomEvent('beux-scene-ready'))
      }
    )

    /* Animation loop with frame skipping and visibility pause */
    function animate() {
      animFrameId = requestAnimationFrame(animate)

      // Pause when not visible
      if (!isVisible) return

      // Frame skipping on mobile
      frameCount++
      if (frameSkip > 0 && frameCount % (frameSkip + 1) !== 0) {
        return
      }

      const delta = clock.getDelta()
      const elapsed = clock.getElapsedTime()

      if (mixer) mixer.update(delta)

      /* Mouse follow - skip on mobile or low power */
      if (crowd && !perfMode.shouldReduceEffects) {
        targetPos.x = mouseX * 5
        crowd.position.x += (targetPos.x - crowd.position.x) * 0.05

        const targetTiltX = -mouseY * 0.15
        crowd.rotation.x += (targetTiltX - crowd.rotation.x) * 0.04

        const dx = targetPos.x - crowd.position.x
        if (Math.abs(dx) > 0.01) {
          const targetRot = Math.atan2(dx, 1) + Math.PI
          let rotDiff = targetRot - crowd.rotation.y
          while (rotDiff > Math.PI) rotDiff -= Math.PI * 2
          while (rotDiff < -Math.PI) rotDiff += Math.PI * 2
          crowd.rotation.y += rotDiff * 0.08
        }
      }

      /* Animate procedural crowd sway - only if using procedural */
      if (proceduralData && !perfMode.shouldReduceEffects) {
        const { bodyMesh, headMesh, instanceData, count } = proceduralData
        const dummy = new THREE.Object3D()

        for (let i = 0; i < count; i++) {
          const d = instanceData[i]
          const sway = Math.sin(elapsed * 0.6 + d.phase) * 0.015

          dummy.position.set(d.x, d.heightScale * 0.35, d.z)
          dummy.scale.set(1, d.heightScale, 1)
          dummy.rotation.set(0, sway * 2, sway)
          dummy.updateMatrix()
          bodyMesh.setMatrixAt(i, dummy.matrix)

          dummy.position.set(d.x, d.heightScale * 0.75 + 0.08, d.z)
          dummy.scale.set(1, 1, 1)
          dummy.rotation.set(sway * 0.5, sway, 0)
          dummy.updateMatrix()
          headMesh.setMatrixAt(i, dummy.matrix)
        }
        bodyMesh.instanceMatrix.needsUpdate = true
        headMesh.instanceMatrix.needsUpdate = true
      }

      /* Animate particles - throttle updates on mobile */
      if (!perfMode.isMobile || frameCount % 2 === 0) {
        const positions = particles.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(elapsed * 0.3 + i) * 0.002
        }
        particles.geometry.attributes.position.needsUpdate = true
      }
      particles.rotation.y = elapsed * 0.01

      renderer.render(scene, camera)
    }

    /* IntersectionObserver - pause when off-screen */
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animFrameId) {
          animate()
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    animate()

    /* Mouse tracking - only on desktop */
    function onMouseMove(e) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    if (!perfMode.isMobile) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    /* Resize */
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize, { passive: true })

    /* Cleanup */
    return () => {
      cancelAnimationFrame(animFrameId)
      observer.disconnect()
      if (!perfMode.isMobile) {
        window.removeEventListener('mousemove', onMouseMove)
      }
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      dracoLoader.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} className={className} {...rest} />
}
