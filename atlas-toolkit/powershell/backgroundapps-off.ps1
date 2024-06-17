# Disable background apps by modifying the registry

# Registry path for BackgroundAccessApplications
$registryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"

# Registry path for Search
$searchRegistryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search"

# Registry path for AppPrivacy
$appPrivacyRegistryPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy"

try {
    # Set the GlobalUserDisabled value to 1 in BackgroundAccessApplications
    Set-ItemProperty -Path $registryPath -Name "GlobalUserDisabled" -Value 1 -Type DWord -ErrorAction Stop

    # Set the BackgroundAppGlobalToggle value to 0 in Search
    Set-ItemProperty -Path $searchRegistryPath -Name "BackgroundAppGlobalToggle" -Value 0 -Type DWord -ErrorAction Stop

    # Force registry keys under AppPrivacy
    Set-ItemProperty -Path $appPrivacyRegistryPath -Name "LetAppsRunInBackground" -Value 2 -Type DWord -ErrorAction Stop
    Remove-ItemProperty -Path $appPrivacyRegistryPath -Name "LetAppsRunInBackground_UserInControlOfTheseApps" -ErrorAction SilentlyContinue
    Remove-ItemProperty -Path $appPrivacyRegistryPath -Name "LetAppsRunInBackground_ForceAllowTheseApps" -ErrorAction SilentlyContinue
    Remove-ItemProperty -Path $appPrivacyRegistryPath -Name "LetAppsRunInBackground_ForceDenyTheseApps" -ErrorAction SilentlyContinue

    Write-Output "Background applications disabled successfully."
}
catch {
    Write-Error "Failed to disable background applications: $_"
}
