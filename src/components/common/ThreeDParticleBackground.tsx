import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export interface ParticleBackgroundProps {
  variant?: 'global' | 'modal' | 'section' | 'card';
  particleCount?: number;
  colorTheme?: 'purple-indigo' | 'emergency-rose' | 'cyber-cyan' | 'golden-amber' | 'mixed';
  speedMultiplier?: number;
  className?: string;
  enableSynapticPulses?: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseRadius: number;
  color: string;
  glowColor: string;
  type: 'node' | 'dust' | 'orb' | 'sparkle';
  pulsePhase: number;
  pulseSpeed: number;
  twinkleSpeed?: number;
}

interface SynapticPulse {
  sourceIdx: number;
  targetIdx: number;
  progress: number; // 0 to 1
  speed: number;
  color: string;
}

export const ThreeDParticleBackground: React.FC<ParticleBackgroundProps> = ({
  variant = 'global',
  particleCount: customCount,
  colorTheme = 'purple-indigo',
  speedMultiplier = 1,
  className = '',
  enableSynapticPulses = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useApp();
  const reducedMotion = settings.reducedMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let displayWidth = variant === 'global' ? window.innerWidth : (canvas.parentElement?.clientWidth || 600);
    let displayHeight = variant === 'global' ? window.innerHeight : (canvas.parentElement?.clientHeight || 400);

    const setupCanvasSize = () => {
      if (variant === 'global') {
        displayWidth = window.innerWidth;
        displayHeight = window.innerHeight;
      } else {
        const parent = canvas.parentElement || containerRef.current;
        displayWidth = parent ? Math.max(parent.clientWidth, 200) : 600;
        displayHeight = parent ? Math.max(parent.clientHeight, 150) : 400;
      }
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvasSize();

    // Theme Palettes
    const palettes: Record<string, { color: string; glow: string }[]> = {
      'purple-indigo': [
        { color: 'rgba(168, 85, 247, 0.95)', glow: 'rgba(168, 85, 247, 0.55)' }, // Neon Purple
        { color: 'rgba(192, 132, 252, 0.95)', glow: 'rgba(192, 132, 252, 0.6)' },  // Lavender
        { color: 'rgba(129, 140, 248, 0.9)', glow: 'rgba(99, 102, 241, 0.5)' },   // Indigo
        { color: 'rgba(56, 189, 248, 0.9)', glow: 'rgba(56, 189, 248, 0.5)' },    // Electric Sky
        { color: 'rgba(232, 121, 249, 0.9)', glow: 'rgba(217, 70, 239, 0.5)' },   // Fuchsia
      ],
      'emergency-rose': [
        { color: 'rgba(244, 63, 94, 0.95)', glow: 'rgba(244, 63, 94, 0.6)' },     // Rose
        { color: 'rgba(239, 68, 68, 0.95)', glow: 'rgba(239, 68, 68, 0.55)' },    // Red
        { color: 'rgba(168, 85, 247, 0.85)', glow: 'rgba(168, 85, 247, 0.45)' },  // Purple
        { color: 'rgba(251, 113, 133, 0.9)', glow: 'rgba(251, 113, 133, 0.5)' },  // Soft Rose
      ],
      'cyber-cyan': [
        { color: 'rgba(56, 189, 248, 0.95)', glow: 'rgba(56, 189, 248, 0.6)' },   // Sky
        { color: 'rgba(6, 182, 212, 0.95)', glow: 'rgba(6, 182, 212, 0.55)' },    // Cyan
        { color: 'rgba(129, 140, 248, 0.9)', glow: 'rgba(99, 102, 241, 0.5)' },   // Indigo
        { color: 'rgba(168, 85, 247, 0.85)', glow: 'rgba(168, 85, 247, 0.45)' },  // Purple
      ],
      'golden-amber': [
        { color: 'rgba(251, 191, 36, 0.95)', glow: 'rgba(251, 191, 36, 0.6)' },   // Amber
        { color: 'rgba(245, 158, 11, 0.95)', glow: 'rgba(245, 158, 11, 0.55)' },  // Gold
        { color: 'rgba(168, 85, 247, 0.85)', glow: 'rgba(168, 85, 247, 0.45)' },  // Purple
      ],
      'mixed': [
        { color: 'rgba(168, 85, 247, 0.95)', glow: 'rgba(168, 85, 247, 0.55)' },
        { color: 'rgba(56, 189, 248, 0.95)', glow: 'rgba(56, 189, 248, 0.55)' },
        { color: 'rgba(244, 63, 94, 0.9)', glow: 'rgba(244, 63, 94, 0.5)' },
        { color: 'rgba(192, 132, 252, 0.95)', glow: 'rgba(192, 132, 252, 0.5)' },
        { color: 'rgba(52, 211, 153, 0.85)', glow: 'rgba(16, 185, 129, 0.45)' },
      ],
    };

    const palette = palettes[colorTheme] || palettes['purple-indigo'];

    const isMobile = displayWidth < 768;
    // Increased particle density for rich futuristic atmosphere
    let defaultCount = 140;
    if (variant === 'modal') {
      defaultCount = isMobile ? 35 : 55;
    } else if (variant === 'section' || variant === 'card') {
      defaultCount = isMobile ? 25 : 45;
    } else {
      defaultCount = isMobile ? 70 : 140;
    }

    const count = customCount || defaultCount;
    const depth = variant === 'global' ? 900 : 500;
    const fov = variant === 'global' ? 440 : 320;
    const connectionMaxDist = variant === 'global' ? (isMobile ? 120 : 160) : 110;

    const particles: Particle3D[] = [];

    // Initialize 3D particles
    for (let i = 0; i < count; i++) {
      const pTheme = palette[Math.floor(Math.random() * palette.length)];
      const randType = Math.random();
      let type: 'node' | 'dust' | 'orb' | 'sparkle' = 'node';
      let baseRadius = 2.2 + Math.random() * 2.4;

      if (randType < 0.35) {
        type = 'dust';
        baseRadius = 0.8 + Math.random() * 1.2;
      } else if (randType < 0.5) {
        type = 'sparkle';
        baseRadius = 1.4 + Math.random() * 1.6;
      } else if (randType > 0.88) {
        type = 'orb';
        baseRadius = 4.5 + Math.random() * 4.5;
      }

      const speedFactor = (reducedMotion ? 0.08 : 0.45) * speedMultiplier;

      particles.push({
        x: (Math.random() - 0.5) * displayWidth * 1.4,
        y: (Math.random() - 0.5) * displayHeight * 1.4,
        z: (Math.random() - 0.5) * depth,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        vz: (Math.random() - 0.5) * speedFactor * 0.8,
        baseRadius,
        color: pTheme.color,
        glowColor: pTheme.glow,
        type,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: reducedMotion ? 0.01 : 0.02 + Math.random() * 0.03,
        twinkleSpeed: 0.04 + Math.random() * 0.06,
      });
    }

    // Synaptic Light Pulses
    const synapticPulses: SynapticPulse[] = [];

    // Interactive mouse state
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let autoTime = 0;
    let mouseScreenX = -1000;
    let mouseScreenY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (variant !== 'global') {
        const rect = canvas.getBoundingClientRect();
        clientX = e.clientX - rect.left;
        clientY = e.clientY - rect.top;
      }

      mouseScreenX = clientX;
      mouseScreenY = clientY;

      const normX = (clientX / displayWidth - 0.5) * 2;
      const normY = (clientY / displayHeight - 0.5) * 2;
      targetRotY = normX * (variant === 'global' ? 0.28 : 0.18);
      targetRotX = -normY * (variant === 'global' ? 0.28 : 0.18);
    };

    const handleMouseLeave = () => {
      mouseScreenX = -1000;
      mouseScreenY = -1000;
      targetRotX = 0;
      targetRotY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (reducedMotion || e.touches.length === 0) return;
      const touch = e.touches[0];
      let clientX = touch.clientX;
      let clientY = touch.clientY;

      if (variant !== 'global') {
        const rect = canvas.getBoundingClientRect();
        clientX = touch.clientX - rect.left;
        clientY = touch.clientY - rect.top;
      }

      mouseScreenX = clientX;
      mouseScreenY = clientY;

      const normX = (clientX / displayWidth - 0.5) * 2;
      const normY = (clientY / displayHeight - 0.5) * 2;
      targetRotY = normX * 0.2;
      targetRotX = -normY * 0.2;
    };

    const handleResize = () => {
      setupCanvasSize();
    };

    const targetElement = variant === 'global' ? window : canvas.parentElement || canvas;

    if (variant === 'global') {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('resize', handleResize);
    } else {
      const parent = canvas.parentElement;
      if (parent) {
        parent.addEventListener('mousemove', handleMouseMove as any, { passive: true });
        parent.addEventListener('mouseleave', handleMouseLeave);
        parent.addEventListener('touchmove', handleTouchMove as any, { passive: true });
      }
    }

    // ResizeObserver for embedded variants
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && variant !== 'global' && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        setupCanvasSize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    let isTabActive = true;
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    interface ProjectedParticle {
      idx: number;
      p: Particle3D;
      projX: number;
      projY: number;
      projZ: number;
      scale: number;
      radius: number;
      alpha: number;
      mouseDistance: number;
    }

    const render = () => {
      if (!isTabActive) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      if (!reducedMotion) {
        autoTime += 0.0035 * speedMultiplier;
        currentRotX += (targetRotX + Math.sin(autoTime * 0.6) * 0.06 - currentRotX) * 0.04;
        currentRotY += (targetRotY + Math.cos(autoTime * 0.45) * 0.09 - currentRotY) * 0.04;
      } else {
        currentRotX = 0;
        currentRotY = 0;
      }

      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);

      const centerX = displayWidth / 2;
      const centerY = displayHeight / 2;

      const projected: ProjectedParticle[] = [];

      const boundX = displayWidth * (variant === 'global' ? 0.8 : 0.65);
      const boundY = displayHeight * (variant === 'global' ? 0.8 : 0.65);
      const boundZ = depth * 0.55;

      // Update positions and project 3D to 2D
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulsePhase += p.pulseSpeed;

        // Bounding box wrap
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < -boundZ) p.z = boundZ;
        if (p.z > boundZ) p.z = -boundZ;

        // 3D Euler Rotation
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        const y1 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // 3D Perspective Projection
        const zDist = z2 + depth / 2 + 60;
        if (zDist <= 20) continue;

        const scale = fov / (fov + z2);
        let projX = centerX + x1 * scale;
        let projY = centerY + y1 * scale;

        // Mouse proximity interaction (subtle gravity & glow enhancement)
        const dxMouse = projX - mouseScreenX;
        const dyMouse = projY - mouseScreenY;
        const mouseDist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        let mouseBoost = 1;

        if (mouseDist < 120 && !reducedMotion) {
          mouseBoost = 1.35;
          const force = (1 - mouseDist / 120) * 8;
          projX += (dxMouse / (mouseDist || 1)) * force;
          projY += (dyMouse / (mouseDist || 1)) * force;
        }

        // Pulsing luminance & breathing radius
        let pulse = 0.85 + 0.25 * Math.sin(p.pulsePhase);
        if (p.type === 'sparkle' && p.twinkleSpeed) {
          pulse = 0.6 + 0.55 * Math.abs(Math.sin(p.pulsePhase * 2));
        }

        const radius = Math.max(0.6, p.baseRadius * scale * pulse * (mouseBoost > 1 ? 1.2 : 1));

        // Depth-based opacity
        const depthAlpha = Math.min(1, Math.max(0.15, (depth - z2) / (depth * 1.35)));
        let alpha = depthAlpha * (p.type === 'dust' ? 0.45 : p.type === 'orb' ? 0.65 : p.type === 'sparkle' ? 0.9 : 0.88);
        if (mouseBoost > 1) {
          alpha = Math.min(1, alpha * 1.4);
        }

        projected.push({
          idx: i,
          p,
          projX,
          projY,
          projZ: z2,
          scale,
          radius,
          alpha,
          mouseDistance: mouseDist,
        });
      }

      // Sort back-to-front
      projected.sort((a, b) => b.projZ - a.projZ);

      // Map for quick index lookup
      const projectedMap = new Map<number, ProjectedParticle>();
      for (const pr of projected) {
        projectedMap.set(pr.idx, pr);
      }

      // Draw 3D Synaptic Constellation Lines
      const activeConnections: { p1: ProjectedParticle; p2: ProjectedParticle; alpha: number }[] = [];

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.p.type === 'dust' || p1.p.type === 'sparkle') continue;

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p2.p.type === 'dust' || p2.p.type === 'sparkle') continue;

          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist2D = Math.sqrt(dx * dx + dy * dy);

          if (dist2D < connectionMaxDist) {
            const lineAlpha =
              (1 - dist2D / connectionMaxDist) *
              Math.min(p1.alpha, p2.alpha) *
              0.32;

            if (lineAlpha > 0.02) {
              activeConnections.push({ p1, p2, alpha: lineAlpha });

              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);

              const gradient = ctx.createLinearGradient(
                p1.projX,
                p1.projY,
                p2.projX,
                p2.projY
              );
              gradient.addColorStop(0, `rgba(168, 85, 247, ${lineAlpha})`);
              gradient.addColorStop(0.5, `rgba(192, 132, 252, ${lineAlpha * 1.25})`);
              gradient.addColorStop(1, `rgba(56, 189, 248, ${lineAlpha})`);

              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.max(0.5, 1.2 * Math.min(p1.scale, p2.scale));
              ctx.stroke();
            }
          }
        }
      }

      // Spawn and render Synaptic Action Potential Pulses
      if (enableSynapticPulses && !reducedMotion && activeConnections.length > 0) {
        if (synapticPulses.length < 12 && Math.random() < 0.12) {
          const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
          synapticPulses.push({
            sourceIdx: conn.p1.idx,
            targetIdx: conn.p2.idx,
            progress: 0,
            speed: 0.015 + Math.random() * 0.025,
            color: Math.random() > 0.5 ? 'rgba(56, 189, 248, 0.95)' : 'rgba(232, 121, 249, 0.95)',
          });
        }

        // Draw and update pulses
        for (let k = synapticPulses.length - 1; k >= 0; k--) {
          const pulse = synapticPulses[k];
          pulse.progress += pulse.speed;

          const p1 = projectedMap.get(pulse.sourceIdx);
          const p2 = projectedMap.get(pulse.targetIdx);

          if (!p1 || !p2 || pulse.progress >= 1) {
            synapticPulses.splice(k, 1);
            continue;
          }

          const curX = p1.projX + (p2.projX - p1.projX) * pulse.progress;
          const curY = p1.projY + (p2.projY - p1.projY) * pulse.progress;
          const pulseRadius = 2.2 * Math.min(p1.scale, p2.scale);

          // Glowing pulse head
          ctx.beginPath();
          ctx.arc(curX, curY, pulseRadius, 0, Math.PI * 2);
          ctx.fillStyle = pulse.color;
          ctx.shadowColor = pulse.color;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Render 3D Glowing Particle Nodes
      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const { projX, projY, radius, alpha, p } = item;

        if (
          projX < -60 ||
          projX > displayWidth + 60 ||
          projY < -60 ||
          projY > displayHeight + 60
        ) {
          continue;
        }

        // Draw luminous neon radial glow aura
        if (p.type === 'orb' || (p.type === 'node' && item.scale > 0.65)) {
          const glowRadius = radius * (p.type === 'orb' ? 4.5 : 3.0);
          const glowGrad = ctx.createRadialGradient(
            projX,
            projY,
            0,
            projX,
            projY,
            glowRadius
          );
          glowGrad.addColorStop(0, p.glowColor.replace(/[\d.]+\)$/, `${alpha * 0.6})`));
          glowGrad.addColorStop(0.5, p.glowColor.replace(/[\d.]+\)$/, `${alpha * 0.22})`));
          glowGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

          ctx.beginPath();
          ctx.arc(projX, projY, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Sparkle cross star shimmer
        if (p.type === 'sparkle' && item.scale > 0.75) {
          ctx.strokeStyle = p.color.replace(/[\d.]+\)$/, `${alpha * 0.85})`);
          ctx.lineWidth = 0.8;
          const crossLen = radius * 2.2;
          ctx.beginPath();
          ctx.moveTo(projX - crossLen, projY);
          ctx.lineTo(projX + crossLen, projY);
          ctx.moveTo(projX, projY - crossLen);
          ctx.lineTo(projX, projY + crossLen);
          ctx.stroke();
        }

        // Draw solid bright core node
        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${alpha})`);
        ctx.shadowColor = p.glowColor;
        ctx.shadowBlur = radius * 2.5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (variant === 'global') {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('resize', handleResize);
      } else {
        const parent = canvas.parentElement;
        if (parent) {
          parent.removeEventListener('mousemove', handleMouseMove as any);
          parent.removeEventListener('mouseleave', handleMouseLeave);
          parent.removeEventListener('touchmove', handleTouchMove as any);
        }
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion, variant, customCount, colorTheme, speedMultiplier, enableSynapticPulses]);

  const isGlobal = variant === 'global';

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none ${
        isGlobal
          ? 'fixed inset-0 w-full h-full z-0'
          : 'absolute inset-0 w-full h-full z-0 overflow-hidden rounded-[inherit]'
      } ${className}`}
      style={{
        position: isGlobal ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          background: 'transparent',
        }}
      />
    </div>
  );
};

export default ThreeDParticleBackground;
