param([switch]$InstallShortcut)
$ErrorActionPreference = 'Stop'
try {
    $root = Split-Path -Parent $PSScriptRoot
    $index = Join-Path $root 'index.html'
    if (-not (Test-Path -LiteralPath $index)) {
        throw 'Clario files are missing. Extract the entire ZIP before launching.'
    }
    if ($InstallShortcut) {
        $desktop = [Environment]::GetFolderPath('Desktop')
        $shell = New-Object -ComObject WScript.Shell
        $shortcut = $shell.CreateShortcut((Join-Path $desktop 'Clario.lnk'))
        $shortcut.TargetPath = Join-Path $root 'Launch-Clario.cmd'
        $shortcut.WorkingDirectory = $root
        $shortcut.Description = 'Open Clario screenshot and annotation studio'
        $shortcut.IconLocation = "$env:SystemRoot\System32\shell32.dll,3"
        $shortcut.Save()
        Write-Host 'Clario desktop shortcut created. Keep this extracted folder in place.'
        exit 0
    }
    $url = ([System.Uri]::new($index)).AbsoluteUri
    $candidates = @()
    foreach ($base in @([Environment]::GetEnvironmentVariable('ProgramFiles(x86)'), $env:ProgramFiles, $env:LOCALAPPDATA)) {
        if ($base) {
            $candidates += Join-Path $base 'Microsoft\Edge\Application\msedge.exe'
        }
    }
    foreach ($base in @($env:ProgramFiles, [Environment]::GetEnvironmentVariable('ProgramFiles(x86)'), $env:LOCALAPPDATA)) {
        if ($base) {
            $candidates += Join-Path $base 'Google\Chrome\Application\chrome.exe'
        }
    }
    $browser = $candidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    if ($browser) {
        Start-Process -FilePath $browser -ArgumentList @("--app=$url")
    } else {
        Start-Process -FilePath $index
    }
} catch {
    Write-Host ("Unable to launch Clario: " + $_.Exception.Message)
    exit 1
}
