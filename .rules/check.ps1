Write-Host "Script started"
# PowerShell script for Windows
# Original bash script converted for Windows compatibility

Write-Host "Running ast-grep scans..."

& npx ast-grep scan -r .rules/SelectItem.yml
& npx ast-grep scan -r .rules/contrast.yml
& npx ast-grep scan -r .rules/supabase-google-sso.yml
& npx ast-grep scan -r .rules/toast-hook.yml

$useauth_output = & npx ast-grep scan -r .rules/useAuth.yml 2>$null

Write-Host "useAuth scan completed. Output length: $($useauth_output.Length)"

if ([string]::IsNullOrEmpty($useauth_output)) {
    Write-Host "No useAuth issues found. Exiting with success."
    exit 0
}

$authprovider_output = & npx ast-grep scan -r .rules/authProvider.yml 2>$null

Write-Host "authProvider scan completed. Output length: $($authprovider_output.Length)"

if (-not [string]::IsNullOrEmpty($authprovider_output)) {
    Write-Host "AuthProvider found. Exiting with success."
    exit 0
}

Write-Host "=== ast-grep scan -r .rules/useAuth.yml output ==="
Write-Host $useauth_output
Write-Host ""
Write-Host "=== ast-grep scan -r .rules/authProvider.yml output ==="
Write-Host $authprovider_output
Write-Host ""
Write-Host "⚠️  Issue detected:"
Write-Host "The code uses useAuth Hook but does not have AuthProvider component wrapping the components."
Write-Host "Please ensure that components using useAuth are wrapped with AuthProvider to provide proper authentication context."
Write-Host ""
Write-Host "Suggested fixes:"
Write-Host "1. Add AuthProvider wrapper in app.tsx or corresponding root component"
Write-Host "2. Ensure all components using useAuth are within AuthProvider scope"
