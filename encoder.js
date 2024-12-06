function convertUrls() {
  const input = document.getElementById("inputUrls").value.trim();
  const format = document.getElementById("formatSelect").value;

  if (!input) {
    alert("Please enter at least one URL or IP.");
    return;
  }

  const urls = input.split("\n"); // Dividir las URLs/IPs por líneas
  const convertedUrls = urls.map((entry) => {
    // Detectar si es una IP (números separados por puntos)
    const ipRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
    if (ipRegex.test(entry.trim())) {
      return entry.replace(/\./g, "[.]");
    }

    // Aplicar formatos para URLs
    switch (format) {
      case "hxxp":
        return entry.replace("http", "hxxp").replace(/\./g, "[.]");
      case "punto":
        return entry.replace(/\./g, "[punto]");
      case "dot":
        return entry.replace(/\./g, " [dot] ");
      case "spaces":
        return entry.split("").join(" ");
      case "simple":
        return entry
          .replace("https://", "")
          .replace("http://", "")
          .replace(/\./g, " punto ");
      default:
        return entry; // Por si no se selecciona formato válido
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
