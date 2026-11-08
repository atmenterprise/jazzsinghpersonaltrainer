export function projectAssetUrl(value, domain) {
  if (!value) return '';
  try { return new URL(value.startsWith('/') || /^https:/.test(value) ? value : `/${value}`, domain).href; }
  catch { return ''; }
}
