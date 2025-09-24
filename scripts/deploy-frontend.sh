#!/bin/bash

# Frontend deployment script for Netlify

echo "🚀 Starting frontend deployment..."

# Build the application
echo "📦 Building application..."
cd frontend
npm install
npm run build

echo "✅ Build completed!"
echo "🔗 Deploy to Netlify using the netlify.toml configuration"
echo "📋 Don't forget to set environment variables in Netlify dashboard"

echo "Environment variables to set:"
echo "- NEXT_PUBLIC_API_URL=https://your-koyeb-backend.koyeb.app"
echo "- NEXT_PUBLIC_SITE_URL=https://your-netlify-site.netlify.app"
echo "- NEXT_PUBLIC_SITE_NAME=Velog Clone"
echo "- NODE_ENV=production"
echo "- NEXT_TELEMETRY_DISABLED=1"