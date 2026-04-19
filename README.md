# The Sanctuary 🌿

The Sanctuary is a grounded, ethereal mental health web application designed to act as a digital retreat for mindful reflection and emotional growth. Moving away from cold, highly-gamified, and clinical interfaces, The Sanctuary offers a warm, private, and aesthetically calming space to track your mood, journal your thoughts, and receive empathetic, AI-generated reflections.

## ✨ Core Features

*   **AI-Powered Reflective Journaling ("The Vault"):** A secure space where users can write freely. The platform utilizes the Google Gemini API to read user entries and generate gentle, deeply empathetic reflections, acting as a non-judgmental sounding board.
*   **Multi-Faceted Mood Assessments:** A comprehensive daily check-in system tracking granular emotional states: Energy Levels, Stress Levels, Pleasantness, Sleep Quality, and Focus Levels.
*   **Emotional Trend Analysis:** A visual dashboard that tracks historical mood assessments and journal entries over time, helping users identify patterns and triggers.
*   **Secure & Private:** User identity and data are securely managed using Firebase Authentication and Firestore, protected by strict Attribute-Based Access Control (ABAC) security rules. User data is strictly isolated.

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, TypeScript
*   **Styling & UI:** Tailwind CSS v4, Motion (formerly Framer Motion) for fluid transitions, Lucide React for icons
*   **Backend & Database:** Firebase Authentication, Google Cloud Firestore (NoSQL)
*   **AI Integration:** Google Gemini API (`@google/genai` SDK)
*   **Routing:** React Router v7

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
*   npm or yarn

### 1. Installation
Clone the repository (or extract the project folder) and run the following to install all dependencies:
```bash
npm install
```

### 2. Environment Variables
You need a Google Gemini API Key to power the AI reflection features.
Create a `.env` file in the root directory of your project and add your key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Firebase Configuration
The app uses Firebase for user authentication and database storage. 
Ensure you have a `firebase-applet-config.json` file in the root directory. If you are setting this up from scratch:
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
2. Enable **Firestore** and **Authentication** (Google Sign-In).
3. Register a Web App in your Firebase console to get your config object.
4. Populate `firebase-applet-config.json` with your credentials:
```json
{
  "projectId": "your-project-id",
  "appId": "your-app-id",
  "apiKey": "your-api-key",
  "authDomain": "your-auth-domain",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "your-storage-bucket",
  "messagingSenderId": "your-messaging-id",
  "measurementId": "your-measurement-id"
}
```
*(Note: If you plan to deploy your own database, you'll also want to deploy the `firestore.rules` included in this repo to secure your data).*

### 4. Run the Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal) to view it in the browser.

---

## 🧠 How It Works

1.  **Architecture:** The Sanctuary is built as a Serverless Single Page Application (SPA). There is no traditional backend service (like Node/Express) to maintain.
2.  **Data Flow:** 
    *   **Authentication:** Handled entirely by Firebase Auth. A user state observer controls access to private routes.
    *   **Storage:** When you log a mood or save a journal entry, the React frontend writes directly to Firebase Firestore. Firestore Security Rules guarantee that you can only ever read and write documents tagged with your specific User ID.
    *   **AI Generation:** When submitting a journal entry, the app makes an API request to the Google Gemini API using your provided text as a prompt. Gemini returns an empathetic reflection which is mapped to your entry and stored securely in Firestore alongside your text.
3.  **UI & Theming:** The aesthetic is achieved through a combination of Tailwind CSS mapping to a custom color palette (defined in `index.css`), an SVG noise filter overlay applied to the body for texture, and fluid page transitions managed by `Motion`.
