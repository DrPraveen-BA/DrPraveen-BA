$ErrorActionPreference = 'Stop'
$root = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $root | Out-Null
$app = Join-Path $root 'app'
New-Item -ItemType Directory -Path $app | Out-Null
$installer = Join-Path $root 'Setup.exe'
Set-Content $installer 'mock fixture, not a signed executable'
Set-Content (Join-Path $app 'Clario Studio.exe') 'mock fixture'
Set-Content (Join-Path $app 'native.node') 'mock fixture'
$pin = 'A' * 40
$global:clarioTestStatus = 'Valid'
$global:clarioTestThumbprint = $pin
$global:clarioTestTimestamp = $true
# Only mocked trust responses: this suite tests fail-closed policy, not a real certificate.
function Get-AuthenticodeSignature {
 param([string]$LiteralPath)
 [pscustomobject]@{Status=$global:clarioTestStatus;SignerCertificate=[pscustomobject]@{Thumbprint=$global:clarioTestThumbprint;Subject='CN=Test Publisher'};TimeStamperCertificate=$(if ($global:clarioTestTimestamp) {[pscustomobject]@{Subject='CN=Test Timestamp'}} else {$null})}
}
$verify = Join-Path $PSScriptRoot '../scripts/verify-commercial.ps1'
$report = Join-Path $root 'report.json'
function Invoke-Gate {
 & $verify -Installer $installer -AppDirectory $app -ExpectedThumbprint $pin -ExpectedSubject 'CN=Test Publisher' -ReportPath $report
}
function Expect-Rejection([string]$Reason) {
 $rejected = $false
 try { Invoke-Gate } catch { if ($_.Exception.Message -notlike "*$Reason*") { throw }; $rejected = $true }
 if (-not $rejected) { throw "Gate accepted forbidden condition: $Reason" }
}
try {
 $global:clarioTestStatus = 'NotSigned'; Expect-Rejection 'Invalid or absent trusted signature'
 $global:clarioTestStatus = 'UnknownError'; Expect-Rejection 'Invalid or absent trusted signature'
 $global:clarioTestStatus = 'Valid'; $global:clarioTestThumbprint = 'B' * 40; Expect-Rejection 'Wrong publisher'
 $global:clarioTestThumbprint = $pin; $global:clarioTestTimestamp = $false; Expect-Rejection 'Missing trusted timestamp'
 $global:clarioTestTimestamp = $true; Invoke-Gate
 $result = @(Get-Content $report -Raw | ConvertFrom-Json)
 if ($result.Count -ne 3 -or @($result | Where-Object {$_.sha256.Length -ne 64}).Count -ne 0) { throw 'Hash report incomplete' }
 Write-Host 'PASS: unsigned, invalid trust, wrong publisher, missing timestamp rejected; complete mock report verified'
} finally {
 Remove-Item -LiteralPath $root -Recurse -Force
 Remove-Variable clarioTestStatus,clarioTestThumbprint,clarioTestTimestamp -Scope Global
}
