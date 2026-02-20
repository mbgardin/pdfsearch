#!/bin/bash

# Define text colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=======================================${NC}"
echo -e "${BLUE}    Starting PDF Search Engine...    ${NC}"
echo -e "${BLUE}=======================================${NC}"

# Handle graceful shutdown on Ctrl+C
trap 'echo -e "\n${RED}Shutting down servers...${NC}"; kill $BACKEND_PID; kill $FRONTEND_PID; exit' SIGINT

# --- 1. Python Backend Setup ---
echo -e "\n${GREEN}[1/2] Setting up Python API Backend...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install requirements
echo "Checking Python dependencies..."
pip install -r requirements.txt -q

# Start FastAPI backend in the background
echo "Starting FastAPI on port 8000..."
uvicorn api:app --reload --host 0.0.0.0 --port 8000 > api.log 2>&1 &
BACKEND_PID=$!

# --- 2. React Frontend Setup ---
echo -e "\n${GREEN}[2/2] Setting up Vite React Frontend...${NC}"

cd web-app

# Install Node modules if needed
if [ ! -d "node_modules" ]; then
    echo "Installing NPM dependencies..."
    npm install
fi

# Start Vite React dev server
echo -e "\n${GREEN}🚀 Application is running!${NC}"
echo -e "${BLUE}-> Press Ctrl+C at any time to quit both servers safely.${NC}\n"
npm run dev &
FRONTEND_PID=$!

# Wait indefinitely until the user presses Ctrl+C, allowing trap to catch it
wait
