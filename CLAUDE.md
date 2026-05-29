# CLAUDE.md

Guía para Claude Code al trabajar en este repositorio (Rukka).

## gstack

Comandos disponibles del plugin **gstack**. Se invocan como slash commands (ej. `/qa`, `/ship`).

### QA y testing
- `/browse` — navegador headless rápido para QA y dogfooding del sitio.
- `/qa` — testea sistemáticamente una app web y corrige los bugs encontrados.
- `/qa-only` — QA en modo solo-reporte (no aplica fixes).
- `/benchmark` — detección de regresiones de performance vía el daemon de browse.
- `/benchmark-models` — benchmark cruzado de modelos para skills de gstack.
- `/canary` — monitoreo canary post-deploy.

### Revisión de código y planes
- `/review` — revisión de PR antes de mergear.
- `/autoplan` — pipeline de auto-revisión (CEO, diseño, eng, DX) con decisiones automáticas.
- `/plan-ceo-review` — revisión de plan en modo CEO/fundador.
- `/plan-design-review` — revisión de plan con ojo de diseñador.
- `/plan-eng-review` — revisión de plan en modo eng manager.
- `/plan-devex-review` — revisión interactiva de developer experience del plan.
- `/plan-tune` — auto-ajuste de sensibilidad de preguntas + psicografía del developer.
- `/health` — dashboard de calidad de código.
- `/retro` — retrospectiva semanal de ingeniería.

### Diseño
- `/design-consultation` — propone un sistema de diseño completo y genera previews.
- `/design-html` — finalización de diseño: HTML/CSS de calidad de producción.
- `/design-review` — QA visual: inconsistencias, espaciado, jerarquía, patrones "AI slop".
- `/design-shotgun` — genera variantes de diseño, las compara y recopila feedback.

### Deploy y entrega
- `/ship` — flujo de ship: detecta base branch, corre tests, revisa diff, bump VERSION, CHANGELOG, commit, push, PR.
- `/land-and-deploy` — flujo de land and deploy.
- `/landing-report` — dashboard read-only de la cola de ship.
- `/setup-deploy` — configura settings de deploy para `/land-and-deploy`.

### Debugging e investigación
- `/investigate` — debugging sistemático con investigación de causa raíz.
- `/cso` — modo Chief Security Officer.
- `/office-hours` — YC Office Hours (dos modos).
- `/spec` — convierte intención vaga en una spec ejecutable en cinco fases.

### Documentación
- `/document-generate` — genera documentación faltante desde cero.
- `/document-release` — actualización de docs post-ship.
- `/make-pdf` — convierte un markdown en un PDF de calidad de publicación.
- `/learn` — administra learnings del proyecto.
- `/skillify` — codifica el último flujo `/scrape` exitoso en un browser-skill permanente.
- `/scrape` — extrae datos de una página web.

### Seguridad de edición y contexto
- `/careful` — guardrails de seguridad para comandos destructivos.
- `/guard` — modo seguro completo: warnings de comandos destructivos + edición scoped por directorio.
- `/freeze` — restringe ediciones a un directorio específico durante la sesión.
- `/unfreeze` — limpia el límite establecido por `/freeze`.
- `/context-save` — guarda el contexto de trabajo.
- `/context-restore` — restaura el contexto guardado por `/context-save`.

### iOS
- `/ios-qa` — QA en dispositivo real para apps SwiftUI.
- `/ios-fix` — corrector autónomo de bugs iOS.
- `/ios-design-review` — auditoría visual de diseño en hardware real.
- `/ios-sync` — regenera el debug bridge de iOS contra los templates de gstack.
- `/ios-clean` — elimina el package SPM DebugBridge.

### Browser y agentes
- `/connect-chrome` — lanza GStack Browser (Chromium controlado por AI con la sidebar).
- `/setup-browser-cookies` — importa cookies del navegador real a la sesión de browse.
- `/pair-agent` — emparejá un agente remoto con tu navegador.
- `/codex` — wrapper de OpenAI Codex CLI (tres modos).

### gbrain
- `/setup-gbrain` — configura gbrain para este agente (CLI, brain local, MCP).
- `/sync-gbrain` — mantiene gbrain al día con el código del repo.

### Mantenimiento
- `/gstack-upgrade` — actualiza gstack a la última versión.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
