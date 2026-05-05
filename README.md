<p align="center">
   <img src="https://github.com/9guest/erodus/blob/main/build/icon.png?raw=true" alt="mediaSplitter" width="200" height="200" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/9guest/erodus" alt="License" />
   <img src="https://img.shields.io/github/package-json/v/9guest/erodus" alt="Version" />
   <img src="https://img.shields.io/github/issues/9guest/erodus" alt="Issues" />
   <img src="https://img.shields.io/github/stars/9guest/erodus?style=social" alt="GitHub Stars" />
</p>

# EroDUS - Erovoice Desktop Client

EroDUS is the desktop version of erovoice.desktop.us, a cross-platform application for downloading content from erovoice.us and Checking the DLsite / Fanza Product Info with product ID.

## Features

- **Download Queue Management** - Add multiple downloads to a queue and batch download them all at once
- **Persistent Storage** - Queue and history are saved locally and persist across app restarts
- **Queue History** - Track downloaded items with timestamps in a separate history tab
- **Toast Notifications** - Non-intrusive auto-dismissing notifications for user actions
- **About & Updates** - Built-in update checking with electron-updater for automatic version management
- **Multi-Source Support** - Search and download from Erovoice, DLsite, and Fanza
- **Cross-Platform** - Runs on Windows, macOS, and Linux

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/erodus.git
cd erodus
```

2. Install dependencies:
```bash
yarn install
# or
npm install
```

## Development

Start the development server:
```bash
yarn start
# or
npm start
```

## Building

Create production builds for all platforms:
```bash
yarn build
# or
npm run build
```

Builds will be output to the `dist/` directory for:
- **Windows**: NSIS installer and portable executable
- **macOS**: DMG and PKG installers
- **Linux**: AppImage, DEB, and RPM packages

## Usage

1. **Search & Browse** - Use the search feature to find content on Erovoice, DLsite, or Fanza
2. **Add to Queue** - Click the "+ Queue" button on any item to add it to your download queue
3. **Manage Queue** - View queued items in the Queue tab, remove individual items, or clear all
4. **Batch Download** - Click "Download All" to open all queue links in your default browser
5. **View History** - Switch to the History tab to see previously downloaded items
6. **Check Updates** - Visit the About page to check for app updates

## Technologies

- **Electron 41.3.0** - Cross-platform desktop framework
- **electron-updater 6.8.3** - Auto-update management
- **electron-builder 26.8.1** - Application packaging and building
- **Vanilla JavaScript** - No heavy dependencies for UI

## Project Structure

```
erodus/
├── src/
│   ├── modules/           # logic and handlers
│   │   ├── app-ipc-handler.js
│   │   ├── mod-erovoice-handler.js
│   │   ├── mod-dlsite-handler.js
│   │   └── mod-fanza-handler.js
│   ├── preloads/          # Electron preload scripts
│   │   └── preload.js
│   └── views/             # UI files
│       ├── html/
│       │   └── index.html
│       ├── js/
│       │   └── renderer.js
│       └── css/
│           └── styles.css
├── build/                 # Build configuration
│   └── installer.nsh      # NSIS installer script
├── main.js                # Electron main process
└── package.json           # Project configuration
```

## License

See [LICENSE](LICENSE) file for details.
