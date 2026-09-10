# Tickr — SEC Filings AI Analysis Platform

> Autonomous multi-agent financial research powered by Gemini Managed Agents, with real-time charts, watchlist monitoring, and multilingual PDF reports.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-Managed%20Agents-4285F4.svg)](https://ai.google.dev/)

## Features

- Live SEC EDGAR Retrieval - Direct integration with 10-K, 10-Q, 8-K, 13F, DEF 14A, and Forms 3/4/5
- Dual Agent Synthesis - Gemini 3.5 Flash + Perseus 3.6 Flash cross-validating findings
- Interactive Charts - Stock price (4 months) + financial performance (4 quarters)
- PDF Export - Dual strategy: canvas raster + vector fallback for reliability
- Watchlist Monitoring - Pin tickers, custom alert tags, inline notes, CSV export
- Multilingual - Arabic (RTL), English, Spanish, French
- Modern UI - Vite + React 18 + Tailwind v4 + Motion animations
- Audio Briefings - Gemini TTS generates podcast-style summaries

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Gemini API Key - get one free at https://aistudio.google.com/apikey

### Installation

    git clone https://github.com/Mhmda1998/tickr.git
    cd tickr
    npm install

### Configuration

    cp .env.example .env

Edit .env and add your Gemini API key:

    GEMINI_API_KEY=your_actual_api_key_here

### Run

    npm run dev

Open http://localhost:3000 in your browser.

### Build for Production

    npm run build
    npm start

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS v4, Motion |
| Backend | Express 4, tsx (dev), esbuild (build) |
| AI | Google Gemini Managed Agents |
| Charts | Recharts 2 |
| PDF | jsPDF + html-to-image |
| Icons | Lucide React |
| Language | TypeScript 5.5 (strict mode) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/analyze | Start multi-agent SEC analysis (SSE stream) |
| POST | /api/tts | Generate audio briefing (Gemini TTS) |
| POST | /api/upload_artifact | Upload generated WAV podcast files |
| GET | /api/download_jsonl | Download latest run log as JSONL |

## Project Structure

    tickr/
    ├── server.ts                    Express + Vite middleware entry
    ├── server/lib/
    │   ├── agentClient.ts           Gemini 3.5 Flash agent client
    │   ├── agentClientPerseus.ts    Gemini 3.6 Flash (Perseus) client
    │   └── jsonExtractor.ts         Fenced JSON block parser
    ├── src/
    │   ├── App.tsx                  Main orchestrator component
    │   ├── LandingView.tsx          Hero + features showcase
    │   ├── ReportTemplate.tsx       PDF-ready report viewer
    │   ├── types.ts                 Shared TypeScript interfaces
    │   ├── data.ts                  Report transformer utility
    │   ├── components/
    │   │   ├── AgentTimeline.tsx    Live agent activity timeline
    │   │   ├── SavedReportsSidebar.tsx   Watchlist + history panel
    │   │   └── PulsatingDots.tsx    Animated canvas background
    │   └── utils/
    │       ├── translations.ts      i18n (AR/EN/ES/FR)
    │       └── savedReportsStorage.ts   localStorage persistence
    ├── agent/
    │   ├── agent.yaml               Agent configuration
    │   └── AGENTS.md                Agent system instructions
    ├── .env.example                 Environment template
    ├── .gitignore                   Git ignore rules
    └── package.json                 Dependencies + scripts

## Supported Languages

- Arabic (RTL)
- English
- Spanish
- French

## How It Works

1. Enter a ticker (e.g., NVDA, AAPL, MSFT) in the search bar
2. Two AI agents launch in parallel:
   - Gemini 3.5 Flash - fast general analysis
   - Perseus 3.6 Flash - deeper SEC-focused synthesis
3. Watch the live timeline as agents search, fetch PDFs, and reason
4. Read the synthesized report with verdict, insights, and charts
5. Export as PDF or pin to watchlist for monitoring

## Disclaimer

This tool does NOT provide financial advice. AI models can make mistakes. Always verify findings against primary SEC filings available at https://www.sec.gov/edgar

## License

MIT License (c) 2026 @Mhmda1998

See LICENSE for details.

## Acknowledgments

- Google Gemini team for Managed Agents API
- SEC EDGAR for public filing access
- Open source community for the incredible tooling
