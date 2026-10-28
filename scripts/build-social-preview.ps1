# Rebuild the plain branded social card on Windows; no image-generation service.
Add-Type -AssemblyName System.Drawing
$repoRoot = Split-Path -Parent $PSScriptRoot
$outputPath = Join-Path $repoRoot 'site/assets/social-preview-v3.jpg'
$bitmap = New-Object System.Drawing.Bitmap(1200, 630)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$cream = [System.Drawing.ColorTranslator]::FromHtml('#f7f4ed')
$ink = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#282e28'))
$orange = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#b5441b'))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#64685f'))
$brandFont = New-Object System.Drawing.Font('Arial', 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$titleFont = New-Object System.Drawing.Font('Arial', 83, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$areaFont = New-Object System.Drawing.Font('Arial', 29, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
try {
  $graphics.Clear($cream)
  $graphics.FillRectangle($orange, 70, 70, 76, 7)
  $graphics.DrawString('Arin Handyman and Contracting', $brandFont, $ink, 70, 110)
  $graphics.DrawString('Home repairs', $titleFont, $ink, 64, 207)
  $graphics.DrawString('& renovations', $titleFont, $ink, 64, 300)
  $graphics.DrawString('Halton & the Greater Toronto Area', $areaFont, $muted, 70, 459)
  $graphics.FillRectangle($orange, 0, 600, 1200, 30)
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
} finally {
  $graphics.Dispose()
  $bitmap.Dispose()
  $ink.Dispose()
  $orange.Dispose()
  $muted.Dispose()
  $brandFont.Dispose()
  $titleFont.Dispose()
  $areaFont.Dispose()
}
Write-Output "Generated $outputPath"
