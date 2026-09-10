# 🧠 SmritiCare (স্মৃতি কেয়াৰ / स्मृति केयर)
### *AI-Powered Cognitive Care, Medication Safety & Frontline Geriatric Support Platform*
> **Smart India Hackathon (SIH 2026)** | Project ID: **SIH-2026-SMRITI**  
> **Geographic Focus**: Titabor, Jorhat District, Assam, India

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Executive Summary

**SmritiCare** is a clinical-grade, offline-first, multilingual digital cognitive companion designed to assist elders experiencing mild cognitive impairment (MCI) or early-stage Alzheimer’s, their family caregivers, primary healthcare physicians, and frontline **ASHA (Accredited Social Health Activists)** workers.

The platform combines **neuro-cognitive stimulation games with dynamic 3-tier adaptive difficulty**, **AI Vision medicine package scanner**, **AI lab report translation**, **voice reminiscence photo album**, and **Smriti Sathi** conversational assistant localized in **Assamese (অসমীয়া)**, **Hindi (हिन्दी)**, and **English**.

---

## 👥 4 Tailored Stakeholder Portals

| Portal | Primary User | Key Capabilities |
| :--- | :--- | :--- |
| **👴 Senior / Patient** | Rural & semi-urban elders | High-contrast UI, daily routine audio narrator, 6 culturally localized memory games, voice reminiscing album, and AI chat companion. |
| **👨‍👩‍👧 Family Caregiver** | Primary family members | Real-time medication adherence tracking, 7-day longitudinal cognitive trends, hydration logs, and ASHA visit notes. |
| **🩺 Clinician / Doctor** | PHC Doctors & Neurologists | Multi-domain cognitive radar (visual memory, executive function, attention), baseline drift diagnostics, and 1-click clinical PDF download. |
| **👩‍⚕️ ASHA Health Worker** | Frontline community workers | Village geriatric roster (Titabor cohort), offline field screening tests, doorstep home visit logger, and medicine stock tracking. |

---

## 🎮 6 Neuro-Cognitive Games (with Adaptive 3-Tier AI Engine)

1. **Japi & Gamusa Cultural Pair Matching** (`RememberMatchGame.tsx`) — Visual & working memory.
2. **Sequential Tea Leaf Tap** (`SequenceRecallGame.tsx`) — Working memory & sequence recall.
3. **Assamese Symbol Odd-One-Out** (`FindTheSymbolGame.tsx`) — Selective attention & visual discrimination.
4. **Brahmaputra Boat Route Trail Making** (`FollowPathGame.tsx`) — Visuospatial coordination & processing speed.
5. **Morning Routine Chronological Order** (`RememberRoutineGame.tsx`) — Executive function & temporal sequencing.
6. **Local Landmark & Village Recall** (`LocalMemoryGame.tsx`) — Semantic association & long-term recall.

### 📈 Adaptive Difficulty Algorithm (`src/lib/adaptiveDifficulty.ts`)
Calculates real-time performance adjustments:
$$\text{Performance Score} = (\text{Accuracy} \times 0.65) + (\text{Speed Factor} \times 0.35)$$
- **Tier 1 (Gentle)**: 4 cards / 2 sequences (Reduced cognitive load)
- **Tier 2 (Standard)**: 6 cards / 3 sequences (Standard clinical baseline)
- **Tier 3 (Challenging)**: 8 cards / 4 sequences (Advanced cognitive stimulation)

---

## 🔬 AI Safety & Multimodal Diagnostics

- **AI Medicine Packaging Scanner (`MedicineSafetyScanner.tsx`)**: Analyzes blister packs and medicine strips using vision models, extracts generic/brand names, verifies dosage against prescription schedules, and alerts for missing doses.
- **AI Lab Report Analyzer (`LabReportAnalyzer.tsx`)**: Translates complex blood, liver, lipid, and hemoglobin test parameters into friendly plain language with dietary advice in Assamese and Hindi.
- **Voice Reminiscence Engine (`MemoryJournal.tsx`)**: Plays familiar voice audio narrations with family milestones to trigger positive autobiographical memories.
- **Smriti Sathi Voice Companion (`AIChatCompanion.tsx`)**: Empathetic conversational companion with multi-dialect Assamese, Hindi, and Indian English speech synthesis.

---

## 🌐 Localization & Accessibility (A11y)

- **Trilingual Localization (`src/lib/i18n.ts`)**: Complete interface translation in **English**, **हिन्दी (Hindi)**, and **অসমীয়া (Assamese)**.
- **Universal Voice Narrator (`VoiceNarratorButton.tsx`)**: Web Speech API integration with auto-detected phonetic voices.
- **Geriatric Accessibility**: 3-tier font scaling (Normal / Large / Extra Large), High Contrast mode (WCAG AAA compliant), and Reduced Motion settings.
- **Offline-First Resilience (`OfflineBanner.tsx`)**: LocalStorage persistence with simulated offline sync mode.

---

## 🛠️ Tech Stack & Architecture

```
Smriti_care/
├── src/
│   ├── components/
│   │   ├── chat/           # Smriti Sathi conversational AI companion
│   │   ├── common/         # TopHeader, Sidebar, Modals, VoiceNarrator, OfflineBanner
│   │   ├── dashboards/     # Patient, Caregiver, Clinician, ASHA dashboards
│   │   ├── games/          # 6 Neuro-cognitive games + GameShell + Adaptive tier
│   │   ├── journal/        # Voice reminiscence memory journal
│   │   ├── landing/        # Futuristic 3D anatomical hero showcase (Image #10 & #12)
│   │   ├── routine/        # Pill schedule, hydration tracker, walking timer
│   │   ├── safety/         # AI Medicine Packaging & Lab Report Analyzer
│   │   └── visuals/        # 3D Crystal Organ Visuals (Brain, Lungs, Liver, Kidney)
│   ├── context/            # Global AppContext (state, role, settings, reminders)
│   ├── lib/                # i18n, adaptiveDifficulty, aiClient, pdfReport, speech, storage
│   ├── types/              # TypeScript schemas & interfaces
│   ├── App.tsx             # Root layout shell with dynamic glow orbs
│   └── index.css           # Glassmorphism utilities & cybernetic lighting
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Launch

```bash
# 1. Clone the repository
git clone https://github.com/Jin-woo-tech/Smriti_Care.git
cd Smriti_Care

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

### Production Build & Verification

```bash
npm run build
npm run preview
```

---

## ⚠️ Clinical Safety Notice

> **Medical Disclaimer**: SmritiCare is a supportive cognitive stimulation, medication reminder, and caregiver coordination tool. It does not provide definitive medical diagnoses of Alzheimer's Disease or dementia. For acute emergencies, please contact emergency medical services (**108** in Assam) or visit your nearest primary healthcare centre.

---

## 👨‍💻 Author & Acknowledgements

- **Author**: [Jin-woo-tech (Vikas)](https://github.com/Jin-woo-tech)
- **Initiative**: Smart India Hackathon (SIH 2026)
- **Community Partner**: Titabor Block Primary Healthcare Network, Jorhat, Assam
