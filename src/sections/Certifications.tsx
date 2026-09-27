import { certifications } from '../content';
import { Heading, Reveal } from '../components/Section';

/** Certifications as a small, sortable-looking dataset — records, not badges. */
export function Certifications() {
  return (
    <section id="certifications" className="section" aria-labelledby="cert-title">
      <div className="wrap">
        <Heading id="cert-title" index="06" kicker="Certifications" title={<>The record, <em>as documented.</em></>} />
        <Reveal variant="wipe" className="records">
          <div className="records-bar" aria-hidden="true">
            <span>certifications.csv</span>
            <span>{certifications.length} rows</span>
          </div>
          <table>
            <caption className="sr-only">Certifications</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Certification</th>
                <th scope="col">Issuer</th>
                <th scope="col">Year</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((c, i) => (
                <tr key={c.name} style={{ ['--i' as string]: i }}>
                  <td className="r-i">{String(i + 1).padStart(2, '0')}</td>
                  <td className="r-name">{c.name}</td>
                  <td className="r-issuer">{c.issuer ?? <span className="r-null">—</span>}</td>
                  <td className="r-year">{c.year ?? <span className="r-null">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
