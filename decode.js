// decode.js
function decodeUrls() {
  const input = document.getElementById("decodeInput").value.trim();
  if (!input) {
    alert("Please enter some obfuscated URLs to decode.");
    return;
  }

  // Check if the input is already a normal URL
  const normalUrlRegex = /https?:\/\//;
  if (normalUrlRegex.test(input)) {
    alert("The URL appears to be already in its normal format.");
    return;
  }

  let decoded = input
    .replace(/hxxp:\/\//g, "http://")
    .replace(/hxxps:\/\//g, "https://")
    .replace(/hxxp\[:\]\/\//g, "http://")
    .replace(/hxxps\[:\]\/\//g, "https://")
    .replace(/\[\.\]/g, ".")
    .replace(/\s\[dot\]\s/g, ".");

  // Handle 'spaces' format (e x a m p l e . c o m)
  decoded = decoded.replace(/(\w) (\w)/g, "$1$2");

  document.getElementById("decodeResult").value = decoded;
}

function clearDecodeFields() {
  document.getElementById("decodeInput").value = "";
  document.getElementById("decodeResult").value = "";
}

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
