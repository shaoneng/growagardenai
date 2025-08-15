#!/bin/bash
# Quick start script for pet display system

echo "🐾 Starting Grow a Garden Pet Display System..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the growagarden directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting development server..."
echo "Visit these URLs to test the pet system:"
echo "  - Main pets page: http://localhost:3000/pets"
echo "  - Image test page: http://localhost:3000/pet-images-test.html"
echo ""

npm run dev
