# PDF Search Engine

A full-stack, blazing fast web application for searching, validating, and filtering PDF documents across the web.

## Features
- **Instant Search:** Leverages DuckDuckGo (`ddgs`) to scrape the web for public PDF links.
- **Concurrent Validation:** Uses `aiohttp` and `asyncio` to simultaneously validate all returned links by checking their `Content-Type` headers rapidly.
- **Page Count Filtering:** Downloads temporary documents dynamically to extract exact page counts and automatically filter lengths before returning results to the user.
- **Modern UI:** Built on React, TypeScript, and TailwindCSS for a beautiful gradient-based dark-mode design.

---

## 🚀 Quick Start (Local Deployment)

We have bundled the entire application (Python Backend + React Frontend) into a single startup script. This script automatically handles Python virtual environments, NPM dependency installs, and concurrent server binding.

1. Open your terminal in the root directory of this project (`/pdfsearch`).
2. Run the startup script:

   ```bash
   ./start.sh
   ```

3. The script will output a local URL (e.g. `http://localhost:5173/`).
4. Click or copy the URL into your browser to use the app!

### Shutting Down
To gracefully exit both the backend and frontend servers, simply press `Ctrl + C` in the terminal running the `start.sh` script.

---

## Manual Execution

If you prefer to run the components independently or debug them:

### 1. Start the API Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run the FastAPI server on port 8000
uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend
In a separate terminal window:
```bash
cd web-app
npm install

# Run the Vite development server
npm run dev
```
