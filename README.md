# EroDUS — Erovoice Desktop Client

<p align="center">
  <img src="https://github.com/9guest/erodus/blob/main/build/icon.png?raw=true" alt="erodus_icon" width="200" height="200" />
</p>

<p align="center">
  <a href="https://github.com/9guest/erodus/blob/main/LICENSE"><img src="https://img.shields.io/github/license/9guest/erodus" alt="License" /></a>
  <img src="https://img.shields.io/github/package-json/v/9guest/erodus" alt="Version" />
  <a href="https://github.com/9guest/erodus/issues"><img src="https://img.shields.io/github/issues/9guest/erodus" alt="Issues" /></a>
  <a href="https://github.com/9guest/erodus/stargazers"><img src="https://img.shields.io/github/stars/9guest/erodus?style=social" alt="GitHub Stars" /></a>
</p>

A lightweight, cross-platform Electron client for browsing and downloading content referenced on erovoice.us, with integrated product info lookup for DLsite and Fanza.

### Why EroDUS?
- Centralizes downloads and product lookups into a single desktop app.
- Keeps a persistent download queue and history for convenience.
- Designed to be small, fast, and easy to run on Windows, macOS, and Linux.

### Features
- Download queue with batch-download workflow
- Persistent local storage for queue & history
- History view with timestamps
- Multi-source search: Erovoice, DLsite, Fanza
- Toast-style notifications for user feedback
- Built-in update checking via electron-updater
- Installer builds: NSIS, DMG, AppImage, DEB, RPM

### Screenshot
<img width="1227" height="737" alt="image" src="https://github.com/user-attachments/assets/3d6b39b5-dcd0-46de-bddf-5c777c16b32e" />

### Requirements
- Node.js 16+ and npm or yarn
- Git
- (Optional) A modern OS: Windows 10+, macOS 10.14+, common Linux distros

### Quick start (development)
1. Clone the repo
   ```bash
   git clone https://github.com/9guest/erodus.git
   cd erodus
   ```
2. Install
   ```bash
   yarn install
   # or
   npm install
   ```
3. Start in development mode
   ```bash
   yarn start
   # or
   npm start
   ```
### Packaging / Builds Create production builds with electron-builder:
   ```bash
   yarn build
   # or
   npm run build
   ```
### Output is placed in dist/ and includes platform-specific artifacts:

- Windows: NSIS installer / portable EXE
- macOS: DMG / PKG
- Linux: AppImage / DEB / RPM

### Usage
1. Search across Erovoice, DLsite, or Fanza
2. Click "+ Queue" on an item to add it to the download queue
3. Open the Queue tab to remove items or "Download All" to process the list
4. Check History for completed downloads and timestamps
5. Use About → Check for updates to keep the app current

### Project layout
```
erodus/
├── src/
│   ├── modules/           # application logic and handlers
│   │   ├── app-ipc-handler.js
│   │   ├── mod-erovoice-handler.js
│   │   ├── mod-dlsite-handler.js
│   │   └── mod-fanza-handler.js
│   ├── preloads/          # Electron preload scripts
│   │   └── preload.js
│   └── views/             # UI files (html, css, js)
│       ├── html/
│       │   └── index.html
│       ├── js/
│       │   └── renderer.js
│       └── css/
│           └── styles.css
├── build/                 # build configuration and assets
│   ├── installer.nsh      # NSIS installer script
│   └── icon.png
├── main.js                # Electron main process entry
└── package.json
```
### Configuration & Notes

- update-checking but no auto-updates (manually download and install).
- The app currently opens queue links in the default browser to trigger downloads; that behavior can be changed to an integrated downloader.
- Store location: app uses local file-based storage (persist across restarts). If you want a specific path, add configuration in src/modules/storage.

### Contributing Thank you for considering contributing! If you want to help:

- Open issues for bugs or feature requests
- Fork the repo, create a feature branch, and submit a PR
- Keep changes focused and add short, descriptive commit messages

### Suggested development workflow

1. Create an issue describing your change
2. Make a feature branch: git checkout -b feat/your-feature
3. Implement and test locally
4. Open a PR against main with a clear description and link to the issue

### Maintainers

- 9guest (repository owner)

### Security 

If you find a security issue, please open a private issue or email the maintainers directly. Do not disclose vulnerabilities publicly until they are patched.

### Acknowledgements

- Built with Electron and electron-builder
- Uses concepts and data sources from `erovoice.us`, `DLsite`, and `Fanza`
