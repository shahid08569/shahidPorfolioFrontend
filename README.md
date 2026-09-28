# Shahid Hussain - Developer Portfolio (Frontend)

[![Frontend CI](https://github.com/shahid08569/shahidPorfolioFrontend/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/shahid08569/shahidPorfolioFrontend/actions/workflows/frontend-ci.yml)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> High-performance, SEO-friendly personal developer portfolio and content management system for a Senior Full-Stack .NET & Angular engineer.

---

## 🌟 Key Features

- **⚡ Angular 22 & Standalone Components:** Zero NgModules, tree-shakable modern component architecture.
- **🚀 Server-Side Rendering (SSR) & Hydration:** Instant time-to-first-byte (TTFB), full OpenGraph/Twitter card social previews, dynamic `Title` and `Meta` tagging via `SeoService`.
- **🎯 10-Second Recruiter Hook:** Hero section showcasing core strengths, availability status, quantified impact metrics, and immediate download CV / contact CTAs.
- **🎨 CSS-Variable Theme Engine:** Dark / Light theme switching powered by Angular Signals (`ThemeService`) with SSR guard and local storage persistence.
- **📐 Filterable Architecture Showcase:** Deep-dive case studies with problem statement, technical approach, clean architecture diagrams, and quantified metrics.
- **🛡️ Bot-Suppressed Contact Form:** Reactive form with instant client-side validation and invisible honeypot field.
- **🔒 Secured CMS Admin Portal:** JWT-authenticated control center (`/admin`) for managing portfolio projects, skills, articles, contact messages, and site configuration.

---

## 🛠️ Tech Stack

- **Framework:** Angular 22 (`@angular/core`, `@angular/ssr`)
- **Language:** TypeScript 5.x
- **Styles:** SCSS with custom design token system (`_variables.scss`, `_themes.scss`, `_mixins.scss`)
- **State Management:** Native Angular Signals (`signal`, `computed`)
- **HTTP Client:** Angular `HttpClient` with `withFetch()` and `authInterceptor`
- **Containerization:** Multi-stage Docker container (`node:22-alpine`)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ or v22 LTS recommended)
- [npm](https://www.npmjs.com/) (v10+ or v12)

### Installation

```bash
# Clone the repository
git clone https://github.com/shahid08569/shahidPorfolioFrontend.git
cd shahidPorfolioFrontend

# Install dependencies
npm install
```

### Local Development

```bash
# Start development server with hot-reload
npm start

# Application will be accessible at http://localhost:4200
```

### Production Build & SSR

```bash
# Build production client and server bundles
npm run build

# Run SSR Node server locally
npm run serve:ssr:shahid-portfolio-ui
```

---

## 🐳 Docker Deployment

```bash
# Build docker image
docker build -t shahid-portfolio-ui .

# Run container on port 4000
docker run -p 4000:4000 shahid-portfolio-ui
```

---

## 🔐 Admin CMS Credentials (Local)

- **Login URL:** `http://localhost:4200/admin/login`
- **Default Email:** `shahidhussaain08569@gmail.com`
- **Default Password:** `Admin@Portfolio2026!`

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
