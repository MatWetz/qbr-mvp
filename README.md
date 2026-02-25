![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/MatWetz/qbr-template?utm_source=oss&utm_medium=github&utm_campaign=MatWetz%2Fqbr-template&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

# QBR Template

A Customer Success QBR slide generator built with Next.js and shadcn/ui.

## Project Summary

This repository contains an MVP for generating Quarterly Business Review slides from customer input.

Current workflow:
- Enter a customer name on the landing page.
- The app fetches mock customer data (2 sample customers).
- A full QBR deck is generated automatically.
- Slides can be controlled with buttons or keyboard arrows (`ArrowLeft`, `ArrowRight`, `Space`).

Current slide sequence:
- Cover slide (customer + CodeRabbit branding)
- Agenda
- Adoption review: 2 data slides
- Adoption review: 2 recommendation slides
- Next Steps
- Roadmap

## Tech Stack

- Next.js (App Router, TypeScript)
- shadcn/ui
- Tailwind CSS
- Vercel-ready deployment setup

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Build and Quality Checks

```bash
npm run lint
npm run build
```

## Deployment

Deploy to Vercel by connecting this GitHub repository and using the default Next.js build settings.

## Maintenance Note

This README update exists to trigger the first CodeRabbit pull request review workflow.
