<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tretproekt</title>
</head>
<body>
    <div id="app"></div>
    
    <!-- Load frontend from separate Vite server in development -->
    @if (env('APP_ENV') === 'local')
        <script type="module" src="http://localhost:5173/src/main.js"></script>
    @else
        <!-- In production, use built assets -->
        @vite('resources/js/app.js')
    @endif
</body>
</html>
