import React, { useState } from 'react';
import { projectAssetUrl, projectAssetFallback } from './projectAssets';

export default function AdminImage({ value, domain, alt = '', ...props }) {
  const source = projectAssetUrl(value, domain);
  const fallback = projectAssetFallback(value);
  return <PreviewImage key={`${source}|${fallback}`} source={source} fallback={fallback} alt={alt} {...props} />;
}

function PreviewImage({ source, fallback, alt, ...props }) {
  const [attempt, setAttempt] = useState(0);
  if (!source || attempt === 2) return <div className="admin-image-unavailable" role="img" aria-label={alt ? `${alt} — image unavailable` : 'Image unavailable'}><span aria-hidden="true">▧</span><small>Image unavailable</small></div>;
  return <img {...props} src={attempt === 1 ? fallback : source} alt={alt} referrerPolicy="no-referrer" onError={() => setAttempt(current => current === 0 && fallback ? 1 : 2)} />;
}
