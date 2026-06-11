# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

## [1.1.0.0] - 2026-06-11

### Added
- Nuevo panel privado de auditorías UX (`/auditorias`), solo para administradores, con capturas de pantalla, métricas de performance y hallazgos de accesibilidad del sitio.

### Changed
- La plataforma se presenta ahora exclusivamente como un servicio para Chile: el buscador de hogares, los perfiles, el blog, el mapa del sitio y el contenido público (about, pricing, cómo funciona) muestran solo propiedades y destinos chilenos.
- El sistema de "Yankis" (créditos por noche) deja de mostrarse públicamente: el saldo, el historial y las menciones en el blog, términos, dashboard, navbar, onboarding y emails desaparecen de la experiencia visible. La coordinación de intercambios sigue funcionando igual para el usuario.
- Las páginas públicas cargan más rápido en visitas repetidas gracias a un caché en el navegador que se actualiza en segundo plano.
- El registro detecta correctamente cuando un correo ya está registrado y muestra un mensaje claro en vez de un error genérico.

### Fixed
- Recuperar contraseña vuelve a funcionar de forma confiable.
- El acceso no autorizado a `/auditorias` se bloquea de forma segura incluso si falta configuración del servidor.
- Las capturas de evidencia visual del panel de auditorías ya no dan error 404.
- Los hogares y perfiles de demostración de Argentina, Colombia y México ya no aparecen en la portada, en el buscador de coincidencias ni en perfiles individuales indexables por buscadores.
- La antigua página de "tokens" redirige de forma permanente a "Cómo funciona", y el mapa del sitio ya no referencia la URL anterior.

### Removed
- Las referencias visibles a "Yankis" se eliminaron de toda la plataforma pública (blog, términos, cómo funciona, dashboard, navbar, emails, llms.txt).
