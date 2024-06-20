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

                updateSwitchStates();
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

                updateSwitchStates();
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

                updateSwitchStates();
            })
            .catch((err) => {
                console.error(`Failed to detect context menu: ${err}`);
            });
    }

    // Function to update on off text based on switch states
    function updateSwitchStates() {
        document.querySelectorAll('.switch input').forEach((checkbox) => {
            const onOffText = checkbox.closest('.option-controls').querySelector('.on-off-text');
            if (onOffText) {
                onOffText.textContent = checkbox.checked ? 'On' : 'Off';
            }
        });
    }

    // Update UI on initial load
    updateBackgroundApps()
        .then(() => updateDarkMode())
        .then(() => updateContextMenu())
        .then(() => {
            // Event listener for dark mode switch change
            darkModeSwitch.addEventListener('change', function () {
                console.log('Dark Mode Checkbox toggled');

                const darkModeEnabled = this.checked;
                // Determine the PowerShell script to execute based on toggle state
                const scriptName = darkModeEnabled ? '.\\powershell\\set-darkmode.ps1' : '.\\powershell\\set-lightmode.ps1';

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

                const backgroundAppsEnabled = this.checked;
                // Determine the PowerShell script to execute based on toggle state
                const scriptName = backgroundAppsEnabled ? '.\\powershell\\backgroundapps-off.ps1' : '.\\powershell\\backgroundapps-on.ps1';

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
    document.getElementById('system-button').click();

    document.querySelectorAll('.switch input').forEach((checkbox) => {
        checkbox.addEventListener('change', function () {
            const onOffText = this.closest('.option-controls').querySelector('.on-off-text');
            if (this.checked) {
                onOffText.textContent = 'On';
            } else {
                onOffText.textContent = 'Off';
            }
        });
    });

    // Function to handle keyboard events for the slider
    function handleSliderKeydown(event) {
        console.log(`Key pressed on slider: ${event.key}`); // Add logging
        if (event.key === ' ' || event.key === "Enter" || event.key === 'Spacebar') { // Check for space key
            event.preventDefault(); // Prevent default scroll behavior
            this.querySelector('input').click(); // Simulate click on space key press
        }
    }

    // Function to handle keyboard events for the clear button
    function handleButtonKeydown(event) {
        console.log(`Key pressed on clear button: ${event.key}`); // Add logging
        if (event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar') { // Check for space and enter keys
            event.preventDefault(); // Prevent default scroll behavior
            this.click(); // Simulate click on key press
        }
    }

    // Add event listeners to the slider-controls boxes
    document.querySelectorAll('.option-controls').forEach((controls) => {
        controls.addEventListener('keydown', handleSliderKeydown);
    });

    // Add event listeners to the clear buttons
    document.querySelectorAll('.clear-button').forEach((button) => {
        button.addEventListener('keydown', handleButtonKeydown);
    });

    // Add event listeners to all clickable elements to remove focus state on mouse click
    document.querySelectorAll('.clickable-element').forEach((element) => {
        element.addEventListener('click', (event) => {
            if (event.detail === 1) { // Check if the click event was triggered by a mouse click
                element.blur(); // Remove focus state from the clicked element
            }
        });
    });

});

// Arrow key logic

document.addEventListener('DOMContentLoaded', function () {
    const panelButtons = document.querySelectorAll('.panel-button');
    const contentSections = document.querySelectorAll('.content-section');
    const clickableElements = document.querySelectorAll('.clickable-element');
    const exitAppButton = document.getElementById('exit-app');

    // Focus the system button on start to show its content by default
    document.getElementById('system-button').click();

    // Function to handle keyboard navigation
    function handleKeyboardNavigation(event) {
        const currentElement = document.activeElement;

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            handleVerticalNavigation(event);
        } else if (event.key === 'ArrowRight') {
            handleRightArrowNavigation(currentElement);
        } else if (event.key === 'ArrowLeft') {
            handleLeftArrowNavigation(currentElement);
        }
    }

    // Function to handle vertical navigation between clickable elements
    function handleVerticalNavigation(event) {
        event.preventDefault(); // Prevent default arrow key behavior (like scrolling)

        const clickableElementsArray = Array.from(clickableElements);
        const currentIndex = clickableElementsArray.indexOf(document.activeElement);
        let nextIndex;

        if (event.key === 'ArrowUp') {
            nextIndex = currentIndex === 0 ? clickableElementsArray.length - 1 : currentIndex - 1;
        } else if (event.key === 'ArrowDown') {
            nextIndex = currentIndex === clickableElementsArray.length - 1 ? 0 : currentIndex + 1;
        }

        clickableElementsArray[nextIndex].focus();
    }

    // Function to handle right arrow navigation
    function handleRightArrowNavigation(currentElement) {
        if (currentElement.classList.contains('clickable-element')) {
            // Move focus to the currently visible content section and focus the top element
            const visibleContent = document.querySelector('.content-section:not(.hidden)');
            const firstFocusableElement = visibleContent.querySelector('[tabindex="0"]');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        }
    }

    // Function to handle left arrow navigation
    function handleLeftArrowNavigation(currentElement) {
        if (currentElement.classList.contains('clickable-element')) {
            // Place focus on the currently active vertical-panel button (excluding exit-app)
            panelButtons.forEach(button => {
                if (button.classList.contains('active') && button.id !== 'exit-app') {
                    button.focus();
                }
            });
        }
    }

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
});
