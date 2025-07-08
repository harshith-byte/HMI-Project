# DIW Data Narrator

Explore key economic indicators and trends across Germany's regions through interactive data, AI-powered chat, and audio summaries.

## 🔍 Features
- **Indicator Dashboard**: Select from domains like Labour, Gender Equality, Macroeconomy, etc.
- **AI Assistant**: Get contextual summaries and ask questions.
- **Podcast Generator**: Convert economic data into voice/audio summaries.
- **Story Templates**: Generate structured data narratives (Trend, Impact, Problem-Solution, etc.).
- **Data Explorer**: Filter indicators, visualize trends using interactive charts and tables.
- **Research Stories**: Read domain-specific or cross-domain stories with stakeholders and timeline breakdowns.

## 📊 Domains Covered
- Labour
- Gender Equality
- Macroeconomy
- Energy
- Many mores

## 🛠️ Tech Stack
- **Frontend**: React + TailwindCSS
- **Backend**: Flask (Python)
- **Database**: PostgreSQL
- **Visualization**: Chart.js, Plotly
- **Audio**: Text-to-Speech (TTS)

## 📁 Directory Structure
── Frontend/
│   ├── components/
│   ├── pages/
│   └── assets/
├── Backend/
│   ├── app.py
│   ├── routes/       # All API routes
│   ├── services/     # DB access and logic
│   ├── lib/
│   │   └── data_loader.py  # Load data to PostgreSQL
│   └── src/
│       └── core/
├── Data/
│   ├── PDFs/         # Original DIW Berlin PDF reports
│   └── CSVs/         # Processed indicators, observations

## 🚀 Getting Started

### 🗂️ Backend Setup
```bash
# Step 1: Navigate to Backend folder
cd Backend

# Step 2: Install dependencies
pip install -r requirements.txt

# Step 3: Set environment and run Flask
set FLASK_APP=manage.py
flask run

Visit: http://127.0.0.1:5000/api/load-data✅ Output: "Enhanced Flask backend with comprehensive data visualization APIs! 🚀📊"
Load Data into PostgreSQL

Use lib/data_loader.py to load all CSVs into PostgreSQL (via pgAdmin or CLI).

Required tables: indicators, visual_entities, observations, documents.

💻 Frontend Setup

# Step 1: Navigate to Frontend folder
cd Frontend

# Step 2: Install dependencies
npm install

# Step 3: Start development server
npm run dev
