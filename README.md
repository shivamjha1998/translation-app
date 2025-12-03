# **Translation App**

A modern, voice-enabled translation app built with React Native and Expo. This app translates speech and text between English and Japanese using OpenAI for translation and ElevenLabs for Text-to-Speech (TTS) and Speech-to-Text (STT).

**Note:** This project was developed using **Antigravity IDE**.

## **Features**

* **Bi-directional Translation**: English ↔ Japanese.  
* **Voice Input (STT)**: Record audio to transcribe text using ElevenLabs.  
* **Text-to-Speech (TTS)**: Listen to translations with high-quality AI voices.  
* **Modern UI**: Dark mode, responsive design, and smooth animations using react-native-reanimated and lucide-react-native.

## **Architecture**

* **Framework**: Expo (React Native)  
* **Language**: TypeScript  
* **State Management**: TanStack Query (React Query)  
* **Styling**: Custom Theme System  
* **Services**:  
  * OpenAI (GPT-4o-mini)  
  * ElevenLabs (Multilingual v2)

## **Prerequisites**

* Node.js (v18+)  
* Expo Go app on your mobile device (or an emulator)

## **Setup**

1. **Clone the repository**  
  ```
  git clone git@github.com:shivamjha1998/translation-app.git
  ```
2. **Install dependencies**:  
  ```
   npm install  
   npx expo install @tanstack/react-query
  ```

3. Environment Variables:  
   Create a .env file in the root directory (do not commit this file):  
   EXPO\_PUBLIC\_OPENAI\_API\_KEY=your\_openai\_key  
   EXPO\_PUBLIC\_ELEVENLABS\_API\_KEY=your\_elevenlabs\_key

## **Running the App**
```
npm run start
```

Scan the QR code with the Expo Go app.

## **Project Structure**

src/  
├── components/   \# Reusable UI components  
├── config/       \# App configuration (AI models, API endpoints)  
├── hooks/        \# Custom React hooks (logic layer)  
├── screens/      \# Application screens  
├── services/     \# API clients and external service integration  
├── types/        \# TypeScript definitions  
└── utils/        \# Helper functions and themes

## **Security Note**

This project currently uses client-side API calls for demonstration purposes. In a production environment, you should move the API keys to a secure backend server to prevent exposure.