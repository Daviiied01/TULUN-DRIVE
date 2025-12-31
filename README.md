
# 🏍️ MotoGestion - Sistema de Control de Carreras

Este proyecto es una plataforma integral para la gestión, control y liquidación de carreras de motorizados.

## 🚀 Cómo empezar

### 1. Instalación
```bash
npm install
```

### 2. Desarrollo
```bash
npm run dev
```

## 🤖 Automatización (GitHub Actions)

¡Este repositorio está configurado con **CI/CD**! 

- Cada vez que hagas un `git push origin main`, GitHub activará una **Action** (puedes verla en la pestaña "Actions" de tu repositorio).
- El sistema compilará automáticamente el proyecto y actualizará tu sitio web en **GitHub Pages**.
- No necesitas ejecutar `npm run deploy` manualmente una vez que configures el repositorio.

## 🌐 Configuración inicial en GitHub

Para que la automatización funcione:
1. Sube tu código a GitHub.
2. Ve a la pestaña **Settings** > **Pages** de tu repositorio.
3. En **Build and deployment** > **Source**, asegúrate de que esté seleccionado "Deploy from a branch".
4. Selecciona la rama `gh-pages` y la carpeta `/(root)`.
5. ¡Listo! Tu sitio se actualizará solo.

---
## 🛠️ Tecnologías
* **React 19** + **TypeScript**
* **Vite** (Build tool)
* **GitHub Actions** (Automatización)
* **Tailwind CSS**
