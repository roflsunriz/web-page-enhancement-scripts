/* Decoy asset for ad-blocker detection — see lib/ads/adblock.ts.
 * Never loaded as a script; it is fetched, and only its marker is read.
 * The path is the point: filter lists cancel requests that look like this one. */
window.__ad_probe_ok__ = true;
