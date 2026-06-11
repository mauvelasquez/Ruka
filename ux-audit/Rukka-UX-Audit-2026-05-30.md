---
title: "Auditoría UX — Rukka"
---

# Auditoría UX total — Rukka

**Sitio:** https://rukka.cl · **Fecha:** 30 de mayo de 2026
**Tipo:** Auditoría heurística experta + revisión técnica, sobre el sitio en producción.
**Cobertura:** 8 rutas públicas (home, cómo funciona, explorar casas, login, registro, onboarding, anfitriones-airbnb, about), en desktop (1440px) y mobile (390px).
**Evidencia:** 16 capturas reales (navegador Chromium real) + lectura directa del código fuente de los formularios + métricas de red en vivo.

> **Nota de método y confianza.** Esta auditoría se apoya en tres fuentes verificadas: (1) capturas reales de cada página, revisadas una a una; (2) lectura directa del código fuente de los flujos clave (auth, estilos globales); (3) métricas de red medidas contra producción. Algunos conteos automáticos por página del DOM no se pudieron capturar de forma fiable en esta sesión, así que **el informe no cita métricas que no haya podido confirmar**: los hallazgos se basan en lo observado en pantalla y en el código.

---

## 1. Resumen ejecutivo

Rukka está, en general, bien construido. Por encima del promedio de un marketplace temprano: arquitectura con **rutas reales** (buenas para SEO y para compartir enlaces), **diseño limpio y consistente**, contenido **rico y bien pensado** (páginas dedicadas para anfitriones de Airbnb y "sobre nosotros", tablas comparativas vs. Airbnb/HomeExchange/Kindred, FAQ, testimonios) y **formularios de autenticación sólidos**: etiquetas visibles, `autocomplete` completo, optimización de teclado mobile, toggle de contraseña, login con Google, validación e incentivo de bienvenida ("3 Yankis").

Los frenos hoy son acotados y corregibles:

1. **Fricción en la primera visita y la conversión.** Un *popup* de bienvenida se superpone al contenido al cargar la home (y también la página de explorar), y "Publicar mi casa" lleva al muro de registro (`/onboarding` redirige a login) antes de mostrar el valor del flujo.
2. **Accesibilidad: detalles que faltan.** Los formularios tienen etiquetas visibles pero **no asociadas programáticamente** (`<label>` sin `htmlFor`, inputs sin `id`), no hay un *baseline* global de foco en `globals.css` (sí hay `focus:ring` por componente) y **no existe soporte de `prefers-reduced-motion`** en ningún archivo.
3. **Peso de JavaScript.** La home referencia **~811 KB de JS** en 19 chunks; el servidor responde muy rápido (TTFB ~0,2–0,5 s), pero ese peso penaliza el tiempo a interactivo en mobile.

**Score global: 74 / 100 — "Bueno".** Esta es la **línea base**: guárdala y vuelve a medir con la misma rúbrica. Meta a 90 días: **80+**; a 6 meses: **86+**.

---

## 2. Scorecard de referencia

| # | Dimensión | Peso | Score /10 | Aporte | Estado |
|---|-----------|------|-----------|--------|--------|
| 1 | Primera impresión y propuesta de valor | 10% | 7.0 | 0.70 | 🟡 Aceptable |
| 2 | Arquitectura de información y navegación | 10% | 8.0 | 0.80 | 🟢 Bueno |
| 3 | Diseño visual y consistencia de marca | 12% | 8.5 | 1.02 | 🟢 Bueno |
| 4 | Contenido, copy y señales de confianza | 12% | 7.5 | 0.90 | 🟢 Bueno |
| 5 | Conversión y embudo de onboarding | 15% | 7.0 | 1.05 | 🟡 Aceptable |
| 6 | Formularios y UX de inputs | 10% | 7.5 | 0.75 | 🟢 Bueno |
| 7 | Accesibilidad (WCAG 2.2 AA) | 15% | 6.5 | 0.98 | 🟡 Aceptable |
| 8 | UX mobile / responsive | 8% | 8.0 | 0.64 | 🟢 Bueno |
| 9 | Performance y velocidad percibida | 8% | 7.0 | 0.56 | 🟡 Aceptable |
| | **TOTAL** | **100%** | | **7.40** | **74 / 100** |

