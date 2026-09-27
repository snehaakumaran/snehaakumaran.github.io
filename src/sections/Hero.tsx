import { links, profile } from '../content';
import { Magnetic } from '../components/Magnetic';

export function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="hero-tag">
            <span className="dot" aria-hidden="true" />
            {profile.current.role} · {profile.current.org}
          </p>
          <h1 id="hero-title" className="hero-name">
            <span className="hero-first">{profile.first}</span>{' '}
            <span className="hero-last">{profile.last}</span>
          </h1>
          <p className="hero-role">{profile.role}</p>
          <p className="hero-statement">{profile.statement}</p>
          <ul className="hero-focus" aria-label="Focus areas">
            {profile.focus.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="hero-ctas">
            <Magnetic className="btn btn-solid" href="#projects">
              Explore the lab <span aria-hidden="true">↓</span>
            </Magnetic>
            <Magnetic className="btn btn-line" href={links.linkedin} target="_blank" rel="noreferrer">
              View LinkedIn <span aria-hidden="true">↗</span>
            </Magnetic>
            {links.github && (
              <Magnetic className="btn btn-line" href={links.github} target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </Magnetic>
            )}
          </div>
        </div>
        <ol className="hero-flow" aria-label="How the site is organised">
          {['Data', 'Analysis', 'Insight'].map((s, i) => (
            <li key={s}>
              <span className="hero-flow-i">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <a className="hero-scroll" href="#about" aria-label="Scroll to the data profile">
        <span aria-hidden="true" />
      </a>
    </section>
  );
}
