# 🎵 Rhythm Sync

**Rhythm Sync** is a modern and minimalist music streaming web app built with **React**, **Vite**, and **Tailwind CSS**. It streams tracks from the **local audio files**.

## ✨ Features

- 🎧 Stream music from **Local Audio Files**
- 🎼 Play **your own music** from the `public/music/` folder
- 🔎 Built-in **search bar** in the navbar
- ⚡ Super-fast dev experience with **Vite**
- 🎨 Fully responsive **Tailwind CSS** UI
- 🖼️ Custom favicon setup for all platforms
- 📂 Clean project structure for scalability

## 📁 Project Structure

```bash
rhythm-sync/
├── public/
│ ├── favicon/ # All favicon and icon files
│ ├── music/ # Local audio and cover files
│ └── index.html # App root HTML with favicon links
├── src/
│ ├── components/ # (Optional) Reusable components like Navbar, Footer
│ ├── music.jsx # Jamendo integration and music rendering
│ ├── App.jsx # Main app layout and player logic
│ └── main.jsx # Vite entry point
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md

```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/rhythm-sync.git
   cd rhythm-sync
   ```
   Install dependencies
   ```bash
    npm install
   ```

Run the app

```bash
npm run dev
```

Build for production

```bash
 npm run build
```

🎵 Add Your Own Music

To include your own tracks:

    Place .mp3 and cover images in public/music/

    Use relative paths in your data like:

```bash
{
id: 1,
title: "Summer Breeze",
artist: "Coastal Waves",
album: "Ocean Sounds",
cover: "/music/cover1.jpg",
audio: "/music/track1.mp3"
}
```

🛠 Tech Stack

    React + Vite

    Tailwind CSS

    HTML5 Audio API

🔗 Deployment

Can be easily deployed via:

    Vercel

    Netlify

    GitHub Pages (with vite.config.js adjustments)

📄 License

MIT License

Built with 🎧 by DomDev
