# Enable background apps and remove forced registry keys

# Registry path for BackgroundAccessApplications
$registryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"

# Registry path for Search
$searchRegistryPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search"

# Registry path for AppPrivacy policy
$appPrivacyPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy"

try {
    # Remove the GlobalUserDisabled value from BackgroundAccessApplications
    Remove-ItemProperty -Path $registryPath -Name "GlobalUserDisabled" -ErrorAction Stop

    # Remove the BackgroundAppGlobalToggle value from Search
    Remove-ItemProperty -Path $searchRegistryPath -Name "BackgroundAppGlobalToggle" -ErrorAction Stop

    # Remove forced AppPrivacy keys
    Remove-ItemProperty -Path $appPrivacyPath -Name "LetAppsRunInBackground" -ErrorAction Stop
    Remove-ItemProperty -Path $appPrivacyPath -Name "LetAppsRunInBackground_UserInControlOfTheseApps" -ErrorAction Stop
    Remove-ItemProperty -Path $appPrivacyPath -Name "LetAppsRunInBackground_ForceAllowTheseApps" -ErrorAction Stop
    Remove-ItemProperty -Path $appPrivacyPath -Name "LetAppsRunInBackground_ForceDenyTheseApps" -ErrorAction Stop

    Write-Output "Background applications enabled successfully."
}
catch {
    Write-Error "Failed to enable background applications: $_"
}
