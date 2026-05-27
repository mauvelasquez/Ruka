# SECURITY AUDIT — Rukka.cl

**Fecha:** 2026-05-26  
**Auditor:** Auditoría automatizada asistida por IA  
**Stack:** Next.js 14.2.3 · React 18 · Supabase (@supabase/ssr) · Tailwind CSS · Anthropic SDK · Vercel  
**Rama auditada:** main

---

## Resumen Ejecutivo

Se identificaron **12 vulnerabilidades** distribuidas en 4 niveles de severidad. Los dos problemas más graves son: (1) funciones PostgreSQL `credit_yankis` / `debit_yankis` accesibles por cualquier usuario autenticado, lo que permite fraude financiero arbitrario; y (2) el cliente global del store descarga todos los perfiles con `SELECT *`, exponiendo campos sensibles (email, RUT, fecha de nacimiento) a cualquier visitante. El resto son problemas de configuración, autorización parcial y dependencias desactualizadas con CVEs conocidos.

---

## Tabla de Vulnerabilidades

| # | Área | Archivo | Severidad | Descripción | Fix |
|---|------|---------|-----------|-------------|-----|
| 1 | RLS / DB Functions | `supabase/migrations/20260525_yankis.sql` | **CRÍTICA** | `credit_yankis` y `debit_yankis` son SECURITY DEFINER sin REVOKE: cualquier usuario autenticado puede llamarlas directamente vía `supabase.rpc()` y acreditarse Yankis arbitrarios | Agregar `REVOKE EXECUTE` de `public` y `authenticated` |
| 2 | Dependencias | `package.json` / `node_modules/next` | **CRÍTICA** | Next.js 14.2.3 tiene 26 CVEs, incluyendo **GHSA-f82v-jwr5-mffw** (Authorization Bypass in Middleware) y múltiples DoS. La versión fixeada no-breaking es 14.2.35 | Actualizar Next.js a 14.2.35 |
| 3 | Exposición de datos | `lib/store.js:200` | **ALTA** | `fetchPublic('profiles')` descarga todos los perfiles con `SELECT *` usando el anon key, exponiendo campos sensibles (email, birth_date, identification_number, id_full_name, rut_hash) a cualquier visitante sin autenticación | Limitar query a columnas públicas seguras |
| 4 | RLS / Mensajes | `supabase/migrations/20260516_messages.sql` | **ALTA** | La política `participants_only` usa solo cláusula `USING` sin `WITH CHECK`. Un usuario autenticado puede insertar un mensaje con `sender_id` de otro usuario vía la API REST de Supabase directamente, suplantando a cualquier remitente | Agregar `WITH CHECK (auth.uid() = sender_id)` |
| 5 | Variables de entorno | `app/api/admin/logs/route.js:17` | **ALTA** | `NEXT_PUBLIC_ADMIN_EMAIL` es una variable pública (expuesta en el bundle JS del cliente). La ruta API la usa para verificar acceso admin, exponiendo el email del administrador a cualquier visitante | Usar `ADMIN_EMAIL` (sin `NEXT_PUBLIC_`) en el servidor |
| 6 | Autorización | `app/api/yankis/exchange/route.js:27` | **MEDIA** | El endpoint `/api/yankis/exchange` permite que AMBOS usuarios (viajero y anfitrión) ejecuten `action: 'confirm'`. Solo el anfitrión (`to_user_id`) debería poder confirmar un intercambio | Restringir `confirm` al anfitrión |
| 7 | Rate Limiting | `app/api/fresia/chat/route.js:8-17` | **MEDIA** | El rate limiting usa un `Map` en memoria (`ipCounts`). En serverless (Vercel), cada instancia de función tiene su propio Map; un atacante puede explotar múltiples instancias para superar el límite y generar costos de API ilimitados | Implementar rate limiting distribuido (Upstash Redis / KV) o agregar autenticación obligatoria |
| 8 | Inputs/Uploads | `app/api/import-airbnb/route.js:70` | **MEDIA** | La validación del MIME type en import-airbnb usa `file.type` (campo provisto por el cliente, no verificado contra los magic bytes reales del archivo) | Usar la librería `file-type` para validar content real, o al menos rechazar en vez de normalizar a `image/jpeg` |
| 9 | Exposición de datos | `lib/store.js:201` | **MEDIA** | `fetchPublic('travel_wishes')` descarga todos los viajes deseados de todos los usuarios con `SELECT *` usando el anon key. Los deseos de viaje contienen fechas y destinos que pueden ser privados | Limitar a columnas necesarias y solo viajes de usuarios activos |
| 10 | Dependencias | `package.json` / `node_modules/ws` | **MEDIA** | `ws` 8.x tiene GHSA-58qx-3vcg-4xpx (Uninitialized memory disclosure). Fix disponible con `npm audit fix` | Ejecutar `npm audit fix` |
| 11 | Headers HTTP | `next.config.js` | **BAJA** | Falta el header `Content-Security-Policy`. Sin CSP, un XSS en cualquier componente puede ejecutar scripts arbitrarios sin restricción | Agregar CSP permisivo inicial |
| 12 | Variables de entorno | `app/dashboard/logs/page.js:33` | **BAJA** | El check de admin en el cliente usa `process.env.NEXT_PUBLIC_ADMIN_EMAIL` expuesto. Aunque el API server también valida, esto filtra el email del admin en el bundle JS | Unificar con el fix del ítem #5 |

