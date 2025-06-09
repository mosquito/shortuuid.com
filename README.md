# ShortUUID JavaScript

A complete JavaScript implementation of the Python [shortuuid](https://github.com/skorokithakis/shortuuid) 
library with a web-based converter interface.

## Overview

ShortUUID generates concise, unambiguous, URL-safe UUIDs by encoding standard UUIDs using a base57 alphabet 
that excludes similar-looking characters (`l`, `1`, `I`, `O`, `0`). This project provides both a standalone 
JavaScript library and a web application for converting between UUID and ShortUUID formats.

## Features

- 🔗 **URL-safe**: No special characters requiring encoding
- 🎯 **Unambiguous**: Excludes similar-looking characters 
- 📏 **Compact**: ~22 characters instead of 36 for standard UUIDs
- 🔄 **Legacy support**: Compatible with shortuuid versions < 1.0.0
- 🌐 **Cross-platform**: Works in browsers and Node.js
- 🌙 **Dark theme**: Automatic dark mode support
- 💾 **Persistent settings**: Saves user preferences
- ⚡ **Real-time conversion**: Live encoding/decoding as you type

## Demo

Visit the live demo at: [shortuuid.com](https://shortuuid.com)

## Quick Start

### Browser Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="js/shortuuid.js"></script>
</head>
<body>
    <script>
        // Generate a short UUID
        const shortId = shortuuid.uuid();
        console.log(shortId); // e.g., "vytxeTZskVKR7C7WgdSP3d"

        // Encode an existing UUID
        const uuid = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
        const encoded = shortuuid.encode(uuid);
        console.log(encoded); // e.g., "dpRDaQrZdTWBKzKJRR6ZJj"

        // Decode back to UUID
        const decoded = shortuuid.decode(encoded);
        console.log(decoded); // "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
    </script>
</body>
</html>
```

### Node.js Usage

```javascript
const { ShortUUID, uuid, encode, decode } = require('./js/shortuuid');

// Generate a short UUID
const shortId = uuid();
console.log(shortId);

// Class-based usage with custom alphabet
const su = new ShortUUID('0123456789ABCDEF');
const hexShortId = su.uuid();
console.log(hexShortId);
```

## API Reference

### Global Functions

#### `uuid()`
Generate a short UUID string.
```javascript
uuid() // Returns: "vytxeTZskVKR7C7WgdSP3d"
```

#### `encode(uuid)`
Encode a standard UUID to short format.
```javascript
encode("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
// Returns: "dpRDaQrZdTWBKzKJRR6ZJj"
```

#### `decode(shortUuid, legacy?)`
Decode a short UUID back to standard format.
```javascript
decode("dpRDaQrZdTWBKzKJRR6ZJj")
// Returns: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"

// For UUIDs encoded with versions < 1.0.0
decode("legacyEncodedString", true)
```

#### `legacyEncode(uuid)`
Encode using legacy format (for compatibility).
```javascript
legacyEncode("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
// Returns legacy format string
```

#### `random(length?)`
Generate a random string using the current alphabet.
```javascript
random(10) // Returns: "3jKm9pQr2X"
```

#### `getAlphabet()` / `setAlphabet(alphabet)`
Get or set the global alphabet.
```javascript
console.log(getAlphabet()); // Default alphabet
setAlphabet("0123456789ABCDEF"); // Use hex alphabet
```

### ShortUUID Class

For multiple alphabets or instance-based usage:

```javascript
const su = new ShortUUID("custom-alphabet");

su.uuid()                    // Generate short UUID
su.encode(uuid)             // Encode UUID
su.decode(shortUuid)        // Decode short UUID
su.legacyEncode(uuid)       // Legacy encoding
su.random(length)           // Random string
su.getAlphabet()            // Get alphabet
su.setAlphabet(alphabet)    // Set alphabet
```

## Legacy Compatibility

This library supports the legacy format used in shortuuid versions < 1.0.0:

```javascript
// For old encoded strings
const uuid = decode(oldShortUuid, true);

// Convert legacy to new format
const newFormat = decode(legacyString, true);
const converted = encode(newFormat);
```

## Web Application

The included web application provides:

- **Real-time conversion** between UUID and ShortUUID formats
- **Legacy mode toggle** for compatibility with older versions
- **Auto-generation** of UUIDs on page load and field clearing
- **Copy to clipboard** functionality
- **Error validation** with visual feedback
- **Dark theme** support via `prefers-color-scheme`
- **Persistent settings** using localStorage

### Running the Web App locally

0. Gather the 3rd-party libraries:
```bash
brew install closure-compiler
make
```

1. Serve the files through a web server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using any other static file server
```

2. Open `http://localhost:8000` in your browser

## File Structure

```
├── js/
│   ├── shortuuid.js      # Core ShortUUID library
│   └── app.js            # Web application logic
├── css/
│   └── style.css         # Application styles
├── index.html            # Main web interface
└── README.md             # This file
```

## Browser Support

- **Modern browsers**: Full support with crypto.getRandomValues()
- **Legacy browsers**: Fallback to Math.random() (less secure)
- **Node.js**: Full support with crypto.randomBytes()

## Algorithm Details

1. **UUID to bytes**: Convert UUID string to 16-byte array
2. **Bytes to integer**: Convert bytes to big integer (128-bit)
3. **Base conversion**: Convert integer to base57 string using custom alphabet
4. **Legacy mode**: Reverse the final string for compatibility

Default alphabet: `23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz`

## Examples

### Basic Conversion
```javascript
const uuid = "550e8400-e29b-41d4-a716-446655440000";
const short = encode(uuid);           // "H9cNmGXLEc8NWcZzSThA9S"
const back = decode(short);           // "550e8400-e29b-41d4-a716-446655440000"
```

### Custom Alphabet
```javascript
const su = new ShortUUID("ABCDEFGHIJKLMNOP");
const customShort = su.encode(uuid);  // Uses only A-P characters
```

### Legacy Support
```javascript
// Old format from shortuuid < 1.0.0
const oldEncoded = "some-legacy-string";
const uuid = decode(oldEncoded, true);
const newEncoded = encode(uuid);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

The web application includes interactive testing through the UI. For programmatic testing:

```javascript
// Test round-trip conversion
const uuid = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const encoded = encode(uuid);
const decoded = decode(encoded);
console.assert(uuid === decoded, "Round-trip failed");

// Test legacy compatibility
const legacyEncoded = legacyEncode(uuid);
const legacyDecoded = decode(legacyEncoded, true);
console.assert(uuid === legacyDecoded, "Legacy compatibility failed");
```

## License

MIT License

Copyright (c) 2025 Dmitry Orlov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Acknowledgments

- Original Python [shortuuid](https://github.com/skorokithakis/shortuuid) library by Stavros Korokithakis
- Bootstrap for the web interface styling
- GitHub for hosting and collaboration tools

## Links

- **Live Demo**: [shortuuid.com](https://shortuuid.com)
- **Python Original**: [github.com/skorokithakis/shortuuid](https://github.com/skorokithakis/shortuuid)
- **PyPI Package**: [pypi.org/project/shortuuid](https://pypi.org/project/shortuuid)
