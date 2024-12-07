function convertUrls() {
  const input = document.getElementById("inputUrls").value.trim();
  const format = document.getElementById("formatSelect").value;
  const mode = document.querySelector('input[name="mode"]:checked').value;

  if (!input) {
    alert("Please enter some text or URLs.");
    return;
  }

  // Expresiones regulares para identificar URLs, dominios e IPs
  const urlRegex =
    /(https?:\/\/[^\s.,]+(?:\.[^\s.,]+)*|\bhttps?:\/\/\d{1,3}(\.\d{1,3}){3}\b)/g; // URLs completas
  const domainRegex =
    /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b(?!\.)/g; // Dominios sin protocolo
  const ipRegex = /\b\d{1,3}(\.\d{1,3}){3}\b/g; // Direcciones IP independientes

  // Función para aplicar el formato deseado
  const formatEntry = (entry, format) => {
    const isIP = ipRegex.test(entry); // Detectar si es una IP
    const hasHttp = entry.startsWith("http://");
    const hasHttps = entry.startsWith("https://");

    if (isIP && !hasHttp && !hasHttps) {
      // Formatear IPs sin protocolo
      return entry.replace(/\./g, "[.]");
    }

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
        if (hasHttp || hasHttps) return entry.replace(/\./g, " [dot] ");
        return `http://${entry.replace(/\./g, " [dot] ")}`;

      case "spaces":
        return entry.split("").join(" ");
    }
  };

  let result;
  if (mode === "urlsOnly") {
    // Usar un conjunto (Set) para evitar duplicados exactos
    const extracted = new Set();
    const standardized = new Set(); // Set para entradas estandarizadas
    const lines = input.split("\n");

    // Extraer elementos únicos en orden: URLs > Dominios > IPs
    lines.forEach((line) => {
      const urls = line.match(urlRegex) || [];
      urls.forEach((url) => {
        const baseUrl = url.replace(/https?:\/\//, ""); // Eliminar prefijos
        if (!standardized.has(baseUrl)) {
          standardized.add(baseUrl);
          extracted.add(formatEntry(url, format));
        }
      });

      const domains = line.match(domainRegex) || [];
      domains.forEach((domain) => {
        if (!standardized.has(domain)) {
          standardized.add(domain);
          extracted.add(formatEntry(domain, format));
        }
      });

      const ips = line.match(ipRegex) || [];
      ips.forEach((ip) => {
        if (!standardized.has(ip)) {
          standardized.add(ip);
          extracted.add(formatEntry(ip, format));
        }
      });
    });

    // Combinar resultados sin procesar duplicados
    result = Array.from(extracted).join("\n");
  } else if (mode === "textMode") {
    // Procesar texto completo, reemplazando coincidencias únicas
    result = input
      .replace(urlRegex, (match) => formatEntry(match, format))
      .replace(domainRegex, (match) => formatEntry(match, format))
      .replace(ipRegex, (match) => formatEntry(match, format));
  }

  document.getElementById("result").value = result;
}

function copyToClipboard() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("Processed text copied to the clipboard.");
}
