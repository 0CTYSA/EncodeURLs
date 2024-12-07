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
    // Usar un conjunto (Set) para evitar duplicados
    const extracted = new Set();
    const lines = input.split("\n");

    // Extraer elementos únicos en orden: URLs > Dominios > IPs
    lines.forEach((line) => {
      const urls = line.match(urlRegex) || [];
      urls.forEach((url) => extracted.add(url));

      const domains = line.match(domainRegex) || [];
      domains.forEach((domain) => {
        // Agregar dominio solo si no está dentro de una URL completa
        if (![...extracted].some((url) => url.includes(domain))) {
          extracted.add(domain);
        }
      });

      const ips = line.match(ipRegex) || [];
      ips.forEach((ip) => {
        // Agregar IP solo si no está contenida en una URL
        if (![...extracted].some((url) => url.includes(ip))) {
          extracted.add(ip);
        }
      });
    });

    // Formatear elementos únicos extraídos
    result = Array.from(extracted) // Convertir Set a Array
      .map((entry) => formatEntry(entry, format)) // Formatear cada entrada
      .join("\n");
  } else if (mode === "textMode") {
    // Procesar texto completo, reemplazando coincidencias únicas
    const processedText = new Set(); // Set para evitar duplicados en texto procesado
    result = input
      .replace(urlRegex, (match) => {
        if (!processedText.has(match)) {
          processedText.add(match);
          return formatEntry(match, format);
        }
        return match;
      })
      .replace(domainRegex, (match) => {
        if (!processedText.has(match)) {
          processedText.add(match);
          return formatEntry(match, format);
        }
        return match;
      })
      .replace(ipRegex, (match) => {
        if (!processedText.has(match)) {
          processedText.add(match);
          return formatEntry(match, format);
        }
        return match;
      });
  }

  document.getElementById("result").value = result;
}

function copyToClipboard() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("Processed text copied to the clipboard.");
}
