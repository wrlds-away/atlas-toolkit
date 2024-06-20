# PowerShell script to detect background apps status

# Function to check if a registry value exists and matches a specific data
function Test-RegistryValue {
    param (
        [Parameter(Mandatory=$true)]
        [string]$KeyPath,
        [Parameter(Mandatory=$true)]
        [string]$ValueName,
        [Parameter(Mandatory=$true)]
        [string]$ExpectedValue
    )

    try {
        $value = (Get-ItemProperty -Path $KeyPath -Name $ValueName).$ValueName
        if ($value -eq $ExpectedValue) {
            return $true
        }
        else {
            return $false
        }
    }
    catch {
        return $false
    }
}

# Define registry paths and expected values
$bgAppsKeyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"
$searchKeyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Search"
$appPrivacyKeyPath = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy"

$bgAppsValueName = "GlobalUserDisabled"
$searchValueName = "BackgroundAppGlobalToggle"
$appPrivacyValueName = "LetAppsRunInBackground"

$bgAppsExpectedValue = 1  # Expected value for GlobalUserDisabled
$searchExpectedValue = 0  # Expected value for BackgroundAppGlobalToggle
$appPrivacyExpectedValue = 2  # Expected value for LetAppsRunInBackground

# Check if all registry values exist and match expected values
$bgAppsValueCorrect = Test-RegistryValue -KeyPath $bgAppsKeyPath -ValueName $bgAppsValueName -ExpectedValue $bgAppsExpectedValue
$searchValueCorrect = Test-RegistryValue -KeyPath $searchKeyPath -ValueName $searchValueName -ExpectedValue $searchExpectedValue
$appPrivacyValueCorrect = Test-RegistryValue -KeyPath $appPrivacyKeyPath -ValueName $appPrivacyValueName -ExpectedValue $appPrivacyExpectedValue

# Determine background apps status
if ($bgAppsValueCorrect -and $searchValueCorrect -and $appPrivacyValueCorrect) {
    Write-Output "Off"  # All keys exist and have correct values, background apps are off
}
else {
    Write-Output "On"   # At least one key is missing or has incorrect value, background apps are on
}
