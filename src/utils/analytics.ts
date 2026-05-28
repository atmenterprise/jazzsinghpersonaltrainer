// src/utils/analytics.ts

// Declare global types for Google Analytics window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Load Measurement ID from Environment or default to a demo tracker to prevent crashes
export const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || "";

/**
 * Initializes Google Analytics by dynamically injecting standard scripts in the head tag.
 */
export const initGA = () => {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) {
    console.log("[Google Analytics] Bypassed initialization (No Measurement ID defined in VITE_GA_MEASUREMENT_ID).");
    return;
  }

  // Avoid duplicate tags
  if (document.getElementById("google-analytics-script")) return;

  try {
    // 1. Create and inject external Google tag script
    const script = document.createElement("script");
    script.async = true;
    script.id = "google-analytics-script";
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // 2. Setup gtag proxy call and dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };

    // 3. Setup standard config variables
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: window.location.pathname + window.location.search,
      anonymize_ip: true,
    });

    console.log(`[Google Analytics] Loaded and tracking actively with ID: ${GA_MEASUREMENT_ID}`);
  } catch (err) {
    console.error("[Google Analytics] Setup crashed:", err);
  }
};

/**
 * Tracks a custom event in Google Analytics.
 * @param action Standard or custom event action name
 * @param category Broad grouping class (e.g. Lead, Navigate, click)
 * @param label Human-readable identifier for details
 * @param value Integer value if applicable
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    console.debug(`[Analytics Event Log] action: "${action}" | category: "${category}" | label: "${label || "none"}"`);
  }
};

/**
 * Page view tracking for SPAs / single site section anchor clicks
 * @param path the path or hash section navigated to (e.g., "#book", "#results")
 */
export const trackSectionView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: window.location.pathname + path,
      page_title: `Section: ${path.replace("#", "").toUpperCase()}`,
    });
  } else {
    console.debug(`[Analytics View Log] Section: ${path}`);
  }
};
