<?php

/**
 * CORS configuration for the Miloha Grain Hub API.
 *
 * For local development the proxy (Vite) handles CORS; this config matters
 * in production when the frontend and backend are served from different origins.
 *
 * Adjust `allowed_origins` to match your production domain before deploying.
 */
return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
     * In production set this to your actual frontend origin, e.g.:
     *   ['https://www.milohapuregrains.co.tz']
     *
     * For development the Vite proxy forwards requests from the same origin,
     * so this setting is rarely triggered locally.
     */
    'allowed_origins' => env('CORS_ALLOWED_ORIGINS', '*') === '*'
        ? ['*']
        : explode(',', env('CORS_ALLOWED_ORIGINS', '*')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
