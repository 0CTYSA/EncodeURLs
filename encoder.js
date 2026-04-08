/**
 * convertUrls()
 *
 * Main obfuscation function. Reads the user's input text, the chosen
 * obfuscation format, and the processing mode, then writes the obfuscated
 * result to the output textarea.
 *
 * Supported formats (formatSelect):
 *   "hxxp"   → hxxp://example[.]com  / hxxps://example[.]com
 *   "hxxps"  → hxxp[:]//example[.]com / hxxps[:]//example[.]com
 *   "dot"    → example [dot] com
 *   "spaces" → e x a m p l e . c o m
 *
 * Supported modes (radio buttons):
 *   "urlsOnly"  – extract only URLs/domains/IPs, deduplicate, then obfuscate
 *   "textMode"  – replace every URL/domain/IP inline while keeping the rest
 *                 of the original text intact
 */
function convertUrls() {
  const input = document.getElementById("inputUrls").value.trim();
  const format = document.getElementById("formatSelect").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (!input) {
    alert("Please enter some text or URLs.");
    return;
  }

  // --- Regular expressions used to detect the three entity types ---

  // Full URLs starting with http:// or https://, including IP-based URLs.
  const urlRegex =
    /(https?:\/\/[^\s.,]+(?:\.[^\s.,]+)*|\bhttps?:\/\/\d{1,3}(\.\d{1,3}){3}\b)/g;

  // Bare domain names without a protocol prefix (e.g. "example.com").
  const domainRegex =
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b(?!\.)/g;

  // Standalone IPv4 addresses (e.g. "192.168.1.1").
  const ipRegex = /\b\d{1,3}(\.\d{1,3}){3}\b/g;

  /**
   * formatEntry(entry, format)
   *
   * Applies the selected obfuscation format to a single URL, domain, or IP.
   *
   * @param {string} entry  - The raw URL, domain, or IP to obfuscate.
   * @param {string} format - One of "hxxp", "hxxps", "dot", or "spaces".
   * @returns {string} The obfuscated string.
   */
  const formatEntry = (entry, format) => {
    // Re-test against ipRegex to determine if the entry is a bare IP address.
    const isIP = ipRegex.test(entry);
    const hasHttp = entry.startsWith("http://");
    const hasHttps = entry.startsWith("https://");

    // Bare IP addresses (no protocol) always get dots replaced with "[.]"
    // regardless of the chosen format.
    if (isIP && !hasHttp && !hasHttps) {
      return entry.replace(/\./g, "[.]");
    }

    switch (format) {
      // "hxxp" format: replace the protocol scheme and bracket every dot.
      case "hxxp":
        if (hasHttp)
          return entry.replace("http://", "hxxp://").replace(/\./g, "[.]");
        if (hasHttps)
          return entry.replace("https://", "hxxps://").replace(/\./g, "[.]");
        // Bare domain with no protocol – prepend hxxp:// and bracket dots.
        return `hxxp://${entry.replace(/\./g, "[.]")}`;

      // "hxxps" format: additionally bracket the colon in the scheme separator.
      case "hxxps":
        if (hasHttp)
          return entry.replace("http://", "hxxp[:]//").replace(/\./g, "[.]");
        if (hasHttps)
          return entry.replace("https://", "hxxps[:]//").replace(/\./g, "[.]");
        // Bare domain – prepend hxxp[:]// and bracket dots.
        return `hxxp[:]//${entry.replace(/\./g, "[.]")}`;

      // "dot" format: replace every literal dot with the word " [dot] ".
      case "dot":
        if (hasHttp || hasHttps) return entry.replace(/\./g, " [dot] ");
        // Bare domain – prepend http:// so it looks like a valid URL.
        return `http://${entry.replace(/\./g, " [dot] ")}`;

      // "spaces" format: insert a space between every single character.
      case "spaces":
        return entry.split("").join(" ");
    }
  };

  let result;

  if (mode === "urlsOnly") {
    // --- URLs-only mode ---
    // Extract all URLs, domains, and IPs from the input, deduplicate them
    // (using the URL without its protocol prefix as the dedup key), and
    // output only the obfuscated entries – one per line.

    const extracted = new Set();   // Stores the final obfuscated strings.
    const standardized = new Set(); // Tracks base URLs/domains/IPs already seen.
    const lines = input.split("\n");

    lines.forEach((line) => {
      // 1. Full URLs (highest priority – processed before bare domains/IPs).
      const urls = line.match(urlRegex) || [];
      urls.forEach((url) => {
        // Strip the protocol prefix to get a normalised key for deduplication.
        const baseUrl = url.replace(/https?:\/\//, "");
        if (!standardized.has(baseUrl)) {
          standardized.add(baseUrl);
          extracted.add(formatEntry(url, format));
        }
      });

      // 2. Bare domains (only if not already captured as part of a full URL).
      const domains = line.match(domainRegex) || [];
      domains.forEach((domain) => {
        if (!standardized.has(domain)) {
          standardized.add(domain);
          extracted.add(formatEntry(domain, format));
        }
      });

      // 3. Standalone IP addresses.
      const ips = line.match(ipRegex) || [];
      ips.forEach((ip) => {
        if (!standardized.has(ip)) {
          standardized.add(ip);
          extracted.add(formatEntry(ip, format));
        }
      });
    });

    result = Array.from(extracted).join("\n");

  } else if (mode === "textMode") {
    // --- Full-text mode ---
    // Replace every URL, domain, and IP in-place inside the original text,
    // leaving surrounding non-URL content untouched.
    result = input
      .replace(urlRegex, (match) => formatEntry(match, format))
      .replace(domainRegex, (match) => formatEntry(match, format))
      .replace(ipRegex, (match) => formatEntry(match, format));
  }

  document.getElementById("result").value = result;
}

/**
 * copyToClipboard()
 *
 * Selects the obfuscated result textarea and copies its contents to the
 * system clipboard using the legacy execCommand API.
 */
function copyToClipboard() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("Processed text copied to the clipboard.");
}
