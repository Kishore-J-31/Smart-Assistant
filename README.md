SmartSupport AI 🤖

aSmartSupport AI is a fast, frontend support platform. Its chatbot uses your documentation to respond accurately to customers.

Features

* AI-Powered Chat Interface: Enjoy a modern, intuitive chat experience that makes customer conversations simple and natural.
* RAG (Retrieval-Augmented Generation): The AI is grounded in your specific documentation, reducing hallucinations and ensuring accuracy.
* Admin Dashboard: A secure portal to manage the knowledge base.
* Client-Side PDF Parsing: Upload PDF documents directly in the browser. Text is extracted locally using PDF.js and indexed for the AI.
* Persistent Storage: Utilizes localStorage to maintain your knowledge base and settings persistently across browser sessions, eliminating the need for a backend.
* Gemini Integration: Powered by the gemini-3-flash-preview model for fast and intelligent reasoning.

Tech Stack

* Framework: React 19 (loaded via ESM)
* Styling: Bootstrap 5 & FontAwesome
* AI SDK: @google/genai (It's helpful when we work on backend)
* PDF Processing: PDF.js
* Routing: React Router Dom 7

Getting Started

Prerequisites

* A modern web browser.
* A Google Gemini API Key.

Running the App

1. Clone or download this project.
2. Open index.html in your browser.
  * Note: Some browsers may require a local server (like Live Server or python -m http.server) to handle ESM modules correctly.
3. Ensure the environment variable process.env.API_KEY is available in your runtime environment.

Admin Access

To populate the knowledge base, navigate to the Admin Access section.

* Default Username: admin
* Default Password: admin123

Project Structure

├── index.html          # Main entry point & library imports
├── index.jsx           # React mounting logic
├── App.jsx             # Routing and global state
├── components/         # UI Components
│   ├── ChatInterface.jsx   # Main user interaction
│   ├── AdminDashboard.jsx # Knowledge management
│   └── Login.jsx           # Admin authentication
├── services/           # Logic layers
│   └── geminiService.js   # Google AI SDK integration
└── README.md           # You are here!

How Grounding Works

1. Upload: Admin uploads a PDF or pastes text in the Dashboard.
2. Index: The content is stored in localStorage.
3. Context Injection: When a user asks a question, the geminiService retrieves all documents and injects them into the systemInstruction.
4. Reasoning: The AI analyzes the context and provides an answer strictly based on the provided documentation.

Important Notes

* API Key: This app requires a valid Google Gemini API key.
* Client-Side Only: This is a demonstration of a robust client-side architecture. For production environments with massive amounts of data, a vector database and backend API are recommended.

---

Created by the Kishore.