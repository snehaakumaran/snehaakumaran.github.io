import { lazy, Suspense, useEffect, useState } from 'react';
import { detectTier, prefersReducedMotion, type Tier } from './lib/device';
import { lab, startLab } from './lib/lab';
import { Nav } from './components/Nav';
import { LabHud } from './components/LabHud';
import { Hero } from './sections/Hero';
import { DataProfile } from './sections/DataProfile';
import { Pipeline } from './sections/Pipeline';
import { ProjectUniverse } from './sections/ProjectUniverse';
import { BIDashboards } from './sections/BIDashboards';
import { MLLab } from './sections/MLLab';
import { Ticketing } from './sections/Ticketing';
import { DataStack } from './sections/DataStack';
import { Academic } from './sections/Academic';
import { Certifications } from './sections/Certifications';
import { Contact } from './sections/Contact';
import { ProjectModal } from './components/ProjectModal';
import { VizViewer } from './components/VizViewer';
import { ProjectsProvider } from './components/projectsContext';

// three.js + react-three-fiber load as a separate chunk, only when WebGL works.
const DataLab = lazy(() => import('./scene/DataLab'));

export default function App() {
  const [tier] = useState<Tier>(() => detectTier());
  const [calm, setCalm] = useState(() => prefersReducedMotion());
  const [ready, setReady] = useState(false);

  useEffect(() => startLab(), []);
  useEffect(() => {
    lab.reducedMotion = calm;
    document.documentElement.classList.toggle('calm', calm);
  }, [calm]);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setCalm(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <ProjectsProvider>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className={`backdrop ${ready ? 'is-ready' : ''}`} aria-hidden="true">
        <div className="backdrop-grid" />
        <div className="backdrop-glow" />
        {tier !== 'none' && (
          <Suspense fallback={null}>
            <DataLab tier={tier} onReady={() => setReady(true)} />
          </Suspense>
        )}
        <div className="backdrop-veil" />
      </div>
      <Nav calm={calm} onToggleCalm={() => setCalm((c) => !c)} />
      <LabHud webgl={tier !== 'none'} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <DataProfile />
        <Pipeline />
        <ProjectUniverse />
        <BIDashboards />
        <MLLab />
        <Ticketing />
        <DataStack />
        <Academic />
        <Certifications />
        <Contact />
      </main>
      <ProjectModal />
      <VizViewer />
    </ProjectsProvider>
  );
}
