# TODOS

## Auditorías

### /auditorias revela su existencia vía 404 con body vacío

**What:** El middleware responde a accesos no autorizados a `/auditorias` con `new NextResponse(null, { status: 404 })` (body vacío), distinto del 404 real de Next (que tiene HTML). Eso permite distinguir "esta ruta existe pero no tengo permiso" de "esta ruta no existe".

**Why:** Es una ruta privada que no debería revelar su existencia a quien no es admin — un `curl` de 0 bytes vs varios KB delata la ruta.

**Context:** `middleware.js`, gating de `/auditorias`. Ajustar para que el 404 imite el body/shape del `notFound()` real de Next, o redirigir a una 404 genuina.

**Effort:** S
**Priority:** P3
**Depends on:** None

### ADMIN_EMAIL no está configurado en Preview de Vercel

**What:** `ADMIN_EMAIL` está seteado en Production y Development pero no en Preview, mientras las env vars de Supabase sí están en Preview. Resultado: en Preview, `/auditorias` siempre da 404 (fail-closed) incluso para el admin real.

**Why:** Bloquea hacer QA de `/auditorias` en deploys de preview antes de mergear a main.

**Context:** Configuración de variables de entorno en Vercel (no en código). Agregar `ADMIN_EMAIL` al entorno Preview.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Yankis

### Promesa pública "el equipo te ayuda a coordinar una alternativa" sin flujo de soporte

**What:** La frase (o variantes) aparece en ~12 lugares (`/como-funciona`, `/about`, `/homes/[pais]/[ciudad]`, `llms.txt`), incluida en el FAQ con structured data que Google/asistentes IA muestran textual. No existe formulario, cola de soporte, ni notificación que dispare esa coordinación manual.

**Why:** Es una promesa pública (incluso en datos estructurados de FAQ) sin mecanismo operativo detrás — riesgo de expectativa de usuario incumplida.

**Context:** El backend de Yankis (`credit_yankis`/`debit_yankis` vía `exchange_requests`) sigue funcionando automático para el caso bilateral aceptado, pero no hay ruta para que "el equipo" se entere de que un usuario necesita coordinación manual. Definir un mínimo "solicitar ayuda" (form/email/ticket) o suavizar la copy para no prometer seguimiento humano que hoy no existe operativamente.

**Effort:** M
**Priority:** P2
**Depends on:** None

### Endpoints /api/yankis/balance y /api/yankis/transactions sin llamadores

**What:** Tras quitar el widget de saldo del navbar y la página `/dashboard/yankis`, ningún componente del frontend llama a estos dos endpoints. Quedan correctamente auth-gateados (401 sin sesión, scoped a `user.id`) pero son código muerto.

**Why:** Mantenimiento — bajo riesgo, pero rutas sin uso que conviene documentar o limpiar eventualmente.

**Context:** `app/api/yankis/balance/route.js`, `app/api/yankis/transactions/route.js`. Decisión explícita (jun 2026): mantenerlos como están — útiles para futura tooling admin del backend oculto de Yankis.

**Effort:** S
**Priority:** P4
**Depends on:** None

## Infraestructura

### Caché SWR de homes/profiles puede mostrar listados eliminados hasta 10 min

**What:** El caché stale-while-revalidate en `sessionStorage` (`CACHE_TTL = 10 min`) puede seguir mostrando tarjetas (imagen, título, nombre del dueño) de un hogar/perfil removido por moderación hasta 10 minutos después de su eliminación, aunque la página de detalle ya dé 404.

**Why:** Ventana de inconsistencia para casos de moderación/seguridad — probablemente aceptable, pero a tener en cuenta para SLAs de respuesta a incidentes.

**Context:** `lib/store.js`, `CACHE_KEY`/`CACHE_TTL`. Si en el futuro se necesita invalidación inmediata, considerar un mecanismo de purga activa (ej. broadcast channel o versión de caché).

**Effort:** M
**Priority:** P4
**Depends on:** None

## Auth

### Verificar que `identities` sea siempre array (no null) en detección de email duplicado

**What:** El fix de registro detecta `identities: []` como "email ya registrado". Si una versión futura/distinta de Supabase Auth devolviera `identities: null` también para el caso de duplicado, el guard `Array.isArray()` lo trataría como "usuario nuevo" (dirección segura, pero el bug original podría reaparecer silenciosamente).

**Why:** Confirmar el comportamiento real contra el proyecto Supabase desplegado evita una regresión silenciosa del fix de jun 2026.

**Context:** `app/auth/register/RegisterClient.js`. Hacer una prueba manual de registro con un email ya registrado contra el proyecto Supabase real y confirmar que `identities` es `[]` y no `null`.

**Effort:** S
**Priority:** P3
**Depends on:** None

## Completed
