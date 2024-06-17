# PowerShell script to detect system theme mode (dark or light)
function Get-SystemThemeMode {
    $AppsTheme = Get-ItemPropertyValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name AppsUseLightTheme -ErrorAction SilentlyContinue
    $SystemTheme = Get-ItemPropertyValue -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name SystemUsesLightTheme -ErrorAction SilentlyContinue

    if ($AppsTheme -eq 0 -or $SystemTheme -eq 0) {
        Write-Output "Dark"
    }
    else {
        Write-Output "Light"
    }
}

Get-SystemThemeMode
