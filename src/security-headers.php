<?php
/**
 * SECURITY HEADERS - PEDRORIVERA.NET
 * Archivo para forzar headers de seguridad HTTP en Hostinger
 *
 * INSTRUCCIONES DE USO:
 * Incluir este archivo al inicio de index.html renombrado a index.php
 * O configurar en .htaccess para que se ejecute automáticamente
 */

// Prevenir acceso directo
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access not permitted');
}

// Headers de seguridad
function setSecurityHeaders() {
    // Prevenir Clickjacking
    header('X-Frame-Options: SAMEORIGIN', true);

    // Prevenir MIME-type sniffing
    header('X-Content-Type-Options: nosniff', true);

    // Activar protección XSS del navegador (legacy)
    header('X-XSS-Protection: 1; mode=block', true);

    // Política de referencia
    header('Referrer-Policy: strict-origin-when-cross-origin', true);

    // Política de permisos - deshabilitar APIs peligrosas
    header('Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()', true);

    // Content Security Policy
    $csp = "default-src 'self'; " .
           "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://formsubmit.co https://cdn.jsdelivr.net https://oss.maxcdn.com https://www.google.com https://www.gstatic.com; " .
           "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
           "img-src 'self' data: https: blob:; " .
           "font-src 'self' data: https://fonts.gstatic.com; " .
           "connect-src 'self' https://formsubmit.co; " .
           "frame-src 'self' https://www.google.com; " .
           "object-src 'none'; " .
           "base-uri 'self'; " .
           "form-action 'self' https://formsubmit.co; " .
           "frame-ancestors 'self'; " .
           "upgrade-insecure-requests;";
    header('Content-Security-Policy: ' . $csp, true);

    // Cross-Origin headers para mejor aislamiento
    header('Cross-Origin-Embedder-Policy: require-corp', true);
    header('Cross-Origin-Opener-Policy: same-origin', true);
    header('Cross-Origin-Resource-Policy: same-origin', true);

    // HSTS - Strict Transport Security (solo si HTTPS está activo)
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', true);
    }

    // Quitar headers que exponen información del servidor
    header_remove('Server');
    header_remove('X-Powered-By');
}

// Ejecutar headers de seguridad
setSecurityHeaders();
?>
