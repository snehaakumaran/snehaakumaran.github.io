import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { lab, SECTION_SCENE } from '../lib/lab';
import { tierSettings, type Tier } from '../lib/device';
import { cubeLines, dashboard, model, network, pipeline, rawData, rng, surface, tables, universe } from './states';

const vert = /* glsl */ `
uniform float uA;
uniform float uB;
uniform float uMix;
uniform float uTime;
uniform float uPix;
uniform float uVel;
attribute vec3 p1;
attribute vec3 p2;
attribute vec3 p3;
attribute vec3 p4;
attribute vec3 p5;
attribute vec3 p6;
attribute vec3 p7;
attribute float aSeed;
attribute float aFlow;
varying float vSeed;
varying float vDepth;
varying float vH;

float w(float k){
  return (1.0 - step(0.5, abs(uA - k))) * (1.0 - uMix) + (1.0 - step(0.5, abs(uB - k))) * uMix;
}

void main(){
  // Pipeline: stream points travel left → right through the stages.
  vec3 q2 = p2;
  if (aFlow > 0.5) {
    q2.x = mod(p2.x + 4.0 + uTime * (0.35 + aSeed * 0.25), 8.0) - 4.0;
    q2.y += sin(q2.x * 1.6 + uTime) * 0.06;
  }
  // Insight surface: a gently moving fitted surface.
  vec3 q7 = p7;
  q7.y = 0.42 * sin(1.15 * q7.x + uTime * 0.35) * cos(1.05 * q7.z + uTime * 0.27);

  vec3 p = position * w(0.0) + p1 * w(1.0) + q2 * w(2.0) + p3 * w(3.0)
         + p4 * w(4.0) + p5 * w(5.0) + p6 * w(6.0) + q7 * w(7.0);

  // Organic morph: points arc slightly while they travel between states.
  float arc = sin(uMix * 3.14159);
  vec3 dir = normalize(vec3(sin(aSeed * 40.0), cos(aSeed * 23.0), sin(aSeed * 17.0 + 1.0)));
  p += dir * arc * 0.35 * (0.3 + aSeed);
  // Scrolling adds a touch of turbulence.
  p += dir * sin(uTime * 3.0 + aSeed * 50.0) * uVel * 0.06;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.3 + aSeed * 1.8) * uPix * 16.0 / -mv.z;
  vSeed = aSeed;
  vDepth = -mv.z;
  vH = p.y;
}`;

const frag = /* glsl */ `
uniform float uDim;
varying float vSeed;
varying float vDepth;
varying float vH;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 indigo = vec3(0.45, 0.40, 1.00);
  vec3 cyan   = vec3(0.30, 0.85, 1.00);
  vec3 lav    = vec3(0.82, 0.68, 1.00);
  vec3 col = mix(indigo, cyan, smoothstep(0.25, 0.85, vSeed));
  col = mix(col, lav, step(0.9, vSeed) * 0.8);
  col += vec3(0.12) * smoothstep(0.6, 1.6, vH);
  float fade = smoothstep(16.0, 5.0, vDepth);
  float alpha = a * fade * (0.5 + vSeed * 0.5) * uDim;
  gl_FragColor = vec4(col * alpha, alpha);
}`;

const HOLD = 0.35;
const ease = (x: number) => x * x * (3 - 2 * x);
const travel = (f: number) => ease(Math.min(1, Math.max(0, (f - HOLD) / (1 - HOLD))));

