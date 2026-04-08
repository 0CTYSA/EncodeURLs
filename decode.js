// decode.js

/**
 * decodeUrls()
 *
 * Main decoding function. Reads an obfuscated URL (or block of URLs) from
 * the input textarea, reverses common obfuscation techniques, and writes
 * the plain result to the output textarea.
 *
 * Handled obfuscation patterns:
 *   hxxp://   → http://
 *   hxxps://  → https://
 *   hxxp[:]// → http://
 *   hxxps[:]//→ https://
 *   [.]       → .
 *    [dot]    → .   (with surrounding spaces)
 *   spaced characters (e x a m p l e) → collapsed back (example)
 *
 * Input validation: if the input already looks like a normal http(s):// URL,
 * the user is warned rather than running the decode logic unnecessarily.
 */
function decodeUrls() {
  const input = document.getElementById("decodeInput").value.trim();
  if (!input) {
    alert("Please enter some obfuscated URLs to decode.");
    return;
  }

  // Guard against double-decoding: if the input already contains a standard
  // http(s):// scheme it is most likely already decoded.
  const normalUrlRegex = /https?:\/\//;
  if (normalUrlRegex.test(input)) {
    alert("The URL appears to be already in its normal format.");
    return;
  }

  let decoded = input
    // Reverse "hxxp://" → "http://"
    .replace(/hxxp:\/\//g, "http://")
    // Reverse "hxxps://" → "https://"
    .replace(/hxxps:\/\//g, "https://")
    // Reverse "hxxp[:]// " → "http://"
    .replace(/hxxp\[:\]\/\//g, "http://")
    // Reverse "hxxps[:]// " → "https://"
    .replace(/hxxps\[:\]\/\//g, "https://")
    // Reverse bracketed dots "[.]" → "."
    .replace(/\[\.\]/g, ".")
    // Reverse word-style dots " [dot] " → "."
    .replace(/\s\[dot\]\s/g, ".");

  // Reverse the "spaces" format: collapse pairs of word characters separated
  // by a single space (e.g. "e x a m p l e" → "example").
  decoded = decoded.replace(/(\w) (\w)/g, "$1$2");

  document.getElementById("decodeResult").value = decoded;
}

/**
 * clearDecodeFields()
 *
 * Clears both the obfuscated-input and decoded-result textareas in the
 * Decoder section.
 */
function clearDecodeFields() {
  document.getElementById("decodeInput").value = "";
  document.getElementById("decodeResult").value = "";
}

/**
 * copyDecodedToClipboard()
 *
 * Copies the decoded result to the system clipboard.
 * Shows an alert if the result textarea is empty.
 */
function copyDecodedToClipboard() {
  const result = document.getElementById("decodeResult");
  if (!result.value) {
    alert("No decoded text to copy.");
    return;
  }
  result.select();
  document.execCommand("copy");
  alert("Decoded text copied to the clipboard.");
}
