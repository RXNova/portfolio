"use client"

import { useEffect, useRef } from 'react'

export default function TechSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let dpr = 1
    
    // Sphere properties
    const particleCount = 180
    const particles: Particle[] = []
    const radius = 100
    let rotationX = 0
    let rotationY = 0
    let targetRotationX = 0
    let targetRotationY = 0

    class Particle {
      x: number = 0
      y: number = 0
      z: number = 0
      origX: number
      origY: number
      origZ: number

      constructor() {
        const phi = Math.acos(-1 + (2 * Math.random()))
        const theta = Math.random() * 2 * Math.PI

        this.origX = radius * Math.sin(phi) * Math.cos(theta)
        this.origY = radius * Math.sin(phi) * Math.sin(theta)
        this.origZ = radius * Math.cos(phi)
      }

      project(rotX: number, rotY: number) {
        let y1 = this.origY * Math.cos(rotX) - this.origZ * Math.sin(rotX)
        let z1 = this.origY * Math.sin(rotX) + this.origZ * Math.cos(rotX)

        let x2 = this.origX * Math.cos(rotY) - z1 * Math.sin(rotY)
        let z2 = this.origX * Math.sin(rotY) + z1 * Math.cos(rotY)

        this.x = x2
        this.y = y1
        this.z = z2
      }

      draw() {
        const factor = 250 / (250 - this.z)
        const x = this.x * factor + width / 2
        const y = this.y * factor + height / 2
        
        const opacity = Math.max(0.1, (this.z + radius) / (2 * radius))
        const size = factor * 1.2

        ctx!.beginPath()
        ctx!.arc(x, y, size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(184, 92, 74, ${opacity * 0.7})`
        ctx!.fill()
      }
    }

    const init = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const resize = () => {
      if (!canvas.parentElement) return
      dpr = window.devicePixelRatio || 1
      width = canvas.parentElement.clientWidth
      height = canvas.parentElement.clientHeight
      
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      
      ctx.scale(dpr, dpr)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      targetRotationY = (mouseX / width - 0.5) * 1.5
      targetRotationX = (mouseY / height - 0.5) * -1.5
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      rotationX += (targetRotationX - rotationX) * 0.05
      rotationY += (targetRotationY - rotationY) * 0.05
      
      targetRotationY += 0.003
      targetRotationX += 0.001

      particles.forEach(p => p.project(rotationX, rotationY))
      particles.sort((a, b) => a.z - b.z)

      particles.forEach((p, i) => {
        p.draw()
        
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const distSq = Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2) + Math.pow(p.z - p2.z, 2)
          
          if (distSq < 2500) { // 50^2
            const factor = 250 / (250 - p.z)
            const x1 = p.x * factor + width / 2
            const y1 = p.y * factor + height / 2
            
            const factor2 = 250 / (250 - p2.z)
            const x2 = p2.x * factor2 + width / 2
            const y2 = p2.y * factor2 + height / 2

            const opacity = Math.max(0, 1 - Math.sqrt(distSq) / 50) * 0.15
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = `rgba(184, 92, 74, ${opacity})`
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    init()
    resize()
    render()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="h-full w-full min-h-[300px] flex items-center justify-center overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="cursor-crosshair"
      />
    </div>
  )
}
