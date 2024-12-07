function convertUrls() {
  const input = document.getElementById("inputUrls").value.trim();
  const format = document.getElementById("formatSelect").value;

  if (!input) {
    alert("Please enter at least one URL or IP.");
    return;
  }

  const urls = input.split("\n"); // Dividir las URLs/IPs por líneas
  const convertedUrls = urls.map((entry) => {
    const trimmedEntry = entry.trim();

    // Detectar si es una IP (números separados por puntos)
    const ipRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
    if (ipRegex.test(trimmedEntry)) {
      return trimmedEntry.replace(/\./g, "[.]");
    }

    // Detectar si ya tiene un protocolo
    const hasHttp = trimmedEntry.startsWith("http://");
    const hasHttps = trimmedEntry.startsWith("https://");

    // Aplicar formatos según la opción seleccionada
    switch (format) {
      case "hxxp":
        if (!hasHttp && !hasHttps) {
          return `hxxp://${trimmedEntry.replace(/\./g, "[.]")}`;
        } else if (hasHttp) {
          return `hxxp://${trimmedEntry
            .replace("http://", "")
            .replace(/\./g, "[.]")}`;
        } else if (hasHttps) {
          return `hxxps://${trimmedEntry
            .replace("https://", "")
            .replace(/\./g, "[.]")}`;
        }
        break;

      case "hxxps":
        if (!hasHttp && !hasHttps) {
          return `hxxp[:]//${trimmedEntry.replace(/\./g, "[.]")}`;
        } else if (hasHttp) {
          return `hxxp[:]//${trimmedEntry
            .replace("http://", "")
            .replace(/\./g, "[.]")}`;
        } else if (hasHttps) {
          return `hxxps[:]//${trimmedEntry
            .replace("https://", "")
            .replace(/\./g, "[.]")}`;
        }
        break;

      case "dot":
        if (!hasHttp && !hasHttps) {
          return `${trimmedEntry.replace(/\./g, " [dot] ")}`;
        } else {
          return `${trimmedEntry.replace(/\./g, " [dot] ")}`;
        }
        break;

      case "spaces":
        if (!hasHttp && !hasHttps) {
          return trimmedEntry.split("").join(" ");
        } else {
          return trimmedEntry.split("").join(" ");
        }
        break;

      default:
        return trimmedEntry; // Por si no se selecciona formato válido
    }
  });

  document.getElementById("result").value = convertedUrls.join("\n");
}

function copyToClipboard() {
  const result = document.getElementById("result");
  result.select();
  document.execCommand("copy");
  alert("Obfuscated URLs and IPs copied to the clipboard.");
}
