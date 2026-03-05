# Guía de Seguridad

## Resumen de Mejoras Implementadas

Este documento describe las mejoras de seguridad implementadas en el proyecto.

---

## Vulnerabilidades Corregidas

### 1. Archivo PHP Obsoleto Eliminado
- **Archivo**: `src/sendmail.php` (ELIMINADO)
- **Riesgo**: Código no utilizado que contenía email hardcodeado
- **Estado**: ✅ Resuelto

### 2. Dependencias NPM Actualizadas
- **Comando ejecutado**: `npm audit fix && npm update`
- **Vulnerabilidades corregidas**: 9 (3 low, 3 moderate, 3 high)
- **Estado**: ✅ 0 vulnerabilidades detectadas
- **Paquetes actualizados**: 180+

---

## Protecciones Implementadas

### Formulario de Contacto

#### 1. CAPTCHA Habilitado
- **Ubicación**: `src/index.html:774`
- **Servicio**: FormSubmit.co
- **Tipo**: reCAPTCHA
- **Propósito**: Prevenir envíos automatizados por bots

#### 2. Honeypot Anti-Spam
- **Ubicación**: `src/index.html:777-780`
- **Método**: Campo oculto `_gotcha`
- **Propósito**: Detectar bots que completan todos los campos

#### 3. Validación Anti-Spam JavaScript
- **Ubicación**: `src/assets/js/success-modal.js:42-78`
- **Características**:
  - Detección de palabras spam (viagra, casino, crypto, etc.)
  - Límite de caracteres (min: 10, max: 5000)
  - Detección de múltiples URLs (máx: 2)
  - Detección de caracteres repetidos excesivos
  - Validación de longitud de nombre (máx: 100)

#### 4. Rate Limiting
- **Ubicación**: `src/assets/js/success-modal.js:81-115`
- **Límite**: 3 mensajes por hora por dispositivo
- **Método**: localStorage del navegador
- **Mensaje**: Muestra tiempo restante cuando se alcanza el límite

---

## Headers de Seguridad HTTP

### Archivo: `src/.htaccess`

#### Headers Implementados:
1. **X-Frame-Options**: `SAMEORIGIN`
   - Previene clickjacking
   - Solo permite cargar el sitio en iframes del mismo origen

2. **X-Content-Type-Options**: `nosniff`
   - Previene MIME-type sniffing
   - Fuerza al navegador a respetar el tipo de contenido declarado

3. **X-XSS-Protection**: `1; mode=block`
   - Activa la protección XSS del navegador
   - Bloquea la página si detecta un ataque

4. **Referrer-Policy**: `strict-origin-when-cross-origin`
   - Controla qué información se envía en el header Referer
   - Protege URLs sensibles

5. **Permissions-Policy**
   - Deshabilita APIs peligrosas: geolocation, microphone, camera, payment, etc.

6. **Content-Security-Policy** (CSP)
   - Política estricta de carga de recursos
   - Permite solo scripts y estilos de fuentes confiables
   - Previene XSS e inyección de código

#### Protecciones Adicionales:
- 🛡️ Anti-hotlinking de imágenes
- 🛡️ Bloqueo de archivos sensibles (.env, .git, package.json)
- 🛡️ Desactivación de listado de directorios
- 🛡️ Protección contra inyección SQL y XSS en query strings
- 🛡️ Bloqueo de user agents maliciosos
- ⚡ Compresión GZIP habilitada
- ⚡ Cache control configurado

---

## Control de Crawlers

### Archivo: `src/robots.txt`

- ✅ Permite crawlers legítimos (Google, Bing)
- ❌ Bloquea bots agresivos (Ahrefs, Semrush, MJ12bot, etc.)
- 🔒 Protege directorios técnicos (/assets/js, /assets/css)
- ⏱️ Crawl-delay: 10 segundos

---

## Actualizaciones Automáticas

### GitHub Dependabot

**Archivo**: `.github/dependabot.yml`

- 📅 Revisa dependencias semanalmente (lunes 9:00 AM)
- 🔄 Actualiza NPM y GitHub Actions automáticamente
- 🏷️ Etiqueta PRs con: dependencies, npm, security
- 📊 Agrupa por tipo: production vs development
- ⚙️ Límite: 10 PRs simultáneos

---

## Scripts NPM Agregados

```bash
# Revisar vulnerabilidades y paquetes desactualizados
npm run security-check

# Actualizar dependencias y corregir vulnerabilidades
npm run update-deps
```

---

## Recomendaciones Adicionales

### Para Activar Cuando Tengas SSL/HTTPS:

1. **En `.htaccess`**, descomentar (líneas 121-125):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

2. **Agregar header HSTS** (línea 48):
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

### Opcional - Mejoras Futuras:

1. **Crear sitemap.xml** para SEO
2. **Implementar security.txt** (RFC 9116)
3. **Agregar Subresource Integrity (SRI)** para CDNs externos
4. **Configurar alertas de monitoreo** (Google Analytics Events)
5. **Ofuscar datos de contacto** en el HTML

---

## Testing de Seguridad

### Headers HTTP
Verifica tus headers en:
- https://securityheaders.com
- https://observatory.mozilla.org

### SSL/TLS
Analiza tu certificado en:
- https://www.ssllabs.com/ssltest/

### Vulnerabilidades
- Ejecuta regularmente: `npm run security-check`
- Revisa los PRs de Dependabot semanalmente

---

## Contacto de Seguridad

Si encuentras una vulnerabilidad de seguridad, por favor repórtala de forma responsable a:
- **Email**: felipelopez.ast@gmail.com
- **Asunto**: [SEGURIDAD] Reporte de vulnerabilidad

---

## Changelog de Seguridad

### 2025-10-19
- ✅ Eliminado sendmail.php obsoleto
- ✅ Corregidas 9 vulnerabilidades NPM
- ✅ Actualizadas 180+ dependencias
- ✅ Implementado CAPTCHA en formulario
- ✅ Agregado honeypot anti-spam
- ✅ Implementada validación anti-spam JavaScript
- ✅ Implementado rate limiting (3 mensajes/hora)
- ✅ Creado .htaccess con headers de seguridad
- ✅ Creado robots.txt con control de crawlers
- ✅ Configurado Dependabot
- ✅ Agregados scripts de seguridad a package.json

---

**Última actualización**: 19 de octubre de 2025
