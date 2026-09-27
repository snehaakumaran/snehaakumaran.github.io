import { useState } from 'react';
import { vizImageUrl, type Viz } from '../content';
import { KindGlyph } from './KindGlyph';

/**
 * Tableau's own static preview image of a published view — a still of the real
 * dashboard, never presented as the interactive version. When no usable preview
 * exists (or it fails to load) a plain title tile is shown instead of a blank box.
 */
export function VizPreview({ viz, eager = false }: { viz: Viz; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (viz.preview === false || failed) {
    return (
      <div className="viz-tile" aria-hidden="true">
        <KindGlyph kind="bi" size={26} />
        <span className="viz-tile-title">{viz.title}</span>
        <span className="viz-tile-note">Live dashboard · preview loads on open</span>
      </div>
    );
  }
  return (
    <img
      className="viz-img"
      src={vizImageUrl(viz)}
      alt={`Preview of the ${viz.title} dashboard`}
      width={viz.size[0]}
      height={viz.size[1]}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
