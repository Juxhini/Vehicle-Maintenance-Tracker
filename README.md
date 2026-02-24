# 🚗 AutoCare – Vehicle Maintenance Tracker (PWA)

A premium, cross-device Progressive Web App (PWA) designed to track vehicle maintenance schedules, log completed services, and provide status alerts for upcoming maintenance.

## ✨ Features

- **📱 Full PWA Support**: Install it on your Android or iOS device for a native-like experience.
- **🔄 Real-time Sync**: Changes made on your smartphone are automatically synced back to the project folder on your computer.
- **📊 Maintenance Dashboard**: Quick overview of all your vehicles and their current service status (OK, Warning, Overdue).
- **🛠️ Custom Services**: Add your own maintenance items with custom Kilometer or Month intervals.
- **📦 Dual-Mode**: Works as a standard web application or as a standalone Windows desktop app (built with Electron).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vehicle-maintenance-tracker.git
   cd vehicle-maintenance-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate icons (optional but recommended for PWA):
   ```bash
   node generate-icons.js
   ```

### Running Locally

To start the development server and enable smartphone access:

```bash
npm run dev
```

The app will be available at `http://localhost:5174`. To access it from your phone, use your computer's local IP address (e.g., `http://192.168.1.15:5174`).

### Building for Desktop (Windows)

To create a standalone Windows installer:

```bash
npm run electron:build
```

The installer will be generated in the `electron-dist` folder.

## 💾 Data Management

All your vehicle data and logs are stored locally in `data/db.json`. When running the development server, the app uses a custom Vite plugin to sync state between your browser/phone and this file.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Modern UI)
- **Desktop**: Electron
- **Persistence**: Local JSON API (via Vite Middleware)
- **PWA**: Service Workers & Web App Manifest

## 📄 License

MIT
