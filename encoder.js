function convertUrls() {
  const input = document.getElementById("inputUrls").value.trim();
  const format = document.getElementById("formatSelect").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (!input) {
    alert("Please enter some text or URLs.");
    return;
  }

  // Expresiones regulares para identificar URLs, dominios e IPs
  const urlRegex = /(https?:\/\/[^\s]+)/g; // URLs con protocolo
  const domainRegex =
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/g; // Dominios sin protocolo
  const ipRegex = /\b\d{1,3}(\.\d{1,3}){3}\b/g; // Direcciones IP

  // Función para aplicar el formato deseado
  const formatEntry = (entry, format) => {
    const hasHttp = entry.startsWith("http://");
    const hasHttps = entry.startsWith("https://");

    switch (format) {
      case "hxxp":
        if (hasHttp)
          return entry.replace("http://", "hxxp://").replace(/\./g, "[.]");
        if (hasHttps)
          return entry.replace("https://", "hxxps://").replace(/\./g, "[.]");
        return `hxxp://${entry.replace(/\./g, "[.]")}`;

      case "hxxps":
        if (hasHttp)
          return entry.replace("http://", "hxxp[:]//").replace(/\./g, "[.]");
        if (hasHttps)
          return entry.replace("https://", "hxxps[:]//").replace(/\./g, "[.]");
        return `hxxp[:]//${entry.replace(/\./g, "[.]")}`;

      case "dot":
        return entry.replace(/\./g, " [dot] ");

      case "spaces":
        return entry.split("").join(" ");
    }
  };

  let result;
  if (mode === "urlsOnly") {
    // Procesar solo URLs/dominios/IPs
    const urls = input.split("\n");
    result = urls
      .map((entry) => {
        if (ipRegex.test(entry)) return entry.replace(/\./g, "[.]");
        if (urlRegex.test(entry) || domainRegex.test(entry))
          return formatEntry(entry, format);
        return entry; // Retornar el texto original si no cumple el formato
      })
      .join("\n");
  } else if (mode === "textMode") {
    // Procesar texto completo, identificando y ofuscando URLs/dominios/IPs
    result = input
      .replace(urlRegex, (match) => formatEntry(match, format)) // Reemplazar URLs
      .replace(domainRegex, (match) => formatEntry(match, format)) // Reemplazar dominios
      .replace(ipRegex, (match) => match.replace(/\./g, "[.]")); // Reemplazar IPs
  }

  document.getElementById("result").value = result;
}

function copyToClipboard() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("Processed text copied to the clipboard.");
}
