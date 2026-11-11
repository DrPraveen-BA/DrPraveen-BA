param([Parameter(Mandatory=$true)][string]$Installer,
      [Parameter(Mandatory=$true)][string]$AppDirectory,
      [Parameter(Mandatory=$true)][string]$ExpectedThumbprint,
      [Parameter(Mandatory=$true)][string]$ExpectedSubject,
      [string]$ReportPath = 'release/direct/signature-report.json')
$ErrorActionPreference = 'Stop'
$pin = ($ExpectedThumbprint -replace '\s','').ToUpperInvariant()
if ($pin -notmatch '^[A-F0-9]{40}$') { throw 'Invalid certificate pin' }
if (-not (Test-Path -LiteralPath $Installer -PathType Leaf)) { throw 'Installer missing' }
if (-not (Test-Path -LiteralPath $AppDirectory -PathType Container)) { throw 'Unpacked application missing' }
$main = Join-Path $AppDirectory 'Clario Studio.exe'
if (-not (Test-Path -LiteralPath $main)) { throw 'Main executable missing' }
$files = @((Get-Item -LiteralPath $Installer)) + @(Get-ChildItem -LiteralPath $AppDirectory -Recurse -File | Where-Object { $_.Extension -in '.exe','.dll','.node' })
$report = foreach ($file in $files) {
  $signature = Get-AuthenticodeSignature -LiteralPath $file.FullName
  if ($signature.Status -ne 'Valid') { throw "Invalid or absent trusted signature: $($file.Name): $($signature.Status)" }
  # Every PE must be trusted; installer and app must match our verified publisher pin.
  if ($file.FullName -eq (Get-Item -LiteralPath $Installer).FullName -or $file.FullName -eq (Get-Item -LiteralPath $main).FullName) {
    if ($signature.SignerCertificate.Thumbprint -ne $pin -or $signature.SignerCertificate.Subject -ne $ExpectedSubject) { throw "Wrong publisher: $($file.Name)" }
  }
  if (-not $signature.TimeStamperCertificate) { throw "Missing trusted timestamp: $($file.Name)" }
  [pscustomobject]@{file=$file.FullName;sha256=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash;subject=$signature.SignerCertificate.Subject;thumbprint=$signature.SignerCertificate.Thumbprint;timestampSubject=$signature.TimeStamperCertificate.Subject;status='Valid'}
}
$report | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $ReportPath -Encoding utf8
Write-Host "Verified $($files.Count) signed binaries; report: $ReportPath"
