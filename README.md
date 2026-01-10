# DoodleTrace ✏️

**Learn to Write, One Doodle at a Time!**

DoodleTrace is a fun, interactive tracing app designed for kids to practice writing letters and numbers. Trace over dashed guides with your finger or mouse to build handwriting skills.

**Live Demo:** [https://doodle-trace.web.app](https://doodle-trace.web.app)

---

## 🚀 Features

- **Three Practice Modes**
  - `ABC` – Uppercase letters (A-Z)
  - `abc` – Lowercase letters (a-z) with handwriting-friendly font
  - `123` – Numbers (0-9)

- **Simple Drawing Tools**
  - 5 vibrant colors: Red, Blue, Green, Purple, Black
  - Thick brush optimized for tracing
  - One-tap Clear button

- **Easy Navigation**
  - Large Next/Previous arrows on each side
  - Looping navigation (Z → A, 9 → 0)

- **Mobile Optimized**
  - Full-screen canvas on phones and tablets
  - Larger letters on mobile for easier tracing
  - No scrolling required

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build & Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📁 Project Structure

```
doodle-trace/
├── src/
│   ├── App.tsx          # Main application
│   ├── App.css          # Responsive styles
│   └── components/
│       ├── Canvas.tsx       # Drawing surface
│       ├── Controls.tsx     # Color palette & clear button
│       └── LetterGuide.tsx  # SVG dashed letter guides
├── index.html
├── firebase.json        # Hosting configuration
└── package.json
```

---

## 📄 License
MIT
