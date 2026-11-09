import { createMesh } from '../lib/mesh';
import { meshKeywords } from '../lib/mesh-keywords';

function initialize(canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return; // The CSS dots and complete page work without canvas.
  const ctx = context;
  const hero = canvas.closest<HTMLElement>('.mesh-hero')!;
  const { vertices, edges } = createMesh();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const points = vertices.map(() => ({ x: 0, y: 0, depth: 0, light: 0, dx: 0, dy: 0 }));
  const pointer = { x: 0, y: 0, active: false };
  const reveals = vertices.map(() => 0);
  let targets = new Set<number>();
  type Rect = { left: number; top: number; right: number; bottom: number };
  let protectedAreas: Rect[] = [];
  const overlaps = (a: Rect, b: Rect) =>
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

  function drawKeywords(still: boolean, delta: number) {
    const radius = width < 768 ? 90 : 115;
    const candidates = pointer.active ? points.map((point, index) => ({
      index,
      distance: Math.hypot(point.x - pointer.x, point.y - pointer.y),
      depth: point.depth,
    })).filter(point => point.depth > .42 && point.distance < radius)
      .sort((a, b) => (a.distance - (targets.has(a.index) ? 20 : 0)) -
        (b.distance - (targets.has(b.index) ? 20 : 0))) : [];
    const next = new Set<number>();
    const words = new Set<string>();
    for (const candidate of candidates) {
      const word = meshKeywords[(candidate.index * 37) % meshKeywords.length]!;
      if (words.has(word)) continue;
      next.add(candidate.index);
      words.add(word);
      if (next.size === 3) break;
    }
    targets = next;
    const ease = 1 - Math.exp(-delta / 110);
    ctx.font = '500 13px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    const placed: Rect[] = [];
    // Render active labels before fading labels, so old labels cannot hide a new one.
    const order = [...targets, ...reveals.flatMap((alpha, index) =>
      alpha >= .025 && !targets.has(index) ? [index] : [])];
    for (const index of order) {
      const target = targets.has(index) ? 1 : 0;
      reveals[index] = still ? target : reveals[index]! + (target - reveals[index]!) * ease;
      const alpha = reveals[index]!;
      if (alpha < .025 || placed.length === 3) continue;
      const point = points[index]!;
      const word = meshKeywords[(index * 37) % meshKeywords.length]!;
      const textWidth = ctx.measureText(word).width;
      const positions = [
        { left: point.x + 13, top: point.y - 24 },
        { left: point.x - textWidth - 13, top: point.y - 24 },
        { left: point.x + 13, top: point.y + 12 },
        { left: point.x - textWidth - 13, top: point.y + 12 },
      ];
      const position = positions.find(({ left, top }) => {
        const bounds = { left: left - 7, top: top - 5, right: left + textWidth + 7, bottom: top + 23 };
        return bounds.left > 8 && bounds.right < width - 8 && bounds.top > 8 && bounds.bottom < height - 8 &&
          !protectedAreas.some(area => overlaps(bounds, area)) && !placed.some(area => overlaps(bounds, area));
      });
      if (!position) continue;
      placed.push({ left: position.left - 7, top: position.top - 5,
        right: position.left + textWidth + 7, bottom: position.top + 23 });
      const labelY = position.top + 9;
      ctx.strokeStyle = `rgba(198,202,207,${(.35 * alpha).toFixed(3)})`;
      ctx.lineWidth = .8;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(position.left > point.x ? position.left - 5 : position.left + textWidth + 5, labelY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.5 + alpha, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.strokeStyle = `rgba(10,10,11,${(.95 * alpha).toFixed(3)})`;
      ctx.strokeText(word, position.left, labelY);
      ctx.fillStyle = `rgba(198,202,207,${alpha.toFixed(3)})`;
      ctx.fillText(word, position.left, labelY);
    }
  }
  let width = 0, height = 0, frame = 0, elapsed = 0, previousTime = 0;
  let steerX = 0, steerY = 0, inView = true;

  function draw(time: number, delta = 16) {
    if (!width || !height) return;
    const still = motion.matches;
    const clock = still ? 0 : time;
    const ease = 1 - Math.exp(-delta / 170);
    const targetX = pointer.active && !still ? pointer.x / width - .5 : 0;
    const targetY = pointer.active && !still ? pointer.y / height - .5 : 0;
    steerX += (targetX - steerX) * ease;
    steerY += (targetY - steerY) * ease;
    const yaw = .35 + clock * .000035 + steerX * .3;
    const pitch = -.18 + Math.sin(clock * .00012) * .12 + steerY * .22;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
    const small = width < 768;
    const radius = Math.min(width * (small ? .82 : .43), height * .46);
    const centerX = width * (small ? .88 : .76), centerY = height * (small ? .31 : .4);
    const influenceRadius = small ? 140 : 200;

    vertices.forEach(([vx,vy,vz], index) => {
      const breath = 1 + .045 * Math.sin(clock * .00035 + index * 1.73);
      const x = (vx * cy + vz * sy) * breath;
      const yz = -vx * sy + vz * cy;
      const y = (vy * cx - yz * sx) * breath;
      const z = (vy * sx + yz * cx) * breath;
      const perspective = 3.6 / (3.6 - z);
      const baseX = centerX + x * radius * perspective;
      const baseY = centerY + y * radius * perspective;
      const point = points[index]!;
      const dx = baseX - pointer.x, dy = baseY - pointer.y;
      const distance = Math.hypot(dx,dy);
      const influence = pointer.active && !still ? Math.max(0, 1 - distance / influenceRadius) ** 2 : 0;
      const force = influence * 65;
      point.dx += ((dx / Math.max(1,distance)) * force - point.dx) * ease;
      point.dy += ((dy / Math.max(1,distance)) * force - point.dy) * ease;
      point.x = baseX + point.dx;
      point.y = baseY + point.dy;
      point.depth = (z + 1.1) / 2.2;
      point.light = influence;
    });

    ctx.clearRect(0,0,width,height);
    ctx.lineWidth = .75;
    for (const [a,b] of edges) {
      const first = points[a]!, second = points[b]!;
      const depth = (first.depth + second.depth) / 2;
      const highlight = Math.max(first.light,second.light);
      const alpha = .04 + depth * .20 + highlight * .24;
      ctx.strokeStyle = `rgba(226,230,231,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.moveTo(first.x,first.y);
      ctx.lineTo(second.x,second.y);
      ctx.stroke();
    }
    for (const point of points) {
      ctx.fillStyle = point.light > .15 ? `rgba(198,202,207,${(.25 + point.light * .5).toFixed(3)})` :
        `rgba(236,236,241,${(.06 + point.depth * .24).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(point.x,point.y,.65 + point.light * .85,0,Math.PI * 2);
      ctx.fill();
    }
    drawKeywords(still, delta);
  }

  function tick(time: number) {
    frame = 0;
    if (document.hidden || !inView || motion.matches) return;
    const delta = previousTime ? Math.min(40, time - previousTime) : 16;
    previousTime = time;
    elapsed += delta;
    draw(elapsed,delta);
    frame = requestAnimationFrame(tick);
  }

  function synchronize() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    if (document.hidden || !inView) return;
    if (motion.matches) {
      steerX = steerY = 0;
      points.forEach(point => { point.dx = point.dy = 0; });
      draw(0);
    } else frame = requestAnimationFrame(tick);
  }

  function resize() {
    const bounds = hero.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    protectedAreas = [...hero.querySelectorAll<HTMLElement>('h1, .home-introduction, .hero-explore')].map(element => {
      const area = element.getBoundingClientRect();
      return { left: area.left - bounds.left - 12, top: area.top - bounds.top - 12,
        right: area.right - bounds.left + 12, bottom: area.bottom - bounds.top + 12 };
    });
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    ctx.setTransform(scale,0,0,scale,0,0);
    draw(elapsed);
    synchronize();
  }

  hero.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = !(event.target instanceof Element && event.target.closest('h1, .home-introduction, .hero-explore'));
    if (motion.matches) draw(0);
  }, { passive: true });
  const release = () => {
    pointer.active = false;
    if (motion.matches) draw(0);
  };
  hero.addEventListener('pointerleave', release);
  hero.addEventListener('pointercancel', release);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => { release(); synchronize(); });
  motion.addEventListener('change', () => { release(); synchronize(); });
  new ResizeObserver(resize).observe(hero);
  new IntersectionObserver(entries => {
    inView = entries[0]?.isIntersecting ?? false;
    if (!inView) release();
    synchronize();
  }, { threshold: 0 }).observe(hero);
  resize();
}

document.querySelectorAll<HTMLCanvasElement>('[data-thought-mesh]').forEach(initialize);