function DataSystem({ count, narrow }: { count: number; narrow: number }) {
  const group = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const sEased = useRef(0);
  const yaw = useRef(0);
  const place = useMemo(() => ({ x: SECTION_SCENE[0].x, y: SECTION_SCENE[0].y, s: 1, dim: 1 }), []);

  const { geo, mat, cube, net, cubeMat, netMat } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const net = network(count);
    const pipe = pipeline(count);
    g.setAttribute('position', new THREE.BufferAttribute(rawData(count), 3));
    g.setAttribute('p1', new THREE.BufferAttribute(net.positions, 3));
    g.setAttribute('p2', new THREE.BufferAttribute(pipe.positions, 3));
    g.setAttribute('p3', new THREE.BufferAttribute(universe(count), 3));
    g.setAttribute('p4', new THREE.BufferAttribute(dashboard(count), 3));
    g.setAttribute('p5', new THREE.BufferAttribute(model(count), 3));
    g.setAttribute('p6', new THREE.BufferAttribute(tables(count), 3));
    g.setAttribute('p7', new THREE.BufferAttribute(surface(count), 3));
    const seed = new Float32Array(count);
    const r = rng(97);
    for (let i = 0; i < count; i++) seed[i] = r();
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    g.setAttribute('aFlow', new THREE.BufferAttribute(pipe.flow, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    const m = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uA: { value: 0 },
        uB: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uPix: { value: 1 },
        uVel: { value: 0 },
        uDim: { value: 1 },
      },
    });
    const cubeGeo = new THREE.BufferGeometry();
    cubeGeo.setAttribute('position', new THREE.BufferAttribute(cubeLines(), 3));
    const netGeo = new THREE.BufferGeometry();
    netGeo.setAttribute('position', new THREE.BufferAttribute(net.lines, 3));
    const cubeMat = new THREE.LineBasicMaterial({ color: '#8b7dff', transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
    const netMat = new THREE.LineBasicMaterial({ color: '#5cc8ff', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    return { geo: g, mat: m, cube: cubeGeo, net: netGeo, cubeMat, netMat };
  }, [count]);

  useFrame((state, dt) => {
    const rm = lab.reducedMotion;
    // Ease the scroll position so state changes glide rather than snap.
    sEased.current = THREE.MathUtils.damp(sEased.current, lab.section, rm ? 8 : 3, dt);
    const s = Math.min(SECTION_SCENE.length - 1, Math.max(0, sEased.current));
    const i = Math.min(SECTION_SCENE.length - 2, Math.floor(s));
    const f = travel(s - i);
    const A = SECTION_SCENE[i];
    const B = SECTION_SCENE[i + 1];
    const mix = A.state === B.state ? 0 : f;

    const u = mat.uniforms;
    u.uA.value = A.state;
    u.uB.value = B.state;
    u.uMix.value = mix;
    u.uTime.value = state.clock.elapsedTime * (rm ? 0.2 : 1);
    u.uVel.value = rm ? 0 : lab.velocity;
    u.uPix.value = gl.getPixelRatio() * (state.size.height / 900);
    lab.stateIndex = mix > 0.5 ? B.state : A.state;

    // Placement: where the structure sits relative to the copy.
    const tx = THREE.MathUtils.lerp(A.x, B.x, f) * narrow;
    const ty = THREE.MathUtils.lerp(A.y, B.y, f) + (narrow < 1 && s < 0.6 ? 1.6 : 0);
    const ts = THREE.MathUtils.lerp(A.scale, B.scale, f) * (narrow < 1 ? 0.72 : 1);
    const td = THREE.MathUtils.lerp(A.dim, B.dim, f) * (narrow < 1 ? 0.6 : 1) * (1 + lab.focus * 0.4);
    place.x = THREE.MathUtils.damp(place.x, tx, 3, dt);
    place.y = THREE.MathUtils.damp(place.y, ty, 3, dt);
    place.s = THREE.MathUtils.damp(place.s, ts, 3, dt);
    place.dim = THREE.MathUtils.damp(place.dim, td, 3, dt);
    u.uDim.value = place.dim;

    const g = group.current;
    if (!g) return;
    g.position.set(place.x, place.y, 0);
    g.scale.setScalar(place.s);
    const spin = THREE.MathUtils.lerp(A.spin, B.spin, f);
    yaw.current += dt * spin * 0.25 * (rm ? 0.1 : 1);
    g.rotation.y = yaw.current - 0.5 + lab.pointerX * 0.25;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.18 - lab.pointerY * 0.12, 2.5, dt);

    // Helper lines belong to specific states.
    const wState = (k: number) => (A.state === k ? 1 - mix : 0) + (B.state === k ? mix : 0);
    cubeMat.opacity = 0.45 * wState(0) * place.dim;
    netMat.opacity = 0.28 * wState(1) * place.dim;
  });

  return (
    <group ref={group}>
      <points geometry={geo} material={mat} frustumCulled={false} />
      <lineSegments geometry={cube} material={cubeMat} />
      <lineSegments geometry={net} material={netMat} />
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((_, dt) => {
    const tx = lab.reducedMotion ? 0 : lab.pointerX * 0.25;
    const ty = lab.reducedMotion ? 0 : lab.pointerY * 0.15;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Adaptive({ min, max }: { min: number; max: number }) {
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ t: 0, n: 0, dpr: Math.min(max, window.devicePixelRatio || 1) });
  useFrame((_, dt) => {
    const a = acc.current;
    a.t += dt;
    a.n++;
    if (a.t > 2) {
      if (a.n / a.t < 42 && a.dpr > min) setDpr((a.dpr = Math.max(min, a.dpr - 0.25)));
      a.t = 0;
      a.n = 0;
    }
  });
  return null;
}

function Scene({ tier }: { tier: Exclude<Tier, 'none'> }) {
  const size = useThree((s) => s.size);
  const aspect = size.width / Math.max(1, size.height);
  const narrow = aspect < 0.85 ? 0 : aspect < 1.3 ? 0.55 : 1;
  const cfg = tierSettings[tier];
  return (
    <>
      <Rig />
      <Adaptive min={1} max={cfg.dpr[1]} />
      <DataSystem count={cfg.points} narrow={narrow} />
    </>
  );
}

export default function DataLab({ tier, onReady }: { tier: Exclude<Tier, 'none'>; onReady: () => void }) {
  const cfg = tierSettings[tier];
  return (
    <Canvas
      className="lab-canvas"
      dpr={cfg.dpr}
      gl={{ antialias: cfg.antialias, alpha: true, powerPreference: 'high-performance', stencil: false }}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 0, 8] }}
      onCreated={() => requestAnimationFrame(onReady)}
      aria-hidden="true"
      tabIndex={-1}
    >
      <Scene tier={tier} />
    </Canvas>
  );
}
