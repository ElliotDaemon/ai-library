/**
 * TreeBackground - Ambient forest/nature background
 * Design: Subtle, atmospheric with floating particles
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface TreeBackgroundProps {
  isDark: boolean;
}

export default function TreeBackground({ isDark }: TreeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initParticles = () => {
      const particleCount = 30;
      particlesRef.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: Math.random() * 0.2 + 0.1, // Slowly falling
        opacity: Math.random() * 0.3 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      }));
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Draw a simple leaf shape
      ctx.beginPath();
      ctx.moveTo(0, -particle.size * 2);
      ctx.quadraticCurveTo(particle.size, -particle.size, particle.size * 0.5, particle.size);
      ctx.quadraticCurveTo(0, particle.size * 0.5, -particle.size * 0.5, particle.size);
      ctx.quadraticCurveTo(-particle.size, -particle.size, 0, -particle.size * 2);
      
      ctx.fillStyle = isDark 
        ? `rgba(140, 180, 100, ${particle.opacity})` 
        : `rgba(80, 120, 50, ${particle.opacity})`;
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      
      if (isDark) {
        gradient.addColorStop(0, '#0a0d08');
        gradient.addColorStop(0.5, '#080a06');
        gradient.addColorStop(1, '#050704');
      } else {
        gradient.addColorStop(0, '#f8f9f6');
        gradient.addColorStop(0.5, '#f5f7f3');
        gradient.addColorStop(1, '#f2f4f0');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw subtle radial glow at center-bottom (where tree would be)
      const glowGradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height,
        0,
        canvas.width / 2,
        canvas.height,
        canvas.height * 0.8
      );
      
      if (isDark) {
        glowGradient.addColorStop(0, 'rgba(60, 80, 40, 0.15)');
        glowGradient.addColorStop(0.5, 'rgba(40, 60, 30, 0.05)');
        glowGradient.addColorStop(1, 'transparent');
      } else {
        glowGradient.addColorStop(0, 'rgba(100, 140, 70, 0.08)');
        glowGradient.addColorStop(0.5, 'rgba(80, 120, 50, 0.03)');
        glowGradient.addColorStop(1, 'transparent');
      }
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;
        
        // Wrap around
        if (particle.y > canvas.height + 20) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        
        drawParticle(particle);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
