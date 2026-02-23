# PowerShell script for Windows
# Original bash script converted for Windows compatibility

$OUTPUT = & npx vite build --minify false --logLevel error --outDir .\dist 2>&1
$EXIT_CODE = $LASTEXITCODE

if ($EXIT_CODE -ne 0) {
    Write-Host $OUTPUT
}

exit $EXIT_CODE
