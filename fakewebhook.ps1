# Sends a signed check_run webhook that triggers the Robokit deploy flow.
# Reads WEBHOOK_SECRET and PORT from .ronen automatically.
#
# Required params (GitHub-side values not in .ronen):
#   -Owner          GitHub org/user  (e.g. "scalecube")
#   -Repo           Repository name  (e.g. "my-service")
#   -Sha            A real commit SHA in that repo  (git rev-parse HEAD)
#   -InstallationId GitHub App installation ID for that repo
#                   GitHub -> Settings -> Developer settings ->
#                   GitHub Apps -> [app] -> Install App -> gear -> URL has the ID
#
# Usage:
#   .\fakewebhook.ps1 -Owner scalecube -Repo my-service -Sha abc123 -InstallationId 12345678

param(
    [string]$Owner          = "scalecube",
    [string]$Repo           = "robokit",
    [string]$Branch         = "develop",
    [string]$Sha            = "",
    [int]   $InstallationId = 0
)

# --- load .ronen ---
$ronenPath = Join-Path $PSScriptRoot ".ronen"
if (-not (Test-Path $ronenPath)) {
    Write-Error ".ronen file not found at $ronenPath"
    exit 1
}
$ronen  = Get-Content $ronenPath -Raw | ConvertFrom-Json
$secret = $ronen.WEBHOOK_SECRET
$port   = $ronen.PORT ?? "7777"
$url    = "http://localhost:$port/api/github/webhooks"

if (-not $secret) {
    Write-Error "WEBHOOK_SECRET not found in .ronen"
    exit 1
}
if (-not $Repo) {
    Write-Error "Please provide -Repo <repository-name>"
    exit 1
}
if (-not $Sha) {
    Write-Error "Please provide -Sha <commit-sha>"
    exit 1
}
if ($InstallationId -eq 0) {
    Write-Warning "InstallationId is 0 — GitHub API calls (check run creation) will fail. Pass -InstallationId <id> for a full e2e run."
}

# --- build payload ---
$delivery = [System.Guid]::NewGuid().ToString()
$payload = @{
    action = "completed"
    installation = @{
        id      = $InstallationId
        node_id = "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9u$InstallationId"
    }
    sender = @{
        login      = "local-dev"
        avatar_url = "https://github.com/ghost.png"
    }
    repository = @{
        name  = $Repo
        owner = @{ login = $Owner }
    }
    check_run = @{
        id          = [int](Get-Date -UFormat "%s")
        name        = "robokit-deploy"
        head_sha    = $Sha
        status      = "completed"
        conclusion  = "success"
        external_id = ""
        pull_requests = @()
        check_suite = @{
            head_branch   = $Branch
            pull_requests = @()
        }
    }
} | ConvertTo-Json -Depth 10 -Compress

# --- sign ---
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($payload)
$keyBytes  = [System.Text.Encoding]::UTF8.GetBytes($secret)
$hmac      = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key  = $keyBytes
$hashBytes = $hmac.ComputeHash($bodyBytes)
$signature = "sha256=" + (($hashBytes | ForEach-Object { $_.ToString("x2") }) -join "")

Write-Host "POST $url"
Write-Host "Owner/Repo:    $Owner/$Repo  branch=$Branch"
Write-Host "Sha:           $Sha"
Write-Host "InstallId:     $InstallationId"
Write-Host "Signature:     $signature"
Write-Host ""

# --- send ---
try {
    $response = Invoke-WebRequest -Uri $url -Method POST `
        -Headers @{
            "X-GitHub-Event"      = "check_run"
            "X-GitHub-Delivery"   = $delivery
            "X-Hub-Signature-256" = $signature
            "Content-Type"        = "application/json"
        } `
        -Body $payload `
        -UseBasicParsing

    Write-Host "Response: $($response.StatusCode) $($response.StatusDescription)"
} catch {
    Write-Host "Response: $($_.Exception.Response.StatusCode.value__) - $($_.Exception.Message)"
}
