/**
 * Target layouts for the point system. Every layout uses the same N points,
 * so the scene can morph one dataset through each stage of the analytics
 * journey: raw data → network → pipeline → universe → dashboard → model →
 * tables → insight surface. All geometry is decorative and abstract.
 */

export function rng(seed = 1) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gauss(r: () => number) {
  const u = Math.max(1e-6, r());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r());
}

type V = [number, number, number];
const put = (a: Float32Array, i: number, v: V) => {
  a[i * 3] = v[0];
  a[i * 3 + 1] = v[1];
  a[i * 3 + 2] = v[2];
};

export const CUBE = 1.5;

/* 0 — RAW DATA: a correlated 3D scatter inside a measured cube */
export function rawData(n: number) {
  const r = rng(11);
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.56) {
      const x = (r() * 2 - 1) * 1.3;
      const z = (r() * 2 - 1) * 1.3;
      const y = Math.max(-1.4, Math.min(1.4, 0.55 * x + 0.22 * z + gauss(r) * 0.26));
      put(a, i, [x, y, z]);
    } else if (k < 0.8) {
      // floor grid
      const lines = 8;
      const along = (r() * 2 - 1) * CUBE;
      const at = (Math.floor(r() * (lines + 1)) / lines) * 2 * CUBE - CUBE;
      put(a, i, r() < 0.5 ? [along, -CUBE, at] : [at, -CUBE, along]);
    } else if (k < 0.93) {
      // distribution curve on the back wall
      const x = (r() * 2 - 1) * 1.4;
      put(a, i, [x, -1.3 + 2.3 * Math.exp((-x * x) / 0.32) + gauss(r) * 0.012, -CUBE]);
    } else {
      // regression line through the cloud
      const x = (r() * 2 - 1) * 1.35;
      put(a, i, [x, 0.55 * x + gauss(r) * 0.01, gauss(r) * 0.01]);
    }
  }
  return a;
}

/** Cube edges and back-wall grid for the raw-data state. */
export function cubeLines() {
  const c = CUBE;
  const v: number[] = [];
  const corners: V[] = [
    [-c, -c, -c], [c, -c, -c], [c, c, -c], [-c, c, -c],
    [-c, -c, c], [c, -c, c], [c, c, c], [-c, c, c],
  ];
  const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
  edges.forEach(([p, q]) => v.push(...corners[p], ...corners[q]));
  for (let k = 1; k < 6; k++) {
    const t = -c + (k / 6) * 2 * c;
    v.push(-c, t, -c, c, t, -c); // back wall horizontal
    v.push(t, -c, -c, t, c, -c); // back wall vertical
  }
  return new Float32Array(v);
}

/* 1 — CONNECTED NETWORK: clusters on a sphere joined by edges */
export function network(n: number) {
  const r = rng(23);
  const H = 34;
  const hubs: V[] = [];
  for (let h = 0; h < H; h++) {
    const y = 1 - (h / (H - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = h * 2.399963;
    const R = 1.75 + (r() - 0.5) * 0.35;
    hubs.push([Math.cos(th) * rad * R, y * R * 0.92, Math.sin(th) * rad * R]);
  }
  const edges: [number, number][] = [];
  hubs.forEach((p, i) => {
    const d = hubs
      .map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2] as const)
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1]);
    for (let k = 0; k < 2; k++) {
      const j = d[k][0];
      if (!edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) edges.push([i, j]);
    }
  });
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.6) {
      const h = hubs[Math.floor(r() * H)];
      const s = 0.07 + r() * 0.05;
      put(a, i, [h[0] + gauss(r) * s, h[1] + gauss(r) * s, h[2] + gauss(r) * s]);
    } else {
      const [p, q] = edges[Math.floor(r() * edges.length)];
      const t = r();
      const P = hubs[p];
      const Q = hubs[q];
      put(a, i, [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t, P[2] + (Q[2] - P[2]) * t]);
    }
  }
  const lines = new Float32Array(edges.length * 6);
  edges.forEach(([p, q], k) => {
    lines.set(hubs[p], k * 6);
    lines.set(hubs[q], k * 6 + 3);
  });
  return { positions: a, lines, hubs };
}

