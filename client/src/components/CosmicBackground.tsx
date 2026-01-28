/**
 * CosmicBackground - Premium ethereal space background
 * Design: Slow, dreamy galaxy with floating particles and soft nebulae
 * Inspired by: Apple's spatial design, premium dark UI aesthetics
 */

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // Depth for parallax
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  driftAngle: number; // For slow orbital drift
  driftSpeed: number;
  driftRadius: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  opacity: number;
  driftX: number;
  driftY: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  floatPhase: number;
}

interface CosmicBackgroundProps {
  isDark: boolean;
}

export default function CosmicBackground({ isDark }: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Softer, more ethereal star colors
    const starColors = isDark 
      ? ['255, 255, 255', '220, 230, 255', '255, 235, 220', '230, 220, 255', '220, 245, 235']
      : ['130, 110, 170', '110, 130, 170', '140, 110, 140', '110, 140, 140'];

    const initStars = () => {
      // Fewer stars for cleaner look
      const starCount = Math.floor((canvas.width * canvas.height) / 4000);
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 3 + 1, // Depth layers 1-4
        size: Math.random() * 2 + 0.3, // Slightly smaller
        opacity: Math.random() * 0.6 + 0.15, // Softer opacity
        twinkleSpeed: Math.random() * 0.008 + 0.003, // MUCH slower twinkle (was 0.03 + 0.01)
        twinklePhase: Math.random() * Math.PI * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: Math.random() * 0.00002 + 0.00001, // Very slow orbital drift
        driftRadius: Math.random() * 15 + 5, // Small drift radius
      }));
    };

    const initNebulae = () => {
      // Softer, more subtle nebula colors
      const nebulaColors = isDark 
        ? [
            'rgba(139, 92, 246, 0.06)', // Softer purple
            'rgba(79, 150, 246, 0.05)', // Softer blue
            'rgba(200, 100, 180, 0.04)', // Softer pink
            'rgba(80, 180, 160, 0.03)', // Softer teal
          ]
        : [
            'rgba(139, 92, 246, 0.10)', 
            'rgba(79, 150, 246, 0.08)', 
            'rgba(200, 100, 180, 0.06)', 
          ];
      
      // Fewer, larger nebulae for more premium feel
      nebulaeRef.current = Array.from({ length: 4 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 600 + 400, // Larger
        color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
        opacity: Math.random() * 0.4 + 0.2, // Softer
        driftX: (Math.random() - 0.5) * 0.08, // Much slower drift (was 0.3)
        driftY: (Math.random() - 0.5) * 0.08,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.00003 + 0.00002, // Very slow pulse
      }));
    };

    const initParticles = () => {
      particlesRef.current = [];
    };

    const spawnParticle = () => {
      // Fewer particles for cleaner look
      if (particlesRef.current.length > 25) return;
      
      const colors = isDark 
        ? ['160, 120, 255', '120, 160, 255', '200, 140, 200'] // Softer colors
        : ['139, 92, 246', '79, 150, 246'];
      
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.08, // Much slower movement (was 0.5)
        vy: (Math.random() - 0.5) * 0.08,
        size: Math.random() * 2 + 0.5, // Smaller particles
        opacity: Math.random() * 0.3 + 0.1, // Softer opacity
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 800 + 600, // Longer life for smoother transitions
        floatPhase: Math.random() * Math.PI * 2,
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
      initNebulae();
      initParticles();
    };

    const drawNebulae = (time: number) => {
      nebulaeRef.current.forEach((nebula, i) => {
        // Ultra-slow drift animation - feels like floating in space
        const offsetX = Math.sin(time * 0.000015 + i * 1.5) * 60 + nebula.driftX * time * 0.002;
        const offsetY = Math.cos(time * 0.000012 + i * 1.8) * 60 + nebula.driftY * time * 0.002;
        
        // Very slow breathing effect
        const breathe = Math.sin(time * nebula.pulseSpeed + nebula.pulsePhase) * 0.08 + 1;
        
        // Multi-layer nebula for depth
        const gradient = ctx.createRadialGradient(
          nebula.x + offsetX,
          nebula.y + offsetY,
          0,
          nebula.x + offsetX,
          nebula.y + offsetY,
          nebula.radius * breathe
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.3, nebula.color.replace(/[\d.]+\)$/, '0.03)'));
        gradient.addColorStop(0.6, nebula.color.replace(/[\d.]+\)$/, '0.01)'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nebula.x + offsetX, nebula.y + offsetY, nebula.radius * breathe, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawStars = (time: number) => {
      starsRef.current.forEach((star) => {
        // Ultra-slow twinkle effect - like real stars
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.25 + 0.75;
        const currentOpacity = star.opacity * twinkle;
        
        // Slow orbital drift - stars gently float
        const driftX = Math.cos(time * star.driftSpeed + star.driftAngle) * star.driftRadius;
        const driftY = Math.sin(time * star.driftSpeed + star.driftAngle) * star.driftRadius;
        
        // Subtle parallax effect based on mouse and depth
        const parallaxFactor = 1 / star.z;
        const parallaxX = (mouseRef.current.x - canvas.width / 2) * parallaxFactor * 0.008; // Reduced parallax
        const parallaxY = (mouseRef.current.y - canvas.height / 2) * parallaxFactor * 0.008;
        
        const x = star.x + parallaxX + driftX;
        const y = star.y + parallaxY + driftY;
        
        // Softer star glow
        const glowSize = star.size * (4 - star.z) * 1.2;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize);
        gradient.addColorStop(0, `rgba(${star.color}, ${currentOpacity * 0.9})`);
        gradient.addColorStop(0.4, `rgba(${star.color}, ${currentOpacity * 0.2})`);
        gradient.addColorStop(0.7, `rgba(${star.color}, ${currentOpacity * 0.05})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Star core - slightly softer
        ctx.fillStyle = `rgba(${star.color}, ${currentOpacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, star.size / star.z, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawParticles = (time: number) => {
      particlesRef.current = particlesRef.current.filter(p => p.life < p.maxLife);
      
      particlesRef.current.forEach((particle) => {
        // Add gentle floating motion
        const floatX = Math.sin(time * 0.0003 + particle.floatPhase) * 0.3;
        const floatY = Math.cos(time * 0.00025 + particle.floatPhase * 1.3) * 0.3;
        
        particle.x += particle.vx + floatX;
        particle.y += particle.vy + floatY;
        particle.life++;
        
        // Smoother fade in/out
        const lifeRatio = 1 - particle.life / particle.maxLife;
        const fadeIn = Math.min(particle.life / 100, 1); // Slower fade in
        const fadeOut = particle.life > particle.maxLife * 0.7 
          ? 1 - (particle.life - particle.maxLife * 0.7) / (particle.maxLife * 0.3)
          : 1;
        const currentOpacity = particle.opacity * lifeRatio * fadeIn * fadeOut;
        
        // Softer particle glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 6
        );
        gradient.addColorStop(0, `rgba(${particle.color}, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(${particle.color}, ${currentOpacity * 0.3})`);
        gradient.addColorStop(0.6, `rgba(${particle.color}, ${currentOpacity * 0.1})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 6, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawShootingStar = () => {
      // Rarer, more subtle shooting stars
      if (Math.random() > 0.9995 && isDark) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.3;
        const length = Math.random() * 100 + 50; // Shorter
        const angle = Math.PI / 4 + Math.random() * 0.2;
        
        const gradient = ctx.createLinearGradient(
          startX, startY,
          startX + Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Softer
        gradient.addColorStop(0.2, 'rgba(200, 220, 255, 0.3)');
        gradient.addColorStop(0.5, 'rgba(180, 200, 255, 0.1)');
        gradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5; // Thinner
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length);
        ctx.stroke();
      }
    };

    const drawGridLines = () => {
      // Removed grid for cleaner, more premium look
      // The space should feel open and infinite, not constrained by a grid
      return;
    };

    const animate = (time: number) => {
      timeRef.current = time;
      
      // Clear with gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      );
      
      if (isDark) {
        // Deeper, richer dark background
        bgGradient.addColorStop(0, 'rgb(8, 6, 20)');
        bgGradient.addColorStop(0.4, 'rgb(4, 4, 14)');
        bgGradient.addColorStop(0.8, 'rgb(2, 2, 8)');
        bgGradient.addColorStop(1, 'rgb(1, 1, 5)');
      } else {
        // Softer, more cream-like light background
        bgGradient.addColorStop(0, 'rgb(252, 252, 255)');
        bgGradient.addColorStop(0.5, 'rgb(250, 251, 254)');
        bgGradient.addColorStop(1, 'rgb(248, 249, 252)');
      }
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw layers
      drawGridLines();
      drawNebulae(time);
      drawStars(time);
      drawParticles(time);
      drawShootingStar();
      
      // Spawn new particles rarely for cleaner look
      if (Math.random() > 0.992) {
        spawnParticle();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    
    resizeCanvas();
    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
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
