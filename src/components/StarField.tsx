import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  angle: number;
}

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
        });
      }
      starsRef.current = stars;
    };

    const createShootingStar = () => {
      if (Math.random() < 0.003) {
        shootingStarsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.5,
          length: Math.random() * 80 + 20,
          speed: Math.random() * 6 + 4,
          opacity: 1,
          angle: Math.random() * Math.PI / 4 + Math.PI / 6,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      starsRef.current.forEach((star) => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((shootingStar) => {
        const endX = shootingStar.x + Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;

        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow effect
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(173, 216, 230, ${shootingStar.opacity * 0.5})`;
        ctx.lineWidth = 4;
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.01;

        return shootingStar.opacity > 0 && shootingStar.x < canvas.width + 100;
      });

      createShootingStar();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      createStars();
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default StarField;