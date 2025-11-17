# 🍎 Calculadora Glucémica - PWA Web

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Herramienta profesional para calcular índice y carga glucémica de alimentos**

[Demo en Vivo](https://sb-302iewmpzlth.vercel.run) · [Reportar Bug](#-contribuir) · [Solicitar Feature](#-contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [PWA Features](#-pwa-features)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Acerca del Proyecto

**Calculadora Glucémica** es una Progressive Web App (PWA) diseñada para ayudar a personas con diabetes, nutricionistas y cualquier persona interesada en controlar su alimentación mediante el cálculo preciso de:

- **Índice Glucémico (IG)**: Velocidad con la que un alimento eleva la glucosa en sangre
- **Carga Glucémica (CG)**: Impacto real del alimento considerando la cantidad consumida
- **IRE (Índice de Respuesta Energética)**: Respuesta metabólica del alimento
- **VG (Valor Glucémico)**: Valor glucémico total del alimento

### 🎨 Capturas de Pantalla

```
┌─────────────────────────────────────────────────────────┐
│  🍎 Calculadora Glucémica                               │
│  ─────────────────────────────────────────────────────  │
│  👤 Perfil Usuario    🔍 Búsqueda    📊 Resumen        │
│  ─────────────────────────────────────────────────────  │
│  📱 Scanner de Códigos de Barras                        │
│  📋 Gestión de Plantillas/Recetas                       │
│  💾 Exportación CSV/PDF                                 │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Características

### 🔥 Características Principales

- ✅ **Base de Datos Extensa**: 320+ alimentos con información nutricional completa
- ✅ **Búsqueda Inteligente**: Sistema de búsqueda avanzado con algoritmo Trie para resultados instantáneos
- ✅ **Cálculos Precisos**: CG, IG, IRE, VG calculados automáticamente
- ✅ **Perfil de Usuario**: Personalización con peso, altura, edad y nivel de actividad
- ✅ **Gestión de Comidas**: Organiza alimentos por tipo de comida (Desayuno, Almuerzo, Cena, Snack)
- ✅ **Scanner de Códigos de Barras**: Escanea productos para agregar automáticamente
- ✅ **Sistema de Plantillas**: Guarda y reutiliza combinaciones de alimentos frecuentes
- ✅ **Exportación de Datos**: Exporta tus cálculos en formato CSV o PDF
- ✅ **PWA Completo**: Funciona offline, instalable en dispositivos móviles
- ✅ **Responsive Design**: Optimizado para móviles, tablets y desktop
- ✅ **Modo Oscuro**: Interfaz adaptable a preferencias del usuario
- ✅ **Accesibilidad**: Cumple con estándares WCAG

### 📊 Cálculos Nutricionales

```typescript
// Ejemplo de cálculos realizados
Carga Glucémica (CG) = (IG × Carbohidratos × Cantidad) / 10000
IRE = CG × Factor de Actividad
VG = IG × Cantidad / 100
```

### 🎯 Casos de Uso

- **Personas con Diabetes**: Control preciso de la carga glucémica diaria
- **Nutricionistas**: Herramienta profesional para planificación de dietas
- **Deportistas**: Optimización de la ingesta de carbohidratos
- **Salud General**: Control de alimentación saludable

---

## 🛠 Tecnologías

### Core

- **[Next.js 15.0.3](https://nextjs.org/)** - Framework React con SSR y SSG
- **[React 18.3.1](https://react.dev/)** - Biblioteca de UI
- **[TypeScript 5.6.3](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS 3.4.14](https://tailwindcss.com/)** - Framework CSS utility-first

### UI Components

- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles sin estilos
  - Dialog, Select, Switch, Accordion, Alert Dialog, Progress, Separator
- **[Lucide React](https://lucide.dev/)** - Iconos modernos
- **[CVA](https://cva.style/)** - Class Variance Authority para variantes de componentes

### Features

- **[jsPDF](https://github.com/parallax/jsPDF)** - Generación de PDFs
- **[jsPDF AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)** - Tablas en PDF
- **[Quagga](https://github.com/serratus/quaggaJS)** - Scanner de códigos de barras

### Development

- **[ESLint](https://eslint.org/)** - Linter de código
- **[PostCSS](https://postcss.org/)** - Transformación de CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Prefijos CSS automáticos

---

## 🚀 Instalación

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **yarn** >= 1.22.0

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/nutrion.git
cd Nutrion
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
# o
yarn dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

### 🐳 Docker (Opcional)

```dockerfile
# Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t calculadora-glucemica .
docker run -p 3000:3000 calculadora-glucemica
```

---

## 📖 Uso

### 1. Configurar Perfil

```
1. Haz clic en "Perfil de Usuario"
2. Ingresa tu información:
   - Peso (kg)
   - Altura (cm)
   - Edad (años)
   - Nivel de actividad (Sedentario, Ligero, Moderado, Activo, Muy Activo)
3. Guarda el perfil
```

### 2. Agregar Alimentos

**Método 1: Búsqueda Manual**
```
1. Escribe el nombre del alimento en el buscador
2. Haz clic en "Agregar"
3. Ajusta la cantidad (gramos)
```

**Método 2: Modal de Búsqueda**
```
1. Haz clic en "🔍 Buscar Alimento"
2. Busca en la base de datos
3. Selecciona el alimento
4. Ingresa la cantidad
```

**Método 3: Scanner de Código de Barras**
```
1. Haz clic en "📱 Escanear Código"
2. Permite acceso a la cámara
3. Escanea el código de barras del producto
4. El alimento se agregará automáticamente
```

### 3. Gestionar Plantillas

```
1. Agrega varios alimentos a tu lista
2. Haz clic en "💾 Guardar como Plantilla"
3. Asigna un nombre a la plantilla
4. Reutiliza la plantilla en futuras comidas
```

### 4. Exportar Datos

**CSV**
```
1. Haz clic en "📥 Exportar CSV"
2. El archivo se descargará automáticamente
3. Abre con Excel, Google Sheets, etc.
```

**PDF**
```
1. Haz clic en "📄 Exportar PDF"
2. El PDF se generará con:
   - Información del perfil
   - Lista de alimentos
   - Resumen nutricional
   - Cálculos detallados
```

---

## 📁 Estructura del Proyecto

```
Nutrion/
├── public/
│   ├── manifest.json          # Configuración PWA
│   ├── sw.js                  # Service Worker
│   └── apple-touch-icon.png   # Icono iOS
├── src/
│   ├── app/
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página principal
│   ├── components/
│   │   ├── ui/                # Componentes UI base (shadcn)
│   │   ├── BarcodeScanner.tsx # Scanner de códigos
│   │   ├── ExportControls.tsx # Controles de exportación
│   │   ├── FoodCards.tsx      # Tarjetas de alimentos
│   │   ├── FoodSearchModal.tsx# Modal de búsqueda
│   │   ├── FoodTable.tsx      # Tabla de alimentos
│   │   ├── NutritionalSummary.tsx # Resumen nutricional
│   │   ├── ProfilePanel.tsx   # Panel de perfil
│   │   └── RecipeManager.tsx  # Gestor de plantillas
│   ├── hooks/
│   │   ├── useFoodDatabase.ts # Hook base de datos
│   │   ├── useProfile.ts      # Hook perfil usuario
│   │   ├── useNutritionalCalculations.ts # Hook cálculos
│   │   └── useLocalStorage.ts # Hook localStorage
│   ├── lib/
│   │   ├── foodDatabase.ts    # Base de datos de alimentos
│   │   ├── eanMapping.ts      # Mapeo códigos EAN
│   │   ├── searchTrie.ts      # Algoritmo de búsqueda
│   │   └── utils.ts           # Utilidades
│   └── types/
│       └── nutrition.ts       # Tipos TypeScript
├── next.config.js             # Configuración Next.js
├── tailwind.config.js         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
└── package.json               # Dependencias
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (localhost:3000)

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia servidor de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar código

# Análisis
npm run analyze      # Analiza el tamaño del bundle (si está configurado)
```

---

## 📱 PWA Features

### Service Worker

El Service Worker (`/public/sw.js`) proporciona:

- ✅ **Caché de Assets**: Archivos estáticos cacheados para acceso offline
- ✅ **Caché de API**: Respuestas de API cacheadas
- ✅ **Estrategia Network First**: Intenta red primero, fallback a caché
- ✅ **Actualización Automática**: Detecta y actualiza nuevas versiones

### Manifest

El archivo `manifest.json` configura:

```json
{
  "name": "Calculadora Glucémica",
  "short_name": "CalcGluc",
  "description": "Calculadora de índice y carga glucémica",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2e8b57",
  "icons": [...]
}
```

### Instalación

**Android (Chrome)**
```
1. Abre la app en Chrome
2. Toca el menú (⋮)
3. Selecciona "Agregar a pantalla de inicio"
```

**iOS (Safari)**
```
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"
```

**Desktop (Chrome/Edge)**
```
1. Abre la app en el navegador
2. Haz clic en el icono de instalación en la barra de direcciones
3. Confirma la instalación
```

---

## 🧪 Testing

### Testing Manual

1. **Funcionalidad Básica**
   - [ ] Agregar alimentos
   - [ ] Modificar cantidades
   - [ ] Eliminar alimentos
   - [ ] Cambiar tipo de comida

2. **Búsqueda**
   - [ ] Búsqueda por nombre
   - [ ] Búsqueda en modal
   - [ ] Resultados instantáneos

3. **Scanner**
   - [ ] Escanear código de barras
   - [ ] Agregar producto escaneado
   - [ ] Manejo de errores

4. **Exportación**
   - [ ] Exportar CSV
   - [ ] Exportar PDF
   - [ ] Verificar contenido

5. **PWA**
   - [ ] Funciona offline
   - [ ] Instalable
   - [ ] Service Worker activo

### Testing Automatizado (Futuro)

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork el proyecto**
2. **Crea una rama** (`git checkout -b feature/AmazingFeature`)
3. **Commit tus cambios** (`git commit -m 'Add: Amazing Feature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Guía de Estilo

- Usa TypeScript para todo el código
- Sigue las convenciones de ESLint
- Escribe commits descriptivos (Conventional Commits)
- Documenta funciones complejas
- Agrega tests para nuevas features

### Reportar Bugs

Abre un issue con:
- Descripción del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots (si aplica)
- Información del navegador/dispositivo

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

```
MIT License

Copyright (c) 2024 Sarmiento

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👤 Contacto

**Sarmiento**

- GitHub: [@sarmiento](https://github.com/sarmiento)
- Email: contact@example.com
- Website: [https://calculadora-glucemica.vercel.app](https://sb-302iewmpzlth.vercel.run)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework increíble
- [Vercel](https://vercel.com/) - Hosting y deployment
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- Comunidad de desarrolladores open source

---

## 📊 Estadísticas del Proyecto

- **Alimentos en Base de Datos**: 320+
- **Componentes React**: 15+
- **Custom Hooks**: 4
- **Líneas de Código**: ~5000+
- **Tamaño del Bundle**: ~200KB (gzipped)

---

## 🗺️ Roadmap

### v0.2.0 (Próximo)
- [ ] Integración con API de alimentos externa
- [ ] Gráficos de progreso temporal
- [ ] Modo oscuro completo
- [ ] Soporte multi-idioma (i18n)

### v0.3.0 (Futuro)
- [ ] Sincronización en la nube
- [ ] Aplicación móvil nativa
- [ ] Integración con wearables
- [ ] Recomendaciones con IA

### v1.0.0 (Largo Plazo)
- [ ] Comunidad de usuarios
- [ ] Recetas compartidas
- [ ] Consultas con nutricionistas
- [ ] Marketplace de planes nutricionales

---

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Índice Glucémico - Wikipedia](https://es.wikipedia.org/wiki/%C3%8Dndice_gluc%C3%A9mico)

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ por [Sarmiento](https://github.com/sarmiento)

</div>
