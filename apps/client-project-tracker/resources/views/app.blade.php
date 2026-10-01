<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Client Project Tracker</title>
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/ts/app.tsx'])
    </head>
    <body class="min-h-screen bg-white dark:bg-gray-950">
        <div id="app"></div>
    </body>
</html>
