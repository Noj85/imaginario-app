# 🚀 Guía de Deployment - El Imaginario

## Preparación para Producción

### ✅ Checklist Pre-Deployment

- [x] Build exitoso sin errores
- [x] Todas las imágenes en `public/images/`
- [x] Variables de entorno documentadas
- [x] Configuración de Vercel lista
- [x] README actualizado

## 📦 Subir a GitHub

### 1. Inicializar Repositorio (si no existe)

```bash
git init
git add .
git commit -m "Initial commit: El Imaginario - App de palabras emocionales"
```

### 2. Conectar con GitHub

```bash
git remote add origin https://github.com/tu-usuario/imaginario-app.git
git branch -M main
git push -u origin main
```

### 3. Verificar Archivos Importantes

Asegúrate de que estos archivos estén en el repositorio:
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `vercel.json`
- ✅ `public/images/` (con todas las imágenes)
- ✅ `.env.example` (sin la API key real)
- ✅ `.gitignore` (excluyendo `.env.local`)

## 🌐 Deployment en Vercel

### Paso 1: Conectar Repositorio

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Click en "Add New Project"
4. Selecciona tu repositorio `imaginario-app`
5. Vercel detectará automáticamente que es un proyecto Vite

### Paso 2: Configurar Variables de Entorno

**IMPORTANTE**: Antes del primer deploy, configura la variable de entorno:

1. En la pantalla de configuración del proyecto, ve a "Environment Variables"
2. Agrega:
   - **Name**: `VITE_OPENAI_API_KEY`
   - **Value**: Tu clave de API de OpenAI
   - **Environments**: Selecciona Production, Preview y Development

### Paso 3: Configuración del Proyecto

Vercel debería detectar automáticamente:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Si no detecta automáticamente, usa estos valores manualmente.

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera a que termine el build (1-2 minutos)
3. Tu app estará disponible en `https://tu-proyecto.vercel.app`

## 🔄 Deployments Automáticos

Vercel configurará automáticamente:
- **Production**: Cada push a `main` branch
- **Preview**: Cada push a otras ramas o pull requests

## 🔧 Troubleshooting

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel Dashboard
- Asegúrate de que `VITE_OPENAI_API_KEY` esté configurada

### Error: "Images not found"
- Verifica que las imágenes estén en `public/images/`
- Las rutas deben ser `/images/nombre.png` (con `/` al inicio)

### Error: "API Key not found"
- Verifica que `VITE_OPENAI_API_KEY` esté en Environment Variables
- Asegúrate de haber seleccionado todos los ambientes
- Reinicia el deployment después de agregar la variable

## 📝 Notas Importantes

- **API Key**: Nunca subas tu `.env.local` a GitHub
- **Imágenes**: Deben estar en `public/images/` para que Vite las sirva
- **Build**: El build se ejecuta automáticamente en cada push
- **Dominio**: Vercel proporciona un dominio gratuito, puedes agregar uno personalizado después

## 🎯 Post-Deployment

Después del primer deploy exitoso:
1. Verifica que la app funcione correctamente
2. Prueba generar una palabra emocional
3. Verifica que las imágenes se carguen correctamente
4. Revisa la consola del navegador por errores

---

¡Tu aplicación "El Imaginario" está lista para producción! 🎭✨
