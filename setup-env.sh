#!/bin/bash

# Script para configurar la API key de OpenAI
echo "Configurando API key de OpenAI..."

API_KEY="YOUR_OPENAI_API_KEY_HERE"

# Crear archivo .env.local
cat > .env.local << EOF
VITE_OPENAI_API_KEY=${API_KEY}
EOF

echo "✅ Archivo .env.local creado correctamente"
echo "API Key configurada: ${API_KEY:0:20}..."
echo ""
echo "Para iniciar la aplicación:"
echo "  npm run dev"
echo ""
echo "Si aún hay problemas, reinicia tu terminal/editor y ejecuta npm run dev nuevamente."