/* 2 — DATA PIPELINE: a stream through six stages (flow is animated in the shader) */
export const PIPE_STAGES = 6;
export function pipeline(n: number) {
  const r = rng(37);
  const a = new Float32Array(n * 3);
  const flow = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    if (r() < 0.72) {
      const x = (r() * 2 - 1) * 4;
      const ang = r() * Math.PI * 2;
      const rad = 0.1 + Math.abs(gauss(r)) * 0.14;
      put(a, i, [x, Math.cos(ang) * rad, Math.sin(ang) * rad]);
      flow[i] = 1;
    } else {
      const s = Math.floor(r() * PIPE_STAGES);
      const x = -3.6 + (s / (PIPE_STAGES - 1)) * 7.2;
      const ang = r() * Math.PI * 2;
      const rad = 0.42 + gauss(r) * 0.015;
      put(a, i, [x, Math.cos(ang) * rad, Math.sin(ang) * rad]);
    }
  }
  return { positions: a, flow };
}

/* 3 — PROJECT UNIVERSE: a core with three tilted orbits */
export function universe(n: number) {
  const r = rng(41);
  const a = new Float32Array(n * 3);
  const rings = [
    { R: 1.35, tilt: 0.35, yaw: 0 },
    { R: 2.05, tilt: -0.25, yaw: 1.1 },
    { R: 2.8, tilt: 0.15, yaw: 2.2 },
  ];
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.16) {
      const u = r() * Math.PI * 2;
      const v = Math.acos(2 * r() - 1);
      const R = 0.38 * Math.cbrt(r());
      put(a, i, [Math.sin(v) * Math.cos(u) * R, Math.cos(v) * R, Math.sin(v) * Math.sin(u) * R]);
    } else if (k < 0.82) {
      const ring = rings[Math.floor(r() * 3)];
      const t = r() * Math.PI * 2;
      const R = ring.R + gauss(r) * 0.03;
      let x = Math.cos(t) * R;
      let y = gauss(r) * 0.02;
      let z = Math.sin(t) * R * 0.95;
      const ct = Math.cos(ring.tilt), st = Math.sin(ring.tilt);
      [y, z] = [y * ct - z * st, y * st + z * ct];
      const cy = Math.cos(ring.yaw), sy = Math.sin(ring.yaw);
      [x, z] = [x * cy + z * sy, -x * sy + z * cy];
      put(a, i, [x, y, z]);
    } else {
      const u = r() * Math.PI * 2;
      const R = 1 + r() * 2.4;
      put(a, i, [Math.cos(u) * R, gauss(r) * 0.35, Math.sin(u) * R]);
    }
  }
  return a;
}

/* 4 — DASHBOARD: a 3D bar chart (heights are decorative, not data) */
export function dashboard(n: number) {
  const r = rng(53);
  const a = new Float32Array(n * 3);
  const cols = 6;
  const rows = 4;
  const sp = 0.52;
  const w = 0.3;
  const floor = -1.25;
  const heights: number[] = [];
  for (let b = 0; b < cols * rows; b++) {
    const c = b % cols;
    const row = Math.floor(b / cols);
    heights.push(0.35 + 1.9 * (0.5 + 0.5 * Math.sin(c * 0.9 + row * 1.3)) * (0.55 + 0.45 * (c / cols)));
  }
  for (let i = 0; i < n; i++) {
    if (r() < 0.1) {
      put(a, i, [(r() * 2 - 1) * sp * cols * 0.55, floor, (r() * 2 - 1) * sp * rows * 0.55]);
      continue;
    }
    const b = Math.floor(r() * cols * rows);
    const c = b % cols;
    const row = Math.floor(b / cols);
    const cx = (c - (cols - 1) / 2) * sp;
    const cz = (row - (rows - 1) / 2) * sp;
    const h = heights[b];
    // points on the bar surface
    const face = Math.floor(r() * 5);
    const u = (r() - 0.5) * w;
    const y = floor + r() * h;
    let p: V;
    if (face === 0) p = [cx - w / 2, y, cz + u];
    else if (face === 1) p = [cx + w / 2, y, cz + u];
    else if (face === 2) p = [cx + u, y, cz - w / 2];
    else if (face === 3) p = [cx + u, y, cz + w / 2];
    else p = [cx + u, floor + h, cz + (r() - 0.5) * w];
    put(a, i, p);
  }
  return a;
}