**Escala:** 90–100 Excelente · 80–89 Sólido · 70–79 Bueno · 60–69 Aceptable · 50–59 Requiere trabajo · <50 Crítico.

```
Propuesta de valor   ███████░░░  7.0
Nav / IA             ████████░░  8.0
Diseño visual        ████████▌░  8.5
Contenido/Confianza  ███████▌░░  7.5
Conversión           ███████░░░  7.0
Formularios          ███████▌░░  7.5
Accesibilidad        ██████▌░░░  6.5   ← mayor oportunidad
Mobile               ████████░░  8.0
Performance          ███████░░░  7.0
```

---

## 3. Metodología (marco repetible)

**Lentes:** 10 heurísticas de Nielsen · WCAG 2.2 AA · embudo de conversión (AARRR) · psicología de confianza para marketplaces · calidad mobile-first · performance percibida.

**Instrumentación (reproducible):**
- Navegador Chromium real conduciendo el sitio en producción; capturas en desktop (1440px) y mobile (390px) de cada ruta, revisadas una por una.
- Lectura directa del código fuente de los flujos clave (`app/auth/login/page.js`, `app/auth/register/RegisterClient.js`, `app/globals.css`).
- Métricas de red (`curl`): TTFB, tiempo total, peso de HTML y suma de bundles JS/CSS.

**Reglas para la próxima corrida:** mismos viewports, mismas 9 dimensiones y pesos, mismas rutas. Registra el score global + por dimensión y el delta. Para una próxima auditoría, sumar una cuenta de prueba para cubrir los flujos autenticados (dashboard, verificación, publicación, Yankis, mensajería) y una pasada de a11y automatizada (axe) por ruta.

---

## 4. Hallazgos por dimensión

### 4.1 Primera impresión y propuesta de valor — 7.0/10 🟡

**Lo que funciona (verificado en capturas):**
- Hero con buen gancho: **"El hogar de Chile está lleno de puertas abiertas."** sobre paisaje chileno, con módulo de búsqueda inmediato (origen / destino / fechas).
- Sección "Hogares destacados en Chile" con tarjetas reales (Providencia, Valparaíso, Pucón/Torres del Paine) y banda "Viaja por Chile sin gastar en alojamiento".

**Resta puntos:**
- Un **popup de bienvenida** ("La primera plataforma de intercambio de casas… Crea tu cuenta / Verifica tu identidad / Publica tu casa") **se superpone al contenido al cargar** la home, antes de que el usuario explore por su cuenta. (Se observó también sobre `/homes`.)

---

### 4.2 Arquitectura de información y navegación — 8.0/10 🟢

**Lo que funciona:**
- **Rutas reales del App Router** (`/`, `/como-funciona`, `/homes`, `/auth/login`, `/auth/register`, `/anfitriones-airbnb`, `/about`): enlaces compartibles, botón "atrás" funcional, buena base de SEO.
- **Landing pages diferenciadas y bien hechas:** `/anfitriones-airbnb` apunta a un segmento de captación específico (anfitriones de Airbnb), con su propia narrativa, tabla comparativa, testimonios y FAQ. `/about` cuenta la misión con regiones de operación y comparativa de plataformas.

**Resta puntos:** la jerarquía interna de `/como-funciona` se apoya casi solo en H2 (poco H3), lo que aplana el escaneo.

---

### 4.3 Diseño visual y consistencia de marca — 8.5/10 🟢

**Lo que funciona (capturas de las 8 rutas):**
- Sistema visual coherente y profesional: paleta verde bosque/teal + crema, tipografía legible, buen uso del espacio, tarjetas redondeadas, hero con overlay.
- La marca y los componentes (botones, cards, formularios, footer) se mantienen consistentes en todo el sitio, incluido el split-screen de login con banner geo-dinámico.

**Para subir a 9+:** más prueba visual de producto real (fotos de casas y rostros de personas verificadas) en las secciones que hoy son ilustrativas.

---

### 4.4 Contenido, copy y señales de confianza — 7.5/10 🟢

**Lo que funciona:**
- Contenido rico y orientado a confianza: explicación del modelo (intercambio directo + **Yankis**), **tablas comparativas** (Rukka vs. Airbnb / HomeExchange / Kindred), **FAQ** en varias páginas y **testimonios** en la landing de anfitriones.
- Copy claro en castellano neutro; la verificación de identidad aparece como eje de confianza, alineado con la estrategia del producto.

