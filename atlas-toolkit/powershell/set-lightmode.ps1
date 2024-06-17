# PowerShell script to enable dark mode systemwide
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name SystemUsesLightTheme -PropertyType DWord -Value 1 -Force
New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" -Name AppsUseLightTheme -PropertyType DWord -Value 1 -Force

taskkill /F /IM explorer.exe
Start-Sleep -Seconds 2.0
Start explorer.exe
