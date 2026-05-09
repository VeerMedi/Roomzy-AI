# Roomzy AI 🏡

Yo! Welcome to **Roomzy AI**, the absolute coolest, intelligent application powered by AI (Google Imagen & Gemini) that helps you visualize, design, and completely vibe-check your rooms and interior spaces! 🚀

This repository is set up as a monorepo containing both the frontend and backend of the application. I am super stoked to share this with you and hear what you think!

## 🎆What makes Roomzy slap? (Functionalities)

Roomzy AI isn't just another layout tool-it's your ultimate digital interior designer! Here's the rundown:

- **Smart Input Wizard:** A super smooth, interactive step-by-step guide to catch your exact aesthetic preferences and room details.
- **AI-Powered Visualization:** Using cutting-edge Google Imagen and Gemini API, I turn your wildest room ideas into stunning, realistic previews!
- **Blueprint Magic:** Flex your floor plans with my Blueprint Modal and let the AI map out the best possible setup for your space.

## 💸 Business Scalability (I'm Thinking Big Big!)

Roomzy AI is built to SCALE, baby! 📈 I'm not just thinking about an app; I'm thinking about a whole ecosystem:

- **Furniture Retail Integration:** Imagine linking up with huge retail brands so you can literally buy the exact aesthetic items generated in your AI designs with just one click. 🛒
- **Premium Subscriptions:** Pro-tier features for real interior designers or real estate agents who need high-res rendering and unlimited generation magic.
- **B2B Licensing:** Letting other real estate platforms plug into my AI to show "potential" room setups to property buyers!

## 🔮 The Future: AR Visualization (Wait for it...)

Okay, here is where it gets crazy cool. My ultimate vision is to add native **AR Visualization** seamlessly linking with tools like Polycam! 📱✨

I am planning to integrate the insanely awesome `robbyant/lingbot-map` model for 3D AR visual structuring. The goal here is that you could just snap multiple pictures or use live video streaming to instantly map out your room in 3D right on your phone! 🤯

*Why isn't it here yet?*
Right now, I'm hitting a tiny roadblock: there's currently a lack of an Inference Provider for the `robbyant/lingbot-map` model. But the absolute *second* I get that sorted out, I am so deploying it!

## 🛠 Tech Stack

**Frontend:**

- React (bootstrapped with Vite)
- TypeScript
- Clerk (Authentication)
- Google Gemini API (`geminiService.ts`)

**Backend:**

- Node.js & Express
- TypeScript
- Clerk (Authentication via `@clerk/express`)

## 📁 Project Structure

```text
Roomzy-AI/
├── backend/          # Node.js/Express backend server
│   ├── src/          # Backend source code (server.ts)
│   ├── package.json  # Backend dependencies
│   └── tsconfig.json # TypeScript configuration
├── frontend/         # React/Vite frontend application
│   ├── components/   # UI components (Hero, InputWizard, Processing, etc.)
│   ├── services/     # API/AI services (geminiService.ts)
│   ├── package.json  # Frontend dependencies
│   └── vite.config.ts# Vite configuration
└── package.json      # Monorepo root configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

Install dependencies for the root, frontend, and backend all at once! Run this in your terminal:

```bash
npm run install:all
```

*(Alternatively, you can navigate to the `frontend/` and `backend/` directories and run `npm install` individually).*

### Environment Variables

You will need to set up environment variables for both the frontend and backend (e.g., Clerk API keys, Gemini API keys). Create `.env` files in the respective directories!

### Running the Application

To start both the frontend development server AND the backend server concurrently, run the following command from the root directory:

```bash
npm start
```

This will leverage `concurrently` to spin up both projects. You can also run them individually if that's more your vibe:

- **Frontend only:** `npm run frontend`
- **Backend only:** `npm run backend`

## 💬 Let's Connect! 🤩

I am super keen and wildly curious to hear what you guys think! Have suggestions? Spotted a bug? Got a crazy feature idea? PLEASE hit me up! Drop an issue, submit a PR, or just leave some feedback. I'd love to improve this and make it even cooler. Let's build the raddest room design app together! 🙌🔥

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/veermediwala/) or drop me an email at [vmediwala@gmail.com](mailto:vmediwala@gmail.com)!