---

## Plan de Acción Priorizado

### Ejecutar inmediatamente (CRÍTICO)
1. `[#1]` Migración SQL que revoca EXECUTE en credit_yankis / debit_yankis
2. `[#2]` Actualizar Next.js a 14.2.35

### Ejecutar inmediatamente (ALTO)
3. `[#3]` Limitar columnas en fetchPublic('profiles')
4. `[#4]` Agregar WITH CHECK en policy de messages
5. `[#5]` Usar ADMIN_EMAIL (sin NEXT_PUBLIC_) en la ruta API

### Ejecutar hoy (MEDIO)
6. `[#6]` Restringir confirm de exchange solo al host
7. `[#8]` Mejorar validación MIME en import-airbnb
8. `[#9]` Limitar columnas en fetchPublic('travel_wishes')
9. `[#10]` npm audit fix para ws

### Próximos sprints (BAJO)
10. `[#7]` Rate limiting distribuido para rutas de IA
11. `[#11]` Agregar Content-Security-Policy

---

## Estado de Fixes

| # | Descripción | Estado |
|---|-------------|--------|
| 1 | REVOKE en credit_yankis / debit_yankis | ✅ Corregido — migración `20260526_security_fix_yankis_revoke.sql` |
| 2 | Actualizar Next.js a 14.2.35 | ✅ Corregido — Authorization Bypass eliminado (GHSA-f82v-jwr5-mffw) |
| 3 | Limitar columnas en fetchPublic('profiles') | ✅ Corregido — `lib/store.js` colum explícitas, sin PII |
| 4 | WITH CHECK en messages RLS | ✅ Corregido — migración `20260526_security_fix_messages_rls.sql` |
| 5 | ADMIN_EMAIL server-only | ✅ Corregido — endpoint `/api/admin/me`, cliente usa fetch en vez de `process.env`, `NEXT_PUBLIC_ADMIN_EMAIL` eliminado de Vercel |
| 6 | Restringir confirm a host | ✅ Corregido — `app/api/yankis/exchange/route.js` |
| 7 | Rate limiting distribuido | 🟡 Requiere decisión — ver recomendaciones |
| 8 | Validación MIME real en import-airbnb | ✅ Corregido — magic bytes en `app/api/import-airbnb/route.js` |
| 9 | Limitar columnas en fetchPublic('travel_wishes') | ✅ Corregido — `lib/store.js` columnas explícitas |
| 10 | npm audit fix (ws) | ✅ Corregido — `ws` actualizado vía `npm audit fix` |
| 11 | Content-Security-Policy | ✅ Corregido — modo Report-Only en `next.config.js` |
| 12 | isAdmin client-side (baja) | ✅ Corregido junto a #5 |

