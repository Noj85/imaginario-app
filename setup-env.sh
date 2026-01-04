#!/bin/bash

# Script para configurar la API key de OpenAI
echo "Configurando API key de OpenAI..."

API_KEY="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"

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
