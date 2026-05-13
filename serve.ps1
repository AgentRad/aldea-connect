# Tiny static file server for local preview.
# Usage: powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Then open http://localhost:8000/

param([int]$Port = 8000, [string]$Root = $PSScriptRoot)

$prefix  = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
try { $listener.Start() } catch {
    Write-Host "Could not bind $prefix - try a different port: .\serve.ps1 -Port 8080"
    exit 1
}
Write-Host "Serving $Root at $prefix  (Ctrl+C to stop)"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".htm"="text/html; charset=utf-8"
  ".css"="text/css; charset=utf-8";   ".js"="application/javascript; charset=utf-8"
  ".json"="application/json"; ".svg"="image/svg+xml"; ".png"="image/png"
  ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".gif"="image/gif"
  ".ico"="image/x-icon"; ".woff"="font/woff"; ".woff2"="font/woff2"
  ".txt"="text/plain; charset=utf-8"; ".xml"="application/xml"
}

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
  } catch { break }
  $req = $ctx.Request; $res = $ctx.Response
  $urlPath = [Uri]::UnescapeDataString($req.Url.AbsolutePath)
  if ($urlPath -eq "/") { $urlPath = "/index.html" }

  $filePath = Join-Path $Root ($urlPath.TrimStart("/").Replace("/", "\"))
  if ((Test-Path $filePath -PathType Container)) {
    $filePath = Join-Path $filePath "index.html"
  }

  if (-not (Test-Path $filePath -PathType Leaf)) {
    $notFound = Join-Path $Root "404.html"
    if (Test-Path $notFound -PathType Leaf) {
      $filePath = $notFound; $res.StatusCode = 404
    } else {
      $res.StatusCode = 404
      $bytes = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
      $res.OutputStream.Write($bytes, 0, $bytes.Length); $res.Close(); continue
    }
  }

  try {
    $ext = [IO.Path]::GetExtension($filePath).ToLower()
    $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
    $bytes = [IO.File]::ReadAllBytes($filePath)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
    $msg = [Text.Encoding]::UTF8.GetBytes("500: $($_.Exception.Message)")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  } finally {
    $res.Close()
  }
  Write-Host "$(Get-Date -Format HH:mm:ss)  $($req.HttpMethod) $urlPath -> $($res.StatusCode)"
}
