#!/usr/bin/env python3
"""
Panini Parser FastAPI Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .controllers.game_controller import router as game_router

app = FastAPI(
    title="Panini Parser API",
    description="Backend API for Sanskrit parsing game using Vidyut engine",
    version="0.1.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and common dev ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
# app.include_router(word_router, prefix="/api/v1")
app.include_router(game_router, prefix="/api/v1")

def start_server():
    """Start the FastAPI server - used by CLI script"""
    uvicorn.run(
        "backend.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )


if __name__ == "__main__":
    start_server()