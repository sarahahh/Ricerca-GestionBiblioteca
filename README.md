# Sistema de Gestión de Biblioteca - Ricerca AyD2

Sistema administrativo de gestión de bibliotecas construido con Next.js, React, TailwindCSS y preparado para integración con Supabase.

## ✨ Características

- **Autenticación**: Sistema de login con roles (ADMIN/USER)
- **Transacciones**: Gestión de movimientos con gráficas de evolución
- **Maestros**: CRUD de maestros con control de saldos
- **Usuarios**: Administración de usuarios y roles (solo ADMIN)
- **Protección de rutas**: Control de acceso basado en roles
- **UI Moderna**: Interfaz responsive con TailwindCSS y shadcn/ui
- **Arquitectura limpia**: Backend separado del frontend mediante API Routes

## 🚀 Tecnologías

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Estilos**: TailwindCSS v4, shadcn/ui
- **Gráficas**: Recharts
- **Estado**: React Context API
- **Backend**: Next.js API Routes (preparado para Supabase)
- **Preparado para**: Supabase + Prisma (opcional)

## 📁 Estructura del Proyecto

\`\`\`
├── app/
│   ├── (dashboard)/           # Rutas protegidas con layout compartido
│   │   ├── transacciones/     # Página de transacciones
│   │   ├── maestros/          # Página de maestros
│   │   └── usuarios/          # Página de usuarios (solo ADMIN)
│   ├── api/                   # API Routes (Backend)
│   │   ├── maestros/
│   │   ├── movements/
│   │   └── users/
│   ├── login/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes de shadcn/ui
│   ├── balance-chart.tsx
│   ├── data-table.tsx
│   ├── dashboard-layout.tsx
│   ├── error-state.tsx
│   ├── form-input.tsx
│   ├── form-select.tsx
│   ├── loading-state.tsx
│   ├── modal.tsx
│   ├── role-guard.tsx
│   └── sidebar.tsx
├── context/
│   └── AuthContext.tsx       # Contexto de autenticación
├── lib/
│   ├── api-client.ts         # Cliente API para frontend
│   ├── mock-api.ts           # Lógica de negocio (mock)
│   ├── supabase/             # Clientes de Supabase (placeholders)
│   └── utils.ts
├── mock/
│   ├── users.json
│   ├── maestros.json
│   └── movements.json
└── prisma/
    └── schema.prisma         # Schema de Prisma (opcional)
\`\`\`

## 🏗️ Arquitectura: Frontend/Backend Separados

Este proyecto sigue una **arquitectura limpia con separación de responsabilidades**:

### Frontend (Componentes React)
- **Ubicación**: `app/(dashboard)/*` 
- **Responsabilidad**: UI, interacción de usuario, estado local
- **Comunicación**: Usa `apiClient` (en `lib/api-client.ts`) para hacer peticiones HTTP

### Backend (API Routes)
- **Ubicación**: `app/api/*`
- **Responsabilidad**: Lógica de negocio, validación, acceso a datos
- **Comunicación**: Expone endpoints REST que el frontend consume

### Ventajas de esta arquitectura:
1. **Sin doble trabajo**: Cuando migres a Supabase, solo modificas las API Routes, no los componentes
2. **Fácil testing**: Puedes probar frontend y backend de forma independiente
3. **Escalable**: Fácil agregar autenticación, validación y middleware
4. **Mantenible**: Cambios en la lógica de negocio no afectan la UI

### Flujo de datos:
\`\`\`
[Componente] → [apiClient] → [API Route] → [mockApi/Supabase] → [Base de datos]
\`\`\`

## 📦 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+ 
- npm o pnpm

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar variables de entorno**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edita `.env.local` con tus valores (por ahora usa los placeholders, la app funciona con datos mock).

4. **Ejecutar en desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`
   
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

5. **Build para producción**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## 🔐 Credenciales de Prueba

El sistema actualmente usa autenticación simulada con datos mock:

- **ADMIN**: `admin@biblioteca.com` / `admin123`
- **USER**: `user@biblioteca.com` / `user123`

## 🔌 Integración con Supabase

Para migrar de datos mock a Supabase **sin modificar los componentes frontend**, sigue estos pasos:

### 1. Crear proyecto en Supabase

Visita [https://supabase.com](https://supabase.com) y crea un nuevo proyecto.

### 2. Instalar dependencias

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

### 3. Configurar variables de entorno

Obtén tus credenciales desde el dashboard de Supabase y actualiza `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
DATABASE_URL="postgresql://..."
\`\`\`

### 4. Ejecutar el script SQL

Ejecuta el script en `scripts/seed-supabase.sql` en el Editor SQL de Supabase para crear las tablas y políticas RLS.

### 5. Actualizar los API Routes

Reemplaza `mockApi` con Supabase en los archivos:
- `app/api/maestros/route.ts`
- `app/api/movements/route.ts`
- `app/api/users/route.ts`
- `app/api/users/[id]/route.ts`

**Ejemplo de migración en `app/api/maestros/route.ts`:**

\`\`\`typescript
// ANTES (Mock):
const maestros = await mockApi.maestros.getAll()

// DESPUÉS (Supabase):
import { createServerClient } from '@/lib/supabase/server'
const supabase = createServerClient()
const { data: maestros } = await supabase.from('maestros').select('*')
\`\`\`

### 6. Actualizar AuthContext

Modifica `context/AuthContext.tsx` para usar Supabase Auth en lugar de la autenticación mock.

**✅ Los componentes frontend NO necesitan cambios** porque siguen usando `apiClient` que hace peticiones a los mismos endpoints.

Para más detalles, consulta `INTEGRATION_GUIDE.md`.

## 📚 Endpoints API Disponibles

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/api/maestros` | Obtener todos los maestros | ADMIN, USER |
| POST | `/api/maestros` | Crear nuevo maestro | ADMIN |
| GET | `/api/movements` | Obtener todos los movimientos | ADMIN, USER |
| GET | `/api/movements?maestroId={id}` | Obtener movimientos por maestro | ADMIN, USER |
| POST | `/api/movements` | Crear nuevo movimiento | ADMIN, USER |
| GET | `/api/users` | Obtener todos los usuarios | ADMIN |
| PUT | `/api/users/:id` | Actualizar rol de usuario | ADMIN |

## 🎯 Funcionalidades por Rol

### ADMIN (Administrador)
- ✅ Ver y crear transacciones
- ✅ Ver y crear maestros
- ✅ Ver y editar usuarios
- ✅ Acceso completo al sistema

### USER (Usuario)
- ✅ Ver y crear transacciones
- ✅ Ver maestros (no puede crear)
- ❌ No puede acceder a gestión de usuarios

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter

## ✅ Requisitos Académicos Cumplidos

1. ✅ Next.js con App Router (`app/` directory)
2. ✅ React + TypeScript
3. ✅ TailwindCSS para estilos
4. ✅ Autenticación con roles
5. ✅ CRUD completo con datos mock
6. ✅ Protección de rutas por rol
7. ✅ Sidebar fijo con información de usuario
8. ✅ Gráficas con Recharts
9. ✅ Modales con estados de loading/error
10. ✅ API Routes separados del frontend
11. ✅ Preparado para Supabase + Prisma
12. ✅ Comentarios en código para integración
13. ✅ Variables de entorno configuradas
14. ✅ Componentes reutilizables y modulares

## 📖 Archivos Clave para Entender

- **`lib/api-client.ts`**: Cliente API usado por el frontend (capa de abstracción)
- **`lib/mock-api.ts`**: Lógica de negocio con datos mock
- **`app/api/*/route.ts`**: API Routes que exponen endpoints REST
- **`context/AuthContext.tsx`**: Manejo de autenticación y sesión
- **`components/role-guard.tsx`**: Protección de rutas por rol
- **`components/sidebar.tsx`**: Navegación lateral con info de usuario
- **`components/data-table.tsx`**: Tabla reutilizable
- **`components/modal.tsx`**: Modal reutilizable con estados

## 🔄 Próximos Pasos

1. Conectar con Supabase siguiendo `INTEGRATION_GUIDE.md`
2. Implementar autenticación real con Supabase Auth
3. Actualizar API Routes para usar Supabase en lugar de mockApi
4. Configurar RLS (Row Level Security) en Supabase
5. (Opcional) Implementar Prisma como ORM
6. Agregar validaciones con Zod
7. Implementar testing con Vitest/Jest
8. Desplegar en Vercel

## 💡 Respuesta a tu Pregunta

**"¿Está la lógica mezclada con el frontend?"**

**NO** - El proyecto está correctamente separado:

- **Frontend**: Componentes en `app/(dashboard)/*` usan `apiClient`
- **Backend**: API Routes en `app/api/*` contienen la lógica
- **Datos**: Mock data en `lib/mock-api.ts` (fácil de reemplazar)

**Cuando conectes Supabase:**
1. Solo modificas los archivos en `app/api/*` 
2. Los componentes frontend NO cambian
3. `apiClient` sigue funcionando igual

**No hay doble trabajo** - la arquitectura ya está correcta.

## 📞 Soporte

Para dudas sobre el proyecto académico, consulta:
- Comentarios en el código que indican puntos de integración
- `INTEGRATION_GUIDE.md` para guía paso a paso de Supabase
- `PROYECTO.md` para resumen académico en español

## 📄 Licencia

Proyecto académico - Ricerca AyD2
