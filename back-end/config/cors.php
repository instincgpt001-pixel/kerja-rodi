<?php

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
     * Daftarkan alamat frontend Anda di sini.
     * Ini memberitahu Laravel untuk menerima permintaan API dari alamat ini.
     * Alamat server Vite/React Anda secara default adalah http://localhost:5173
     */
    'allowed_origins' => [
        'http://localhost:5173',
    ],

    /*
     * Matches Same Origin (https://en.wikipedia.org/wiki/Same-origin_policy) requests with allowed_origins.
     * If you don't want to share your internal APIs with external websites, set this to true.
     */
    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
