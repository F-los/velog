#!/bin/bash

# Backend deployment script for Koyeb

echo "🚀 Starting backend deployment..."

# Build the application
echo "📦 Building application..."
cd backend
npm install
npm run build

echo "✅ Build completed!"
echo "🔗 Deploy to Koyeb using the koyeb.yaml configuration"
echo "📋 Don't forget to set environment variables in Koyeb dashboard"

echo "Environment variables to set:"
echo "- NODE_ENV=production"
echo "- PORT=8000"
echo "- FRONTEND_URL=https://your-netlify-site.netlify.app"
echo "- JWT_SECRET=your-super-secret-jwt-key-here"
echo "- JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-here"
echo "- DATABASE_URL=your-postgresql-url"
echo "- DISABLE_DB=false"