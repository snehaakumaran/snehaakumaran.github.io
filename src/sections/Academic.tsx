import { deansList, education, experience } from '../content';
import { Heading, Reveal } from '../components/Section';

const Y0 = 2018;
const Y1 = 2025;
const pct = (y: number) => ((y - Y0) / (Y1 - Y0)) * 100;

/** Academic foundation on a single time axis, running into the current role. */
export function Academic() {
  const [ms, bs] = education;
  const gra = experience[1];
  return (
    <section id="education" className="section" aria-labelledby="edu-title">
      <div className="wrap">
        <Heading id="edu-title" index="05" kicker="Academic foundation" title={<>George Mason, <em>twice over.</em></>} />

        <div className="edu-nodes">
          {[bs, ms].map((e, i) => (
            <Reveal key={e.degree} className="edu-node" variant="scale" delay={i * 100}>
              <p className="edu-degree">{e.degree}</p>
              <p className="edu-field">{e.field}</p>
              {'concentration' in e && e.concentration && <p className="edu-conc">Concentration · {e.concentration}</p>}
              <p className="edu-meta">
                {e.school} · {e.period}
              </p>
              {i === 0 && (
                <ul className="edu-honors" aria-label="Dean's List">
                  {deansList.map((d) => (
                    <li key={d.term}>Dean’s List · {d.term}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal variant="wipe" className="axis" >
          <div className="axis-line" aria-hidden="true" />
          <div className="axis-span axis-bs" style={{ left: `${pct(bs.start)}%`, width: `${pct(bs.end) - pct(bs.start)}%` }}>
            <span>B.S. Computational and Data Science</span>
          </div>
          <div className="axis-span axis-ms" style={{ left: `${pct(ms.start)}%`, width: `${pct(ms.end) - pct(ms.start)}%` }}>
            <span>M.S. Applied Information Technology</span>
          </div>
          <div className="axis-span axis-gra" style={{ left: `${pct(2023.6)}%`, width: `${pct(2023.95) - pct(2023.6)}%` }} title={`${gra.role} · ${gra.period}`}>
            <span className="sr-only">
              {gra.role}, {gra.period}
            </span>
          </div>
          <div className="axis-now" style={{ left: `${pct(2024.45)}%` }} title="Data Analyst · Clearpath Global · June 2024">
            <span className="sr-only">Joined Clearpath Global as a Data Analyst, June 2024</span>
          </div>
          {deansList.map((d) => (
            <span key={d.term} className="axis-honor" style={{ left: `${pct(d.at)}%` }} title={`Dean’s List · ${d.term}`}>
              <span className="sr-only">Dean’s List {d.term}</span>
            </span>
          ))}
          <ol className="axis-years" aria-hidden="true">
            {Array.from({ length: Y1 - Y0 + 1 }, (_, i) => Y0 + i).map((y) => (
              <li key={y} style={{ left: `${pct(y)}%` }}>
                {y}
              </li>
            ))}
          </ol>
          <p className="axis-legend">
            <span className="lg lg-honor" /> Dean’s List <span className="lg lg-gra" /> Graduate Research &amp; Teaching Assistant <span className="lg lg-now" /> Data Analyst · Clearpath Global
          </p>
        </Reveal>
      </div>
    </section>
  );
}
