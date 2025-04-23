# 🔀 URL Obfuscator & Decoder Tool

## 🌐 Overview

A dual-purpose web tool that provides:

- **Obfuscation**: Convert URLs/IPs into various security-safe formats
- **Decoding**: Reverse obfuscated URLs back to their original form

Perfect for security professionals, threat analysts, and IT teams who need to safely share potentially malicious links in reports or communications.

🔗 [URL and IP Obfuscator | Decode Obfuscated URLs](https://0ctysa.github.io/EncodeURLs/)

Access the live version of the tool to URL Obfuscator & Decoder Tool directly in your browser.

## ✨ Key Features

### 🔒 Obfuscator

- Multiple obfuscation formats:
  - `hxxp://example[.]com`
  - `hxxps[:]//example[.]com`
  - `example [dot] com`
  - `e x a m p l e . c o m` (spaced format)
- Two processing modes:
  - **URLs-only** (extracts and obfuscates just URLs/IPs)
  - **Full-text** (processes entire text while obfuscating detected URLs/IPs)
- Supports:
  - Full URLs (`http://`, `https://`)
  - Bare domains (`example.com`)
  - IP addresses (`192.168.1.1`)

### 🔓 Decoder

- Reverses common obfuscation techniques:
  - `hxxp` → `http`
  - `[.]` → `.`
  - `[dot]` → `.`
  - Removes spacing patterns
- Input validation to prevent double-decoding

## 🛠️ Technologies Used

- **Frontend**:
  - Bootstrap 5 (responsive design)
  - Vanilla JavaScript
- **Core Functionality**:
  - Regular expressions for pattern matching
  - Clipboard API for copy functionality
- **No backend required** (runs entirely in browser)

## 🚀 Usage Guide

### Obfuscation

1. Paste text/URLs in the left panel
2. Select obfuscation format
3. Choose processing mode:
   - **URLs-only**: Extracts and obfuscates just URLs/IPs
   - **Full-text**: Processes entire text while obfuscating detected URLs/IPs
4. Click "Convert"
5. Copy results with "Copy to Clipboard"

### Decoding

1. Paste obfuscated URLs in the right panel
2. Click "Decode"
3. Copy clean URLs with "Copy to Clipboard"

## 📂 File Structure

```/
├── index.html       # Main interface
├── encoder.js       # Obfuscation logic
├── decode.js        # Decoding logic
└── (styles.css)     # Optional custom styles
```

## 🔧 Core Functions

### encoder.js

- `convertUrls()`: Main obfuscation function
- URL detection regex patterns:
  - Complete URLs
  - Bare domains
  - IP addresses
- Formatting handlers for each obfuscation type

### decode.js

- `decodeUrls()`: Main decoding function
- Pattern replacement for common obfuscation techniques
- Input validation to prevent unnecessary decoding

## 💡 Use Cases

- **Security Reporting**: Safely share malicious URLs in reports
- **Threat Analysis**: Process IOC lists with different obfuscation formats
- **Forensics**: Decode obfuscated URLs found in investigations
- **Training**: Demonstrate common URL hiding techniques

## ⚠️ Limitations

- Decoder may not handle all custom obfuscation schemes
- Complex nested obfuscations might require multiple passes
- Spaced format (`e x a m p l e . c o m`) decoding is basic

## 🌟 Future Enhancements

- Add more obfuscation formats
- Implement batch file processing
- Add URL validation checks
- Create browser extension version

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details
