# Solución: Headers de Seguridad en Hostinger

## Problema Identificado

El CDN de Hostinger (`hcdn`) está sobrescribiendo los headers configurados en `.htaccess`, por lo que Security Headers solo detecta:
- ❌ X-Frame-Options: **FALTA**
- ❌ X-Content-Type-Options: **FALTA**
- ❌ Referrer-Policy: **FALTA**
- ❌ Permissions-Policy: **FALTA**
- ❌ Strict-Transport-Security: **FALTA**
- ⚠️ Content-Security-Policy: Solo `upgrade-insecure-requests`

**Resultado:** Calificación **D** en Security Headers

---

## Soluciones Implementadas

### Solución 1: .htaccess Mejorado ✅

**Archivo:** `src/.htaccess`

**Cambios realizados:**
1. Headers duplicados para HTTP y HTTPS (`env=!HTTPS` y `env=HTTPS`)
2. Agregados headers Cross-Origin (COEP, COOP, CORP)
3. **HSTS ACTIVADO** (ya tienes SSL)
4. Headers Server/X-Powered-By removidos

```apache
<IfModule mod_headers.c>
    Header set X-Frame-Options "SAMEORIGIN" env=!HTTPS
    Header always set X-Frame-Options "SAMEORIGIN" env=HTTPS

    # ... más headers ...

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" env=HTTPS
</IfModule>
```

### Solución 2: Archivo PHP de Headers ✅

**Archivo creado:** `src/security-headers.php`

Este archivo PHP fuerza los headers si `.htaccess` no funciona por el CDN.

---

## IMPORTANTE: Configuración en Hostinger

### Opción A: Desactivar CDN Temporalmente (Recomendado para testing)

1. Ve a **hPanel → Sitios Web → Administrar**
2. **Herramientas avanzadas → CDN**
3. Desactiva temporalmente el CDN
4. Prueba nuevamente en https://securityheaders.com/

⚠️ **Nota:** Esto afectará el rendimiento temporalmente

### Opción B: Configurar Headers en el Panel de Hostinger

1. Ve a **hPanel → Sitios Web → Administrar**
2. **Herramientas avanzadas → Headers HTTP personalizados**
3. Agrega manualmente cada header:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

### Opción C: Usar archivo PHP (Si Opción A y B no funcionan)

Si Hostinger no permite configurar headers:

1. Renombra `index.html` a `index.php`
2. Agrega al inicio del archivo:
```php
<?php require_once 'security-headers.php'; ?>
```

⚠️ **Desventaja:** Los archivos estáticos (CSS, JS, imágenes) no tendrán estos headers

---

## Verificación

Después de aplicar cualquiera de las opciones:

1. **Limpiar caché de Hostinger:**
   - hPanel → Sitios Web → Administrar → Herramientas avanzadas → Caché
   - Clic en "Limpiar caché del sitio web"

2. **Verificar headers:**
```bash
curl -I https://www.FelipeLopezDataBIAnalyst.cl/
```

3. **Probar en Security Headers:**
   - https://securityheaders.com/?q=https://www.FelipeLopezDataBIAnalyst.cl

---

## Headers Esperados (Meta: Puntuación A+)

### Headers Esenciales
✅ `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
✅ `X-Frame-Options: SAMEORIGIN`
✅ `X-Content-Type-Options: nosniff`
✅ `Referrer-Policy: strict-origin-when-cross-origin`
✅ `Permissions-Policy: geolocation=(), microphone=(), camera=()...`

### Headers Avanzados (Para A+)
✅ `Content-Security-Policy: default-src 'self'; ...`
✅ `Cross-Origin-Embedder-Policy: require-corp`
✅ `Cross-Origin-Opener-Policy: same-origin`
✅ `Cross-Origin-Resource-Policy: same-origin`

---

## Notas Importantes sobre Hostinger CDN

El CDN de Hostinger (`hcdn`) tiene estas características:
- Cachea respuestas y headers
- Puede sobrescribir headers de `.htaccess`
- Agrega sus propios headers (`x-hcdn-*`)

**Recomendaciones:**
1. Configurar headers directamente en el panel de Hostinger
2. Si es crítico, considerar desactivar CDN para sitios pequeños
3. Alternativamente, usar Cloudflare (mayor control sobre headers)

---

## Cloudflare como Alternativa (Opcional)

Si los headers siguen sin aplicarse:

1. **Registrarte en Cloudflare** (gratis)
2. Apuntar tu dominio a Cloudflare
3. En **Transform Rules → Modify Response Header**, agregar:
   - X-Frame-Options: SAMEORIGIN
   - X-Content-Type-Options: nosniff
   - Strict-Transport-Security: max-age=31536000
   - Etc.

**Ventajas:**
- Control total sobre headers
- CDN gratuito más rápido
- Protección DDoS incluida
- SSL/TLS flexible

---

## Puntuación Esperada

| Situación | Puntuación |
|-----------|------------|
| **Actual (con CDN Hostinger)** | D |
| **Con .htaccess funcionando** | B+ |
| **Con todos los headers** | A |
| **Con headers + CSP estricto** | A+ |

---

## Siguiente Paso Inmediato

**ACCIÓN REQUERIDA:**

1. Accede a **hPanel de Hostinger**
2. Ve a configuración de tu sitio
3. Busca la opción de "Headers HTTP" o "Configuración avanzada"
4. Agrega los headers manualmente desde el panel
5. Limpia el caché
6. Verifica en https://securityheaders.com/

Si no encuentras la opción en el panel, contacta al soporte de Hostinger y solicita:
> "Necesito configurar headers de seguridad HTTP personalizados (X-Frame-Options, HSTS, CSP) para mi sitio. ¿Cómo puedo hacerlo con su CDN activo?"

---

## Build y Deploy

Una vez configurado:

```bash
npm run build
```

Sube los archivos de `/dist` a Hostinger incluyendo:
- `.htaccess` actualizado
- `security-headers.php` (por si acaso)

---

**Fecha:** 19/10/2025
**Estado:** Configuración lista, requiere ajustes en panel de Hostinger
