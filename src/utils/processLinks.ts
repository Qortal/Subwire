/**
 * Post-processes an HTML string (already rendered from Markdown) to make
 * bare URLs clickable without double-processing URLs that marked already
 * wrapped in <a href="..."> tags.
 *
 * Strategy:
 *  1. Split the HTML on existing tags so we only scan text nodes.
 *  2. In each text node, find bare qortal:// and http(s):// URLs and replace
 *     them with <a> tags that carry the appropriate data attributes.
 *  3. For qortal:// links we use data-qortal-href so the click handler in
 *     ArticlePage can call qortalRequest instead of navigating the browser.
 *  4. For http/https links we emit a normal <a target="_blank"> anchor.
 */

// Matches bare qortal:// or http(s):// URLs in plain text.
// The negative lookbehind prevents matching URLs that are already inside
// an HTML attribute value (href="..." or src="...").
const BARE_URL_REGEX =
  /(?<!['"=])(qortal:\/\/[^\s<>"']+|https?:\/\/[^\s<>"']+)/g;

export function processLinks(html: string): string {
  // Split on HTML tags so we can identify text nodes vs tag content.
  // The capturing group keeps the delimiters in the resulting array.
  const parts = html.split(/(<[^>]*>)/);

  return parts
    .map((part) => {
      // If the part looks like an HTML tag, leave it untouched.
      if (part.startsWith('<')) return part;

      // It's a text node — replace bare URLs.
      return part.replace(BARE_URL_REGEX, (url) => {
        // Strip trailing punctuation that is likely not part of the URL
        // (e.g. a period or comma at the end of a sentence).
        const trailingPunct = url.match(/[.,;:!?)"'\]]+$/)?.[0] ?? '';
        const cleanUrl = trailingPunct
          ? url.slice(0, url.length - trailingPunct.length)
          : url;

        if (cleanUrl.startsWith('qortal://')) {
          return (
            `<a class="qortal-link" data-qortal-href="${cleanUrl}" ` +
            `style="cursor:pointer;">${cleanUrl}</a>${trailingPunct}`
          );
        }

        return (
          `<a class="external-link" href="${cleanUrl}" ` +
          `target="_blank" rel="noopener noreferrer">${cleanUrl}</a>${trailingPunct}`
        );
      });
    })
    .join('');
}
