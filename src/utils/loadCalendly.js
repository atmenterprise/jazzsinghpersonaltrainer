let pendingLoad;

export function loadCalendly() {
  if (window.Calendly?.initInlineWidget) return Promise.resolve(window.Calendly);
  if (pendingLoad) return pendingLoad;

  pendingLoad = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendlyLoader = 'true';
    const fail = () => {
      script.remove();
      pendingLoad = undefined;
      reject(new Error('Calendly could not be loaded.'));
    };
    script.onload = () => window.Calendly?.initInlineWidget ? resolve(window.Calendly) : fail();
    script.onerror = fail;
    document.body.appendChild(script);
  });
  return pendingLoad;
}