**Resta puntos:**
- La **prueba social en la home** es más débil que en las landings internas (los testimonios/rostros viven sobre todo en `/anfitriones-airbnb`).
- **Cold-start:** el inventario real se ve aún limitado; conviene gestionar expectativas mientras crece.

---

### 4.5 Conversión y embudo de onboarding — 7.0/10 🟡

**Lo que funciona:**
- **Login con Google** en login y registro, **toggle de contraseña**, validación con errores inline y, en registro, un incentivo claro: **"3 Yankis de bienvenida"**.
- El redirect de `/onboarding` a `/auth/login` **conserva el destino** (`?redirect=`), así que tras autenticarse el usuario vuelve a su flujo.

**Resta puntos / recomendación:**
- El **popup de bienvenida** de entrada puede subir registros pero también aumentar el rebote de quien venía a mirar. Probar mostrarlo tras scroll/interacción o como barra menos intrusiva.
- "Publicar mi casa" exige cuenta antes de mostrar el valor del flujo; conviene previsualizar el valor ("publica en 3 minutos, te verificamos, recibe solicitudes") y ofrecer captura de email para quien no está listo.

---

### 4.6 Formularios y UX de inputs — 7.5/10 🟢

Verificado por **lectura directa del código** de login (`app/auth/login/page.js`) y registro (`RegisterClient.js`):

| Característica | Login | Registro |
|---|---|---|
| `<label>` visibles | ✅ Email, Contraseña | ✅ Nombre, Email, Contraseña |
| `autocomplete` | ✅ `email`, `current-password` | ✅ `name`, `email`, `new-password` |
| Optimización mobile (`inputMode`, `enterKeyHint`) | ✅ | ✅ |
| Toggle mostrar/ocultar contraseña (con `aria-label`) | ✅ | ✅ |
| `required` + error inline | ✅ | ✅ |
| Estilo de foco (`focus:ring`) | ✅ | ✅ |

Estos formularios están **mejor construidos que el promedio**. La única brecha real:

- **Las etiquetas no están asociadas programáticamente:** los `<label>` no tienen `htmlFor` y los `<input>` no tienen `id` (ni el input está anidado dentro del label). Visualmente la etiqueta acompaña al campo, pero un lector de pantalla no la vincula. *(Arreglo trivial: añadir `id` al input y `htmlFor` igual en el label.)*

---

### 4.7 Accesibilidad (WCAG 2.2 AA) — 6.5/10 🟡

**Lo que está bien (verificado):**
- `lang="es"` y `meta viewport` correctos.
- **Etiquetas visibles** en todos los campos de formulario; `aria-label` en los botones de toggle de contraseña.
- **Estilos de foco por componente** (`focus:ring-2 focus:ring-forest` en inputs y botones de los flujos auth).

**Brechas (verificadas):**

| Criterio WCAG | Hallazgo | Nivel |
|---|---|---|
| Etiqueta–campo (1.3.1) | `<label>` sin `htmlFor` / inputs sin `id`: etiqueta no asociada al control | A |
| Foco visible (2.4.7) | `globals.css` sin *baseline* global (`:focus`/`outline` = 0); cobertura depende de utilidades por componente | AA |
| Movimiento reducido (2.3.3) | **0 archivos** con `prefers-reduced-motion` | AA |

**Recomendación (P0):** asociar `<label>`↔`<input>` con `id`/`htmlFor`, añadir un `:focus-visible` global en `globals.css` y un bloque `@media (prefers-reduced-motion: reduce)`. Idealmente, correr **axe** por ruta para cubrir botones de ícono, contraste y `alt` dinámicos.

---

### 4.8 UX mobile / responsive — 8.0/10 🟢

**Lo que funciona (capturas a 390px de las 8 rutas):**
- La home y las páginas de contenido refluyen a una columna limpia: hero legible, CTAs a ancho completo, secciones apiladas, footer ordenado.
- Los formularios incluyen `inputMode`/`enterKeyHint`, que mejoran el teclado en mobile.

**Para subir a 9+:** validar tamaños de objetivo táctil (≥44px) en el header y confirmar el comportamiento del popup de bienvenida en pantallas pequeñas (que no tape acciones).

---

### 4.9 Performance y velocidad percibida — 7.0/10 🟡