**Aplicado en producción (2026-05-26):**
- ✅ Migraciones SQL ejecutadas en Supabase Dashboard
- ✅ `ADMIN_EMAIL` agregado en Vercel (Production + Development)

---

---

## ⚠️ Acciones Manuales Requeridas Antes de Desplegar

### 1. Ejecutar migraciones SQL en Supabase Dashboard

Las siguientes migraciones deben ejecutarse manualmente en Supabase Dashboard → SQL Editor → New Query:

**`20260526_security_fix_yankis_revoke.sql`** — bloquea llamadas directas a `credit_yankis` / `debit_yankis`
**`20260526_security_fix_messages_rls.sql`** — previene suplantación de sender_id en mensajes

### 2. ~~Agregar variable de entorno en Vercel~~ ✅ Completado

`ADMIN_EMAIL` agregado a Production y Development. Preview omitido (no crítico — el panel admin no se usa en deploys preview).

### 3. Verificar políticas RLS de `profiles` en Supabase

Ejecutar en SQL Editor:
```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
```
Si el rol `anon` puede hacer SELECT en todas las columnas, agregar una vista restringida o una policy que limite las columnas visibles.

---

## Recomendaciones de Mediano Plazo

### Upgrade Next.js 15 o 16 (14 CVEs restantes tras upgrade a 14.2.35)
El upgrade a 14.2.35 eliminó las CVEs críticas (Authorization Bypass, SSRF, información en dev server). Las 14 CVEs restantes requieren Next.js 15+ (breaking change). Impacto principal:
- APIs de Next.js 15 cambian: `cookies()`, `headers()`, `params` son async en v15
- Requiere migración codemod: `npx @next/codemod@latest upgrade`
- Priorizar para el próximo sprint de mantenimiento

### Rate limiting distribuido (ítem #7)
El rate limiting en memoria es ineficaz en serverless. Opciones:
- **Recomendado:** Upstash Redis vía `@upstash/ratelimit` — free tier disponible, integra en 10 líneas
- **Alternativa:** Vercel KV (Upstash managed) para zero-config
- Aplicar especialmente a `/api/fresia/chat` (costo por token), `/api/verify-id/extract` (costo por imagen), `/api/import-airbnb`

### Profiles RLS policy (no auditable sin acceso al DB)
No se puede verificar qué políticas existen en la tabla `profiles` sin acceso a la base de datos live. Recomendaciones:
- Ejecutar `SELECT * FROM pg_policies WHERE tablename = 'profiles'` en Supabase Dashboard
- Verificar que existe una política que limita qué columnas el rol `anon` puede leer
- Si no existe, agregar una política `FOR SELECT TO anon USING (true)` que seleccione solo columnas públicas

### Rotación de secrets potencialmente expuestos
Verificar que las siguientes claves no hayan sido comprometidas:
- `SUPABASE_SERVICE_ROLE_KEY` — si alguna vez estuvo en el código o en un commit, rotar en Supabase Dashboard > Settings > API
- `ANTHROPIC_API_KEY` — verificar en Anthropic Console > API Keys
- `NEXT_PUBLIC_ADMIN_EMAIL` — no es un secret (es un email), pero si prefieres ocultarlo, considera refactorizar el admin check como se describe en el fix #5

### Content-Security-Policy (ítem #11)
Una CSP estricta requiere auditar todos los scripts inline, estilos inline y fuentes externas. Pasos recomendados:
1. Empezar con `Content-Security-Policy-Report-Only` para detectar violaciones sin bloquear
2. Iterar eliminando inline scripts (usar `nonce` o mover a archivos externos)
3. Aplicar CSP en modo enforced cuando las violaciones sean cero
