# Paralegal AI – Legal Document Assistant

Paralegal AI is a web application that helps users check whether uploaded legal documents comply with Indian law.  
Users can upload PDF/DOCX files, ask questions, and receive AI‑generated guidance, with chat history saved per account.

---

## Features

- **AI‑powered analysis**
  - Uses Google Gemini (via `google-generativeai`) to analyze legal documents.
  - Combines document text with your prompt to give structured, easy‑to‑read answers.

- **Document upload**
  - Supports **PDF** and **DOCX** files.
  - Extracts and processes text using **PyPDF2** and **python-docx**.

- **User accounts & authentication**
  - Email/password signup & login using **Firebase Authentication**.
  - Optional **Google Sign‑In**, integrated with Firebase.
  - Server‑side session management with Flask.

- **Chat history**
  - Each user has multiple chat sessions.
  - Messages and file names are stored in **Firebase Firestore**.
  - Guests can still chat using in‑memory sessions (no login required).

- **Modern web UI**
  - Built with **Flask templates**, **HTML/CSS**, and **vanilla JavaScript**.
  - Sidebar for chat sessions, main area for conversation, file attachment support.

---

## Tech Stack

- **Backend**: Python, Flask
- **AI**: Google Gemini (`google-generativeai`)
- **Auth & Database**: Firebase Authentication, Firebase Firestore, `firebase_admin`
- **Frontend**: HTML, CSS, JavaScript (vanilla), Firebase JS SDK
- **Document Processing**: PyPDF2, python-docx
- **HTTP / APIs**: `requests`

---

## Project Structure

- `app.py` – Main Flask application (routes, AI calls, Firebase integration)
- `templates/`
  - `index.html` – Main chat UI
  - `login.html`, `signup.html` – Auth pages
- `static/`
  - `style.css` – Styles for the UI
  - `script.js` – Frontend logic (fetch calls, chat rendering, Firebase auth handling)
- `requirements.txt` – Python dependencies
- `keys.txt` – **Local secrets only (not committed)**
- `serviceAccountKey.json` – **Firebase service account key (not committed)**

---

## Setup & Installation

1. **Clone the repository**
   git clone https://github.com/yuvishtaneja/Paralegal-AI.git
   cd Paralegal-AI
   
2. **Create and activate a virtual environment (optional but recommended)**
   python -m venv .venv
   .venv\Scripts\activate   # Windows
   # source .venv/bin/activate  # Linux/Mac
   
3. **Install dependencies**
   pip install -r requirements.txt

4. **Create `keys.txt` (NOT committed to Git)**
   In the project root, create a file named `keys.txt`:
   GOOGLE_API_KEY = "your-google-gemini-api-key"
   FIREBASE_API_KEY = "your-firebase-web-api-key"
   
5. **Add Firebase service account**
   - Download your **service account JSON** from Firebase Console.
   - Save it in the project root as `serviceAccountKey.json`.

   > Both `keys.txt` and `serviceAccountKey.json` are in `.gitignore` and should never be pushed to GitHub.

6. **Configure Firebase Frontend**

   - In `templates/index.html`, the `firebaseConfig` object should match your Firebase project:
    
     const firebaseConfig = {
       apiKey: "...",
       authDomain: "...",
       projectId: "...",
       // ...
     };
     ---

## Running the App

1. Make sure your virtual environment is active and dependencies are installed.

2. Start the Flask development server:
   python app.py

3. Open your browser and go to:
   http://127.0.0.1:5000/
 

## How It Works (High Level)

1. **User uploads files and enters a prompt.**
2. Backend extracts text from PDF/DOCX and builds a combined prompt:
   - “Check whether the given documents are legal according to the law of India...” + document text.
3. The prompt is sent to **Google Gemini**, and the response is formatted into HTML bullet points.
4. Chat messages (prompt, AI response, file names, timestamps) are stored in **Firestore** for logged‑in users.
5. The frontend uses **JavaScript** (`fetch`) to call Flask API endpoints and update the chat UI dynamically.



## License

(Add your chosen license here, for example MIT, or state “Private / All rights reserved” if you don’t want it open‑sourced.)