Métricas reales (medidas contra producción):

| Métrica | Valor | Lectura |
|---|---|---|
| TTFB (home) | ~0,2–0,5 s | 🟢 Bien |
| HTML (home) | 43 KB | 🟢 Bien |
| HTML (/homes) | 15 KB | 🟢 Muy bien |
| **JavaScript (home)** | **~811 KB en 19 chunks** | 🟠 Pesado |
| CSS (home) | 64 KB | 🟡 Aceptable |

**Hallazgo:** el servidor responde rápido y el HTML es liviano, pero ~811 KB de JS penalizan el tiempo a interactivo, sobre todo en mobile con red lenta.

**Recomendación:** revisar code-splitting y carga diferida de módulos pesados (mapa, buscador, widgets) y auditar dependencias del bundle.

---

## 5. Recomendaciones priorizadas

Ordenadas por impacto/esfuerzo.

### P0 — Crítico (días)
1. **Suavizar el popup de bienvenida:** mostrarlo tras scroll/interacción (o como barra), no superpuesto al cargar. *(Alto · Bajo)*
2. **Asociar etiquetas y campos** (`id` + `htmlFor`) en login y registro. *(Medio-Alto · Muy bajo)*
3. **Baseline global de foco** (`:focus-visible` en `globals.css`) + `@media (prefers-reduced-motion: reduce)`. *(Alto · Bajo)*

### P1 — Importante (semanas)
4. **Previsualizar el valor del onboarding** antes del muro de registro + captura de email para quien no está listo. *(Alto · Medio)*
5. **Subir la prueba social a la home** (testimonios, rostros verificados, casas reales destacadas). *(Alto · Medio)*
6. **Mitigar el cold-start** con expectativas claras o casas semilla etiquetadas mientras crece el inventario. *(Medio · Bajo-Medio)*
7. **Bajar el peso de JS** con code-splitting y lazy-load. *(Medio · Medio)*

### P2 — Pulido
8. Introducir `<h3>` en `/como-funciona` para jerarquía de escaneo. *(Bajo · Bajo)*
9. Verificar objetivos táctiles ≥44px en el header mobile. *(Bajo · Bajo)*
10. Pasada de **axe** por ruta para a11y fina (contraste, botones de ícono, `alt` dinámicos). *(Medio · Bajo)*

---

## 6. Limitaciones

- Los **flujos autenticados** (dashboard, verificación con selfie, publicación, intercambios/Yankis, mensajería) no se auditaron en vivo por estar detrás del muro de registro.
- Algunos **conteos automáticos por página** (ARIA, roles, `alt` dinámicos, jerarquía exacta de encabezados) no se pudieron capturar de forma fiable en esta sesión; por eso no se citan. Los hallazgos se basan en lo observado en pantalla y en el código leído directamente.
- El **inventario de casas** se carga parcialmente en el cliente; el cold-start se describe por lo observado.
- Métricas de performance desde una red rápida; en mobile/3G serán peores.
- Evaluación heurística experta, sin test moderado con usuarios; para decisiones de alto impacto, complementar con 5 sesiones de usabilidad.

---

## 7. Apéndice — Evidencia visual

### A1. Home — desktop (con popup de bienvenida superpuesto)
![Home desktop](assets/01-home-desktop.png)

### A2. Home — mobile (390px)
![Home mobile](assets/01-home-mobile.png)

### A3. Cómo funciona — desktop
![Cómo funciona](assets/02-como-funciona-desktop.png)

### A4. Explorar casas (/homes) — desktop
![Homes](assets/03-homes-desktop.png)

### A5. Login — desktop (split-screen con banner geo-dinámico)
![Login](assets/04-login-desktop.png)

### A6. Registro — desktop (etiquetas visibles, Google, toggle, incentivo Yankis)
![Registro](assets/05-register-desktop.png)

### A7. Anfitriones de Airbnb — desktop (landing diferenciada)
![Anfitriones Airbnb](assets/07-anfitriones-airbnb-desktop.png)

### A8. About — desktop
![About](assets/08-about-desktop.png)

---

*Línea base de UX generada el 30 de mayo de 2026 con evidencia verificada del sitio en producción. Repetir con la misma rúbrica de 9 dimensiones para medir progreso. Próxima auditoría sugerida: Q3 2026.*
