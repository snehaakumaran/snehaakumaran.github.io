import { links, profile } from '../content';
import { Magnetic } from '../components/Magnetic';
import { Reveal } from '../components/Section';

export function Contact() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="kicker">
          <span className="kicker-index">07</span>
          <span className="kicker-bar" aria-hidden="true" />
          Contact
        </p>
        <h2 id="contact-title" className="contact-title">
          <span>Let’s turn</span> <span>data into</span> <em>insight.</em>
        </h2>
        <Reveal className="contact-row">
          <Magnetic className="btn btn-solid btn-lg" href={links.linkedin} target="_blank" rel="noreferrer">
            View LinkedIn <span aria-hidden="true">↗</span>
          </Magnetic>
          {links.email && (
            <Magnetic className="btn btn-line btn-lg" href={`mailto:${links.email}`}>
              Email
            </Magnetic>
          )}
          {links.github && (
            <Magnetic className="btn btn-line btn-lg" href={links.github} target="_blank" rel="noreferrer">
              GitHub ↗
            </Magnetic>
          )}
          {links.tableau && (
            <Magnetic className="btn btn-line btn-lg" href={links.tableau} target="_blank" rel="noreferrer">
              Tableau Public ↗
            </Magnetic>
          )}
          <p className="contact-note">LinkedIn is the best way to reach Sneha. Her dashboards are on Tableau Public.</p>
        </Reveal>
      </div>
      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span>{profile.location}</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </section>
  );
}
