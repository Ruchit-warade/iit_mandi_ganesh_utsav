# IIT Mandi Ganesh Utsav — Ganpati in the Mountains

A premium, minimalistic, cinematic website for IIT Mandi's biggest flagship festival.
Golden Ganpati line-art drawing animation over Himalayan mountain silhouettes,
with a fixed background and scrolling foreground content.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Main public website (hero, about, celebration, gallery, team, contribute CTA) |
| `contribute.html` | 2-step contribution form (details → QR payment → success) |
| `dashboard-login.html` | Two-stage organiser login (name + PIN → password) |
| `dashboard.html` | Private organiser dashboard (stats, contributions, gallery, team, settings) |

## Tech Stack

- **Vanilla** HTML5 + CSS3 + JavaScript (ES modules) — no build tools
- **Firebase** (Firestore, Auth, Storage) via CDN
- **Google Fonts** (Cinzel, Inter)

## Setup

1. **Create a Firebase project** at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password), **Firestore**, and **Storage**
3. Replace the placeholder values in `js/firebase-config.js` with your project's config
4. Deploy the security rules:
   ```
   firebase deploy --only firestore:rules,storage
   ```
5. Serve the site locally (e.g. `python -m http.server` or VS Code Live Server)

## Data Structure

### Firestore
```
donations/{auto-id}
  name: string
  category: "student" | "teacher" | "alumni" | "staff" | "other"
  roll: string
  amount: number
  transactionId: string
  createdAt: timestamp
  status: "PENDING" | "VERIFIED" | "REJECTED"

organisers/{auto-id}
  displayName: string
  role: string
  email: string
  pinHash: string (salted SHA-256 — never plaintext)
  photoUrl: string
  order: number

gallery/{auto-id}
  url: string
  caption: string
  order: number

event/settings
  title: string
  tagline: string
  description: string
  qrCodeUrl: string
  contributionInfo: string
```

### Storage
```
gallery/     — event photos
organisers/  — team member photos
payment/     — QR code
decorative/  — decorative assets
```

## Security

- **No public sign-in button** — the dashboard is only reachable via its URL
- **Two-stage auth**: name + 6-digit PIN (salted SHA-256 lookup in Firestore)
  → password (Firebase Authentication)
- Names, PINs, and passwords are **never hardcoded** in frontend JavaScript
- Firestore/Storage rules restrict writes to authenticated organisers

## Signature Features

- **Draw-once animation**: the golden Ganpati appears to be hand-drawn via
  SVG `stroke-dasharray`/`stroke-dashoffset`, then stays complete (no looping)
- **Fixed background**: mountains + Ganpati stay static; only foreground scrolls
- **Scroll reveals**: IntersectionObserver-driven fade/translate/blur transitions
- **Responsive**: mobile-first, adaptive Ganpati sizing, touch-friendly

## Placeholders

Gallery images (`assets/images/gallery/`), organiser photos
(`assets/images/organisers/`), and the payment QR code (`assets/images/payment/`)
should be added once real assets are available.
