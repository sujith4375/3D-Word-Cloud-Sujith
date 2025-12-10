# 3D Word Cloud

Visualize topics from a news article as a 3D word cloud.

---

## Prerequisites

- Python 3.9+
- Node.js (LTS, with npm)

---

## Run the backend (FastAPI)

1. Open a terminal in the `backend` folder:


2. Create and activate a virtual environment:

- Windows (PowerShell):

  ```
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```

- Windows (cmd):

  ```
  python -m venv .venv
  .venv\Scripts\activate.bat
  ```

- macOS / Linux:

  ```
  python -m venv .venv
  source .venv/bin/activate
  ```

3. Install dependencies: pip install -r requirements.txt


4. Start the API: python -m uvicorn app.main:app --reload --port 8000


5. Check it:

- Docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/health`

---

## Run the frontend (React + Vite)

1. Open a second terminal in the `frontend` folder:

cd frontend


2. Install dependencies:

npm install


3. Start the dev server:

npm run dev


4. Open in the browser:

http://localhost:5173/


---

## Use the app

1. Ensure backend (`:8000`) and frontend (`:5173`) are both running.  
2. In the web UI, enter a news article URL (or use a sample).  
3. Click **Analyze** to see an interactive 3D word cloud of extracted topics.


