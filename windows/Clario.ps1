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
    # Compatibility entry point: normal launch does not require PowerShell.
    & (Join-Path $root 'Launch-Clario.cmd')
    exit $LASTEXITCODE
} catch {
    Write-Host ("Unable to launch Clario: " + $_.Exception.Message)
    exit 1
}
