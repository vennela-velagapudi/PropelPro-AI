# 🚀 PropelPro AI

An AI-powered sales proposal generation platform that helps businesses create personalized B2B proposals, compare proposal versions, and prepare for client negotiations using Large Language Models (LLMs).

---

## 📖 Overview

PropelPro AI streamlines the sales proposal creation process by transforming client requirements into professional, customized proposals within seconds. It also provides version tracking, AI-assisted proposal comparison, and a live negotiation simulator to help sales teams improve deal success.

---

## ✨ Features

- 🤖 AI-powered proposal generation
- 📝 Executive summary and risk assessment generation
- 📂 Proposal version history and semantic comparison
- 💬 Live AI negotiation simulator
- 📄 One-click PDF export
- 🔐 Secure user authentication using JWT
- 📱 Responsive and intuitive user interface

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Markdown
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- OpenAI SDK
- SQLAlchemy

### Database & Storage
- SQLite
- JSON

### Authentication
- JWT (python-jose)
- bcrypt

---

## 📂 Project Structure

```
propelpro-ai/
│
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── database.py
│   ├── llm.py
│   ├── models.py
│   ├── prompts.py
│   ├── versioning.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    ├── src/
    ├── package.json
    └── App.js
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/PropelPro-AI.git
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app:app --reload
```

### Frontend Setup

```bash
cd frontend

npm install

npm start
```

Create a `.env` file in the backend directory and configure your API keys and environment variables.

---

## 💡 How It Works

1. User logs in securely.
2. Enter client details such as:
   - Client Name
   - Industry
   - Budget
   - Services
   - Discovery Notes
3. AI generates a complete sales proposal.
4. Save proposal versions for future comparison.
5. Practice client conversations using the AI Negotiation Simulator.
6. Export the final proposal as a PDF.

---

## 📊 Core Modules

- User Authentication
- AI Proposal Generator
- Proposal Version Control
- Semantic Comparison
- Negotiation Simulator
- PDF Export

---

## 🎯 Applications

- Sales Teams
- Business Consultants
- IT Service Companies
- SaaS Organizations
- Freelancers
- Revenue Operations Teams

---

## 🔮 Future Enhancements

- CRM Integration (Salesforce, HubSpot, Pipedrive)
- Multi-Agent AI Workflow
- Interactive Web-Based Proposals
- Voice-to-Text Client Notes
- Advanced Proposal Analytics

---

## 👨‍💻 Learning Outcomes

This project demonstrates practical experience with:

- Generative AI & Prompt Engineering
- Large Language Model Integration
- Full-Stack Web Development
- REST API Development
- JWT Authentication
- React & FastAPI
- Database Design
- Version Control & Document Comparison
- AI-assisted Business Automation

---

## 📄 License

This project was developed for learning purposes.
