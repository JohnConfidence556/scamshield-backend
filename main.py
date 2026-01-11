import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

try:
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    client = None
    print(f"Groq Client Error: {e}")

# --- ML & DATA SETUP (Same as before) ---
GLOBAL_KEYWORDS = [
    "urgent", "winner", "congratulations", "won", "prize", 
    "irs", "tax", "ssn", "social security", "parcel", "delivery",
    "appleid", "reset password", "verify", "suspended", "bvn", "nin",
    "bitcoin", "investment", "profit", "credit card", "bank",
    "click here", "link", "act now", "expires", "opt out"
]

def train_model():
    if os.path.exists("spam.csv"):
        try:
            df = pd.read_csv("spam.csv", encoding="latin-1")
            df = df.rename(columns={"v1": "label", "v2": "text"})
        except:
            df = get_emergency_data()
    else:
        df = get_emergency_data()

    model = make_pipeline(TfidfVectorizer(stop_words='english'), MultinomialNB())
    model.fit(df['text'], df['label'])
    return model

def get_emergency_data():
    data = [
        ("Your package is pending delivery. Click here.", "spam"),
        ("IRS: You have a tax refund pending.", "spam"),
        ("Hey, are we still on for dinner?", "ham"),
        ("Your verification code is 1234.", "ham")
    ]
    return pd.DataFrame(data, columns=['text', 'label'])

model = train_model()

# THE SMART LOGIC
def get_llm_insight(text, status, keywords):
    if not client:
        return "AI Insight unavailable.", False 

    try:
        # We ask the AI to be the JUDGE
        prompt = f"""
        Analyze this text: "{text}"
        
        Current Status: {status}
        Keywords: {keywords}
        
        Task: 
        1. Explain WHY it is safe or dangerous in 2 sentences.
        2. If you strongly believe this IS a scam (even if status says Safe), include the word "DANGEROUS" in your response.
        """

        completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        response_text = completion.choices[0].message.content.strip()
        
        # Check if LLM thinks it's dangerous
        is_actually_dangerous = "dangerous" in response_text.lower() or "scam" in response_text.lower()
        
        return response_text, is_actually_dangerous

    except Exception as e:
        print(f"Groq Error: {e}")
        return "Standard analysis applies.", False

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"}), 400
    
    # Old Brain Prediction
    prediction = model.predict([text])[0]
    prob = model.predict_proba([text])[0].max()
    found_keywords = [word for word in GLOBAL_KEYWORDS if word in text.lower()]
    
    risk_score = int(prob * 100)
    if prediction == 'spam':
        status = "High Risk"
    elif found_keywords:
        status = "Low Risk" 
        risk_score = 45 
    else:
        status = "Safe"
        risk_score = 10

    # Ask New Brain (LLM)
    ai_advice, llm_thinks_dangerous = get_llm_insight(text, status, found_keywords)

    # If LLM detects a scam that the Old Brain missed, we force High Risk
    if status == "Safe" and llm_thinks_dangerous:
        status = "High Risk"
        risk_score = 85 
        
        if not found_keywords:
            found_keywords = ["AI Detected Context Scam"]

    return jsonify({
        "status": status,
        "score": risk_score,
        "keywords": found_keywords,
        "advice": ai_advice 
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)