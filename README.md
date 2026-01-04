# El Imaginario

Una aplicación web introspectiva que genera palabras emocionales personalizadas usando inteligencia artificial, como souvenir para la campaña de la película sobre salud mental.

## 🎬 Sobre el Proyecto

Esta aplicación forma parte de la campaña **#TodosSomosAliens #HablemosdeSaludMental** de una película. Permite a los usuarios explorar sus emociones de manera creativa y respetuosa, generando palabras inventadas que simbolizan su estado emocional.

## ✨ Características

- **Interfaz intuitiva**: Tres campos para ingresar palabras que describen el estado emocional
- **Generación IA**: Usa OpenAI para crear palabras inventadas, definiciones simbólicas y consejos empáticos
- **Diseño poético**: Estética limpia e introspectiva con animaciones suaves
- **Completamente responsivo**: Funciona en móviles, tablets y escritorio
- **Accesibilidad**: Diseño inclusivo con soporte para reducción de movimiento

## 🚀 Tecnologías

- **React 18** - Framework frontend
- **Vite** - Build tool y dev server
- **OpenAI API** - Generación de contenido creativo
- **CSS3** - Estilos con animaciones personalizadas
- **ESLint** - Linting de código

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 16+
- npm o yarn
- Cuenta de OpenAI con API key

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd imaginario-app
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la API key de OpenAI:

**Configuración local (.env.local):**
Crea un archivo `.env.local` en la raíz del proyecto con:
```
VITE_OPENAI_API_KEY=tu_clave_de_api_de_openai_aqui
```

**Configuración alternativa (Navegador):**
Si prefieres configurar en el navegador, ejecuta `npm run dev` y luego en la consola del navegador (F12 → Console):
```javascript
window.OPENAI_API_KEY = "tu_clave_de_api"
```

4. Las imágenes están en `public/images/`:
   - `alien.png` - Imagen de fondo del alienígena
   - `losimaginarios.png` - Logo de la película
   - `piafproducciones.png` - Logo de la productora

### Desarrollo

```bash
npm run dev
```

**Nota**: La aplicación está diseñada para funcionar tanto con configuración de archivo como con configuración dinámica en el navegador. Incluye manejo automático de rate limiting con reintentos exponenciales.

La aplicación estará disponible en `http://localhost:5173`

### Build para producción

```bash
npm run build
npm run preview
```

## 🚀 Deployment en Vercel

### Configuración Inicial

1. **Sube el código a GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/imaginario-app.git
git push -u origin main
```

2. **Conecta con Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Vite

3. **Configura Variables de Entorno en Vercel:**
   - Ve a Project Settings > Environment Variables
   - Agrega: `VITE_OPENAI_API_KEY` con tu clave de OpenAI
   - Selecciona todos los ambientes (Production, Preview, Development)

4. **Deploy:**
   - Vercel desplegará automáticamente
   - Cada push a `main` generará un nuevo deploy

### Configuración de Vercel

El proyecto incluye `vercel.json` con la configuración necesaria:
- Framework: Vite
- Output Directory: `dist`
- Rewrites para SPA (Single Page Application)

### Notas Importantes

- ✅ Las imágenes deben estar en `public/images/` (ya configurado)
- ✅ La variable `VITE_OPENAI_API_KEY` debe configurarse en Vercel Dashboard
- ✅ El build se ejecuta automáticamente en cada deploy
- ✅ Vercel maneja automáticamente el routing de SPA

## 📱 Uso

1. **Ingresa tus palabras**: Escribe tres palabras que describan cómo te sientes
2. **Genera**: Haz clic en "Generar palabra"
3. **Explora**: Recibe una palabra inventada con su definición simbólica y un consejo empático
4. **Repite**: Crea tantas palabras como desees

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes React
│   ├── WordInputs.jsx   # Campos de entrada
│   ├── GenerateButton.jsx # Botón de generación
│   ├── ResultDisplay.jsx # Muestra resultados
│   └── AlienImage.jsx   # Imagen del alien
├── services/
│   └── aiService.js     # Integración con OpenAI
├── styles/
│   ├── App.css         # Estilos principales
│   └── animations.css  # Animaciones CSS
├── utils/
│   └── validation.js   # Utilidades de validación
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada
```

## 🎨 Diseño

- **Paleta de colores**: Cinematográfica oficial del poster (#TodosSomosAliens) - Deep black, atmospheric green, warm halos
- **Tipografía**: Inter con fluid typography (clamp) para escalabilidad perfecta
- **Diseño**: Glassmorphism, backdrop blur, sombras modernas, espaciado generoso
- **Animaciones**: Micro-interacciones suaves, cubic-bezier transitions, efectos hover elegantes
- **UX**: Estados hover/focus sofisticados, feedback visual inmediato, responsive design moderno
- **Layout**: Mobile-first con breakpoints responsivos

## 🔒 Seguridad

- La API key de OpenAI se configura vía variables de entorno
- Para producción, considera implementar un backend proxy para proteger la API key
- Validación de inputs en el cliente

## 🔧 Troubleshooting

### Error: "OPENAI_API_KEY environment variable is missing"
**Solución:**
1. Crea archivo `.env.local` en la raíz del proyecto
2. Agrega: `VITE_OPENAI_API_KEY=tu_clave_de_api`
3. Reinicia el servidor: `npm run dev`

### Error: "operation not permitted, open '.env.local'"
**Solución alternativa:**
1. Ejecuta `npm run dev`
2. Abre consola del navegador (F12)
3. Ejecuta: `window.OPENAI_API_KEY = "tu_clave_de_api"`

### Error: "429 Too Many Requests" o "RateLimitError"
**Causas posibles:**
- Límite de tarifa excedido (demasiadas solicitudes por minuto)
- Cuota de la cuenta OpenAI agotada (cuenta gratuita)
- Problemas de facturación

**Soluciones:**
1. **Espera y reintenta**: La aplicación tiene retry automático con backoff exponencial
2. **Revisa tu cuenta OpenAI**: Ve a https://platform.openai.com/account/billing
3. **Actualiza tu plan**: Cambia a un plan pago si usas mucho la aplicación
4. **Reduce la frecuencia**: Espera entre solicitudes

### Error: "You exceeded your current quota"
**Solución:**
1. Ve a https://platform.openai.com/account/billing
2. Revisa tu plan actual y uso
3. Agrega método de pago si es necesario
4. Considera cambiar a un plan pago

### Build funciona pero dev server falla
- Reinicia tu terminal/editor
- Verifica que no haya procesos de Vite corriendo
- Usa `npm run build` para verificar que el código compila

### La imagen del alienígena no aparece
- Verifica que `public/images/alien.png` existe
- Las imágenes deben estar en `public/images/` para que Vite las sirva correctamente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de una campaña promocional. Consulta los términos específicos de la película.

## 🙏 Agradecimientos

- Equipo de la película por la inspiración
- Comunidad de salud mental por el enfoque empático
- OpenAI por la tecnología de IA creativa

---

*#TodosSomosAliens #HablemosdeSaludMental*
