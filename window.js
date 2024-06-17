document.addEventListener('DOMContentLoaded', function () {
    const panelButtons = document.querySelectorAll('.panel-button');
    const contentSections = document.querySelectorAll('.content-section');
    const darkModeSwitch = document.getElementById('dark_mode-switch');
    const backgroundAppsSwitch = document.getElementById('background_apps-switch');

    // Function to update dark mode slider based on detection
    function updateDarkMode() {
        return window.electronAPI.runPowershellScript('.\\powershell\\detect-darkmode.ps1')
            .then((mode) => {
                console.log(`System mode detected: ${mode}`);
                if (mode.trim() === 'Dark') {
                    darkModeSwitch.checked = true;
                }
                else {
                    darkModeSwitch.checked = false;
                }
            })
            .catch((err) => {
                console.error(`Failed to detect system mode: ${err}`);
                // Handle error if needed
            });
    }

    // Function to update background apps slider based on detection
    function updateBackgroundApps() {
        return window.electronAPI.runPowershellScript('.\\powershell\\detect-bgapps.ps1')
            .then((status) => {
                console.log(`Background Apps status detected: ${status}`);
                if (status.trim() === 'Off') {
                    backgroundAppsSwitch.checked = true;
                }
                else {
                    backgroundAppsSwitch.checked = false;
                }
            })
            .catch((err) => {
                console.error(`Failed to detect background apps status: ${err}`);
                // Handle error if needed
            });
    }

    // Function to update context menu slider based on detection
    function updateContextMenu() {
        return window.electronAPI.runPowershellScript('.\\powershell\\detect-contextmenu.ps1')
            .then((context) => {
                console.log(`Context Menu detected: ${context}`);
                if (context.trim() === 'New') {
                    contextMenuSwitch.checked = true;
                }
                else {
                    contentMenuSwitch.checked = false;
                }
            })
            .catch((err) => {
                console.error(`Failed to detect context menu: ${err}`);
            });
    }

    // Update UI on initial load
    updateDarkMode()
        .then(() => updateContextMenu())
        .then(() => updateBackgroundApps())
        .then(() => {
            // Event listener for dark mode switch change
            darkModeSwitch.addEventListener('change', function () {
                console.log('Dark Mode Checkbox toggled');

                const isChecked = this.checked;
                const slider = this.nextElementSibling;
                slider.style.backgroundColor = isChecked ? '#00BCF2' : 'rgba(45, 45, 45, 0.125)';

                // Determine the PowerShell script to execute based on toggle state
                const scriptName = isChecked ? '.\\powershell\\set-darkmode.ps1' : '.\\powershell\\set-lightmode.ps1';

                // Execute the PowerShell script
                window.electronAPI.runPowershellScript(scriptName)
                    .catch((err) => {
                        console.error(`Failed to execute ${scriptName}: ${err}`);
                        // Handle error if needed
                    });
            });

            // Event listener for background apps switch change
            backgroundAppsSwitch.addEventListener('change', function () {
                console.log('Background Apps Checkbox toggled');

                const areBackgroundAppsEnabled = this.checked;
                // Determine the PowerShell script to execute based on toggle state
                const scriptName = areBackgroundAppsEnabled ? '.\\powershell\\backgroundapps-off.ps1' : '.\\powershell\\backgroundapps-on.ps1';

                // Execute the PowerShell script
                window.electronAPI.runPowershellScript(scriptName)
                    .catch((err) => {
                        console.error(`Failed to execute ${scriptName}: ${err}`);
                        // Handle error if needed
                    });
            });
        })
        .catch((err) => {
            console.error('Failed to initialize UI:', err);
            // Handle error if needed
        });

    // Function to handle panel button click events
    panelButtons.forEach(button => {
        button.addEventListener('click', () => {
            panelButtons.forEach(btn => {
                btn.classList.remove('selected', 'active');
            });

            button.classList.add('selected');

            setTimeout(() => {
                button.classList.remove('selected');
                button.classList.add('active');
            }, 200);

            contentSections.forEach(section => {
                section.classList.add('hidden');
            });

            const contentId = button.id.replace('-button', '-content');
            const contentToShow = document.getElementById(contentId);
            
            if (contentToShow) {
                contentToShow.classList.remove('hidden');
            }
        });
    });

    // Click the personalize button on start to show its content by default
    document.getElementById('personalization-button').click();
});
