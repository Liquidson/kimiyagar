"use strict";

const Canvas = (() => {
  const LETTERS = ['ا','ب','ج','د','ه','و','ز','ح','ط','ی','ک','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];
  const PARTICLE_COUNT = 36;

  let initialized = false;
  let canvas = null;
  let ctx = null;
  let particles = [];
  let animationFrameId = 0;
  let lastFrameTime = 0;
  let viewportWidth = 0;
  let viewportHeight = 0;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function createParticle(index, placeAnywhere = false) {
    const upward = index % 2 === 1;
    const preferEdge = !placeAnywhere && Math.random() < 0.72 && viewportWidth > 520;
    let x;

    if (preferEdge) {
      const edgeWidth = Math.max(60, viewportWidth * 0.2);
      x = Math.random() < 0.5
        ? randomBetween(8, edgeWidth)
        : randomBetween(viewportWidth - edgeWidth, viewportWidth - 8);
    } else {
      x = randomBetween(8, Math.max(9, viewportWidth - 8));
    }

    return {
      ch: LETTERS[Math.floor(Math.random() * LETTERS.length)],
      x,
      y: randomBetween(-24, viewportHeight + 24),
      direction: upward ? -1 : 1,
      speed: randomBetween(0.12, 0.34),
      drift: randomBetween(-0.055, 0.055),
      size: randomBetween(13, 26),
      alpha: randomBetween(0.11, 0.23),
      glow: randomBetween(4, 10),
      phase: randomBetween(0, Math.PI * 2),
      pulseSpeed: randomBetween(0.0007, 0.0016),
    };
  }

  function resetParticle(particle, index) {
    const replacement = createParticle(index);
    Object.assign(particle, replacement);
    particle.y = particle.direction > 0 ? -30 : viewportHeight + 30;
  }

  function resize() {
    if (!canvas || !ctx) return;

    viewportWidth = Math.max(1, window.innerWidth);
    viewportHeight = Math.max(1, window.innerHeight);

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(viewportWidth * pixelRatio);
    canvas.height = Math.round(viewportHeight * pixelRatio);
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    particles.forEach((particle, index) => {
      if (particle.x < 0 || particle.x > viewportWidth) {
        Object.assign(particle, createParticle(index, true));
      }
      particle.y = Math.min(Math.max(particle.y, -30), viewportHeight + 30);
    });
  }

  function draw(now) {
    if (!ctx || !canvas) return;

    const elapsed = lastFrameTime ? Math.min((now - lastFrameTime) / 16.667, 2.2) : 1;
    lastFrameTime = now;

    ctx.clearRect(0, 0, viewportWidth, viewportHeight);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    particles.forEach((particle, index) => {
      const pulse = 0.86 + Math.sin(now * particle.pulseSpeed + particle.phase) * 0.14;
      const visibleAlpha = particle.alpha * pulse;

      ctx.font = `${particle.size.toFixed(1)}px "Noto Naskh Arabic", serif`;
      ctx.fillStyle = `rgba(232, 201, 122, ${visibleAlpha.toFixed(3)})`;
      ctx.shadowColor = `rgba(201, 168, 76, ${Math.min(0.5, visibleAlpha * 1.9).toFixed(3)})`;
      ctx.shadowBlur = particle.glow;
      ctx.fillText(particle.ch, particle.x, particle.y);

      particle.y += particle.direction * particle.speed * elapsed;
      particle.x += particle.drift * elapsed;

      if (particle.x < -20) particle.x = viewportWidth + 20;
      if (particle.x > viewportWidth + 20) particle.x = -20;

      if ((particle.direction > 0 && particle.y > viewportHeight + 32)
          || (particle.direction < 0 && particle.y < -32)) {
        resetParticle(particle, index);
      }
    });

    ctx.shadowBlur = 0;
    animationFrameId = requestAnimationFrame(draw);
  }

  function startAnimation() {
    if (animationFrameId) return;
    lastFrameTime = 0;
    animationFrameId = requestAnimationFrame(draw);
  }

  function init() {
    if (initialized) return;

    canvas = document.getElementById('bgCanvas');
    if (!canvas || !canvas.getContext) return;

    ctx = canvas.getContext('2d');
    if (!ctx) return;

    initialized = true;
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => createParticle(index, true));
    window.addEventListener('resize', resize, { passive: true });

    const fontReady = document.fonts?.ready;
    if (fontReady && typeof fontReady.then === 'function') {
      let started = false;
      const startOnce = () => {
        if (started) return;
        started = true;
        startAnimation();
      };
      fontReady.then(startOnce).catch(startOnce);
      window.setTimeout(startOnce, 1200);
    } else {
      startAnimation();
    }
  }

  return { init };
})();
