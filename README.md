# 🛡️ ScamShield AI

> **Your Personal AI Cybersecurity Analyst.**
> Detects scams in real-time using a Hybrid Intelligence Engine (Machine Learning + Large Language Models).

![Project Banner](https://placehold.co/1200x400/0891b2/ffffff?text=ScamShield+AI+Dashboard)
## 🚀 Live Demo
**👉 Try it here:** [https://scamshield-ui-kit.vercel.app](https://scamshield-ui-kit.vercel.app)

---

## 🧐 The Problem
Digital fraud is evolving. Traditional spam filters rely on **keywords** (e.g., "Winner," "Prince," "Bank"), but modern scammers use **psychological triggers** and context-heavy stories that slip past standard filters.

## 💡 The Solution: Hybrid AI Architecture
ScamShield is not just a keyword matcher. It uses a **Dual-Brain System** to catch what others miss:

1.  **⚡ The Speed Brain (Naive Bayes):** Instantly flags known spam patterns and keywords (Offline & Fast).
2.  **🧠 The Reasoning Brain (Llama 3 via Groq):** Analyzes the *context* and *intent* of the message. It detects subtle social engineering attacks like false urgency, authority bias, and emotional manipulation.

**The "Smart Override" Protocol:**
If the Speed Brain says "Safe" but the Reasoning Brain detects a psychological trap, the system **overrides the score to High Risk** and explains exactly why.

---

## ✨ Key Features
* **Quick Scan:** Paste any text (SMS, Email, WhatsApp) for instant analysis.
* **Screenshot Scan:** Upload an image of a chat; OCR extracts text for analysis.
* **AI Insight:** Get a human-readable explanation of *why* a message is dangerous.
* **Risk Scoring:** Dynamic 0-100% risk assessment.
* **History Log:** Local storage keeps track of your past scans.

---

## 🛠️ Tech Stack

### **Frontend (The Face)**
* **Framework:** React + Vite
* **Styling:** Tailwind CSS + Shadcn UI
* **Icons:** Lucide React
* **Deployment:** Vercel

### **Backend (The Brain)**
* **Server:** Python (Flask)
* **ML Engine:** Scikit-Learn (Naive Bayes Classifier)
* **LLM Engine:** Groq API (llama-3.3-70b-versatile)
* **Deployment:** Render

---

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/JohnConfidence556/scamshield-backend.git](https://github.com/JohnConfidence556/scamshield-backend.git)
cd scamshield-backend

### 2. Setup Backend (Python)
```bash
# Install dependencies
pip install flask flask-cors pandas scikit-learn groq python-dotenv gunicorn

# Setup Environment Variables
# Create a .env file and add:
GROQ_API_KEY=gsk_your_key_here

# Run Server
python main.py

```

### 3. Setup Frontend (React)
```bash
# Install dependencies
npm install

# Run Development Server
npm run dev
```
---

## 📸 Usage Examples
Case 1: The "Hi Mum" Scam
Input: "Hi Mum, I lost my phone. Please transfer N20,000 to this friend's account."

Standard Filter: ✅ Safe (No bad keywords).

ScamShield: 🚨 High Risk. AI Insight: "Contextual Scam Detected. The sender is using a 'fake emergency' to bypass logical thinking."

Case 2: The Fake Bank
Input: "Access Bank: Your BVN is blocked. Click here to verify."

Standard Filter: 🚨 High Risk (Keyword: BVN). ScamShield: 🚨 High Risk.

---
## 📸 Usage Examples
John Confidence - Lead Engineer

---

Built for the Alameda Hacks Hackathon 2026.