/* 5 — ANALYTICAL MODEL: dataset → features → model → prediction layers */
export function model(n: number) {
  const r = rng(67);
  const layers = [
    { x: -2.2, count: 7 },
    { x: -0.75, count: 9 },
    { x: 0.75, count: 9 },
    { x: 2.2, count: 3 },
  ];
  const nodes: V[][] = layers.map((L) =>
    Array.from({ length: L.count }, (_, k) => [L.x, (k - (L.count - 1) / 2) * 0.36, Math.sin(k * 1.7) * 0.25] as V),
  );
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.42) {
      const L = nodes[Math.floor(r() * nodes.length)];
      const p = L[Math.floor(r() * L.length)];
      put(a, i, [p[0] + gauss(r) * 0.045, p[1] + gauss(r) * 0.045, p[2] + gauss(r) * 0.045]);
    } else {
      const l = Math.floor(r() * (nodes.length - 1));
      const P = nodes[l][Math.floor(r() * nodes[l].length)];
      const Q = nodes[l + 1][Math.floor(r() * nodes[l + 1].length)];
      const t = r();
      put(a, i, [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t, P[2] + (Q[2] - P[2]) * t]);
    }
  }
  return a;
}

/* 6 — RELATIONAL TABLES: three entity tables and the relationships between them */
export function tables(n: number) {
  const r = rng(79);
  const slabs = [
    { c: [-1.7, 0.7, 0] as V, w: 1.3, h: 1.0 },
    { c: [1.5, 0.95, -0.5] as V, w: 1.3, h: 1.1 },
    { c: [0, -1.05, 0.4] as V, w: 1.5, h: 0.9 },
  ];
  const links: [V, V][] = [
    [[-1.05, 0.7, 0], [0.85, 0.95, -0.5]],
    [[-1.7, 0.2, 0], [-0.4, -0.6, 0.4]],
    [[1.5, 0.4, -0.5], [0.5, -0.6, 0.4]],
  ];
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    if (r() < 0.82) {
      const s = slabs[Math.floor(r() * slabs.length)];
      const rowsN = 6;
      const colsN = 4;
      if (r() < 0.55) {
        // row lines
        const row = Math.floor(r() * (rowsN + 1));
        put(a, i, [s.c[0] + (r() - 0.5) * s.w, s.c[1] + s.h / 2 - (row / rowsN) * s.h, s.c[2]]);
      } else {
        // column lines
        const col = Math.floor(r() * (colsN + 1));
        put(a, i, [s.c[0] - s.w / 2 + (col / colsN) * s.w, s.c[1] + (r() - 0.5) * s.h, s.c[2]]);
      }
    } else {
      const [P, Q] = links[Math.floor(r() * links.length)];
      const t = r();
      const bow = Math.sin(t * Math.PI) * 0.25;
      put(a, i, [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t + bow, P[2] + (Q[2] - P[2]) * t]);
    }
  }
  return a;
}

/* 7 — INSIGHT SURFACE: a smooth fitted surface (height is animated in the shader) */
export function surface(n: number) {
  const a = new Float32Array(n * 3);
  const side = Math.ceil(Math.sqrt(n));
  for (let i = 0; i < n; i++) {
    const gx = i % side;
    const gz = Math.floor(i / side);
    put(a, i, [(gx / (side - 1)) * 7 - 3.5, 0, (gz / (side - 1)) * 4.6 - 2.3]);
  }
  return a;
}
