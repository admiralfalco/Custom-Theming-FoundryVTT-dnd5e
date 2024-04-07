Hooks.once("init", function() {

    console.log("Initializing custom theme selector...");

    // Define available filters
    const filters = {
        none: "No Filter",
        crt: "crt",
        pip: "pip",
        // Add more filters as needed
    };

    // Define available colors
    const colors = {
        red: "Red",
        orange: "Orange",
        blue: "Blue",
        green: "Green",
        purple: "Purple",
        yellow: "Yellow",
        teal: "Teal",
        pink: "Pink",
        indigo: "Indigo",
        cyan: "Cyan",
        gray: "Gray",
        dark: "Dark",
        custom: "Custom"
    };

    function loadMainCSS() {
        const head = document.getElementsByTagName('head')[0];
        // Ensure existing theme mode style is fully removed
        let existingLink = document.getElementById('custom-themes-main-css');
        while (existingLink) {
            head.removeChild(existingLink);
            existingLink = document.getElementById('custom-themes-main-css'); // Check again in case of duplicates
        }
        let link = document.createElement('link');
        link.id = "custom-themes-main-css";
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "modules/custom-themes/styles/base.css"; // Update the path as necessary
        link.media = 'all';
        head.appendChild(link);
    }
    


    function saveGmThemeSettings() {
        const settingsToSave = {
            themeMode: game.settings.get("custom-themes", "themeMode"),
            colorPalette: game.settings.get("custom-themes", "colorPalette"),
            enableCustomBackground: game.settings.get("custom-themes", "enableCustomBackground"),
            customPrimary: game.settings.get("custom-themes", "customPrimary"),
            customSecondary: game.settings.get("custom-themes", "customSecondary"),
            customTertiary: game.settings.get("custom-themes", "customTertiary"),
            customBackgroundColor: game.settings.get("custom-themes", "customBackgroundColor"),
            filterSelection: game.settings.get("custom-themes", "filterSelection"),
            customCSS: game.settings.get("custom-themes", "customCSS"),
            // Add any other settings you need to save here
        };
        
        const serializedSettings = JSON.stringify(settingsToSave);
        game.settings.set("custom-themes", "gmThemeSettings", serializedSettings);
        ui.notifications.info(serializedSettings);
    }

    function applyGmThemeSettingsToAll() {
        if (game.settings.get("custom-themes", "themeLock")) {
            const serializedSettings = game.settings.get("custom-themes", "gmThemeSettings");
            if (!serializedSettings) {
                console.warn("GM theme settings not found.");
                return;
            }
    
            const themeSettings = JSON.parse(serializedSettings);
    
            // Apply the theme mode
            if(!game.user.isGM) {
                if (themeSettings.themeMode) {
                    loadThemeMode(themeSettings.themeMode);
                }
        
                // Apply the color palette
                if (themeSettings.colorPalette) {
                    applyThemeColors(themeSettings.colorPalette);
                }
        
                // Apply custom background color
                if (themeSettings.enableCustomBackground && themeSettings.customBackgroundColor) {
                    document.documentElement.style.setProperty('--background-color', themeSettings.customBackgroundColor);
                } else {
                    document.documentElement.style.removeProperty('--background-color');
                }
        
                // Apply custom primary, secondary, tertiary colors
                ['Primary', 'Secondary', 'Tertiary'].forEach(color => {
                    const customColor = themeSettings[`custom${color}`];
                    if (customColor) {
                        document.documentElement.style.setProperty(`--custom-${color.toLowerCase()}-color`, customColor);
                    }
                });
        
                // Apply UI filter
                if (themeSettings.filterSelection) {
                    loadFilter(themeSettings.filterSelection);
                }
        
                // Apply custom CSS
                if (themeSettings.customCSS) {
                    applyCustomCSS(themeSettings.customCSS);
                }
            }
            // Notify users
    
            // Note: If there are any additional settings or complex structures, 
            // you might need to expand this function further to handle those cases.
        }
    }``

    function disableAllThemeSettings() {
        if (game.user.isGM) {
            // Example actions to "unload" custom themes:
            
            // 1. Remove custom stylesheet links (if you add them dynamically)
            removeCustomStylesheets();
    
            // 2. Reset custom CSS properties to default or empty values
            document.documentElement.style.removeProperty('--Primary-color');
            document.documentElement.style.removeProperty('--secondary-color');
            document.documentElement.style.removeProperty('--tertiary-color');
            document.documentElement.style.removeProperty('--background-color');
            
            // 3. Clear any dynamically added <style> or <link> elements specific to your theme
            const customStyleElement = document.getElementById('theme-mode-style');
            if (customStyleElement) {
                customStyleElement.remove();
            }
    
            // 4. Optionally, reset specific settings to "none" or equivalent defaults
            // This is only necessary if you must store a value in the setting for it to be considered "default"
            const settingsToReset = {
                themeMode: "none", // Assuming "none" is a valid value indicating no theme
                enableCustomBackground: false, // Disabling custom background
                // Add other settings if needed
            };
    
            // Apply the resets
            for (const [setting, resetValue] of Object.entries(settingsToReset)) {
                game.settings.set("custom-themes", setting, resetValue);
            }
    
            // Notify GM of the change
        } else {
        }
    }
    
    function removeCustomStylesheets() {
        const themeModeStylesheet = document.getElementById('theme-mode-style');
        if (themeModeStylesheet) themeModeStylesheet.remove();
    
        const filterStylesheet = document.getElementById('ui-filter-style');
        if (filterStylesheet) filterStylesheet.remove();
    
        const mainStylesheet = document.getElementById('custom-themes-main-css');
        if (mainStylesheet) mainStylesheet.remove();
    
        // Continue this pattern for any other dynamically added stylesheets
    }

    function enableThemeSettings(loadMainCss = false) {
        // Optionally re-add the main.css if specified
        if (loadMainCss) {
            loadMainCSS(); // This function adds 'custom-themes-main-css' back
        }

        // Check and apply the theme mode setting
        const themeMode = game.settings.get("custom-themes", "themeMode");
        if (themeMode) { // You might want to check for a specific condition
            loadThemeMode(themeMode);
        }
    
        // Check and apply the color palette
        const colorPalette = game.settings.get("custom-themes", "colorPalette");
        if (colorPalette) { // Check if the color palette setting was previously enabled
            applyThemeColors(colorPalette);
        }
    
        // Reapply custom background if it was enabled
        const enableCustomBackground = game.settings.get("custom-themes", "enableCustomBackground");
        if (enableCustomBackground) {
            const customBackgroundColor = game.settings.get("custom-themes", "customBackgroundColor");
            // Apply the custom background color
            document.documentElement.style.setProperty('--background-color', customBackgroundColor);
        }
    
        // Check and reapply the filter selection
        const filterSelection = game.settings.get("custom-themes", "filterSelection");
        if (filterSelection) {
            loadFilter(filterSelection);
        }
    
        // Reapply custom CSS if it was previously added
        const customCSS = game.settings.get("custom-themes", "customCSS");
        if (customCSS) {
            applyCustomCSS(customCSS);
        }
    
        // Additional checks for other settings can be included here
    
    }


    // Register the Theme mode selection setting
    game.settings.register("custom-themes", "themeMode", {
        name: "Theme Mode",
        hint: "Select between Light and Dark mode.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            light: "Light",
            dark: "Dark"
        },
        default: "light",
        onChange: mode => {
            loadThemeMode(mode);
        }
    });

    //Function For Setting Theme Mode
    function loadThemeMode(selectedMode) {
        const head = document.getElementsByTagName('head')[0];
    
        // Ensure existing theme mode style is fully removed
        let existingLink = document.getElementById('theme-mode-style');
        while (existingLink) {
            head.removeChild(existingLink);
            existingLink = document.getElementById('theme-mode-style'); // Check again in case of duplicates
        }
    
        // Create and append the new theme's stylesheet
        let link = document.createElement('link');
        link.id = 'theme-mode-style';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `modules/custom-themes/styles/${selectedMode}-theme.css?time=${new Date().getTime()}`;
        link.media = 'all';
        head.appendChild(link);
    }

    //Register the Custom Background color Switch
    game.settings.register("custom-themes", "enableCustomBackground", {
        name: "Enable Custom Background Color",
        hint: "Enable or disable the use of a custom background color.",
        scope: "client",
        config: true,
        type: Boolean,
        default: false,
        onChange: enabled => {
            if (!enabled) {
                // If disabled, revert to the default background or theme-specific background
                document.documentElement.style.removeProperty('--background-color');
            } else {
                // If enabled, apply the custom background color if one is selected
                const customBackgroundColor = game.settings.get("custom-themes", "customBackgroundColor");
                if (customBackgroundColor) {
                    document.documentElement.style.setProperty('--background-color', customBackgroundColor);
                }
            }
        }
    });

    new window.Ardittristan.ColorSetting("custom-themes", "customBackgroundColor", {
        name: "Custom Background Color",
        hint: "Select a custom background color.",
        label: "Select Color",
        restricted: false,
        defaultColor: "#000000", // Default background color, can be set to something else
        scope: "client",
        onChange: value => {
            const enableCustomBackground = game.settings.get("custom-themes", "enableCustomBackground");
            if (enableCustomBackground) {
                document.documentElement.style.setProperty('--background-color', value);
            }
        }
    });



    game.settings.register("custom-themes", "colorPalette", {
        name: "Color Palette",
        hint: "Select a color palette preset.",
        scope: "client",
        config: true,
        type: String,
        choices: colors,
        default: "red",
        onChange: paletteKey => {
            applyThemeColors(paletteKey);
        }
    });


    // Register custom color settings using ColorSetting
    ['Primary', 'Secondary', 'Tertiary'].forEach(color => {
        new window.Ardittristan.ColorSetting("custom-themes", `custom${color}`, {
            name: `Custom ${color} Color`, // Display name in the settings
            hint: `Select a hex code for custom ${color.toLowerCase()} color.`,
            label: `Select ${color} Color`, // Text for the color picker button
            restricted: false, // Set to true if you want to restrict to GM only
            defaultColor: "#000000", // Default color, in hex format
            scope: "client", // Saves setting for individual user
            onChange: value => {
                console.log(`${color} color changed to: ${value}`);
                // Trigger theme re-application if needed
                const selectedPaletteKey = game.settings.get("custom-themes", "colorPalette");
                if(selectedPaletteKey === "custom") {
                    applyThemeColors("custom");
                }
            }
        });
    });

    function applyThemeColors(paletteKey) {
        const head = document.getElementsByTagName('head')[0];
    
        // Ensure the previous palette style is fully removed
        let existingPaletteLink = document.getElementById('palette-style');
        if (existingPaletteLink) {
            head.removeChild(existingPaletteLink);
        }
    
        if (paletteKey === "custom") {
            // Apply custom colors as before
            let primaryColor = game.settings.get("custom-themes", "customPrimary") || "#000000";
            let secondaryColor = game.settings.get("custom-themes", "customSecondary") || "#000000";
            let tertiaryColor = game.settings.get("custom-themes", "customTertiary") || "#000000";
    
            document.documentElement.style.setProperty('--primary-color', primaryColor);
            document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            document.documentElement.style.setProperty('--tertiary-color', tertiaryColor);
        } else {
            // Remove custom properties before loading a predefined palette
            document.documentElement.style.removeProperty('--primary-color');
            document.documentElement.style.removeProperty('--secondary-color');
            document.documentElement.style.removeProperty('--tertiary-color');
                
            // Load the corresponding CSS file for non-custom palettes
            let paletteLink = document.createElement('link');
            paletteLink.id = 'palette-style';
            paletteLink.rel = 'stylesheet';
            paletteLink.type = 'text/css';
            paletteLink.href = `modules/custom-themes/styles/colors/${paletteKey}.css`;
            paletteLink.media = 'all';
            head.appendChild(paletteLink);
        }
    }




    // Register UI Filter
    game.settings.register("custom-themes", "filterSelection", {
        name: "UI Filter",
        hint: "Select a filter to apply to the interface.",
        scope: "client",
        config: true,
        type: String,
        choices: filters,
        default: "none",
        onChange: filter => {
            loadFilter(filter);
        }
    });

    //Function to Activate and Control Filter
    function loadFilter(selectedFilter) {
        const head = document.getElementsByTagName('head')[0];
        let overlay = document.getElementById('ui-filter-overlay');
    
        // Ensure the overlay exists
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ui-filter-overlay';
            document.body.appendChild(overlay);
        }
    
        // Set overlay basic styles to cover the entire screen
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.pointerEvents = 'none'; // Allow clicks to pass through
        overlay.style.zIndex = '10000'; // Make sure it's on top
    
        // Remove any existing filter-specific stylesheet
        let existingLink = document.getElementById('ui-filter-style');
        if (existingLink) {
            head.removeChild(existingLink);
        }
    
        // If "none" is selected, clear the overlay and do not apply a new filter
        if (selectedFilter === "none") {
            overlay.style.display = 'none';
            return;
        } else {
            overlay.style.display = 'block';
        }
    
        // Apply the selected filter's CSS to the overlay
        let link = document.createElement('link');
        link.id = 'ui-filter-style';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `modules/custom-themes/styles/filters/${selectedFilter}.css`;
        link.media = 'all';
        head.appendChild(link);
    }    



    //Register CustomCSS 
    game.settings.register("custom-themes", "customCSS", {
        name: "Custom CSS",
        hint: "Enter your custom CSS here. It will be applied on top of the current theme. (Hint: Use Developer Console and a CSS Syntax Highlighter)",
        scope: "client",
        config: true,
        type: String,
        default: "",
        onChange: value => applyCustomCSS(value) // Apply the CSS when it changes
    });

    //Apply CustomCSS
    function applyCustomCSS(css) {
        let styleId = "user-custom-css";
        let styleElement = document.getElementById(styleId);
    
        // If the style element doesn't exist, create it
        if (!styleElement) {
            styleElement = document.createElement("style");
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }
    
        // Set the custom CSS
        styleElement.innerHTML = css;
    }    

    //Register GM Theme Lock
    game.settings.register("custom-themes", "themeLock", {
        name: "Theme Lock",
        hint: "Locks the theme settings for all non-GM users.",
        scope: "world", // This makes it a game-wide setting, not per-user.
        config: true, // Shows this in the settings menu.
        type: Boolean,
        default: false,
        restricted: true, // Only the GM can change this.
        onChange: value => {
            if (value) {
                // Save the current theme settings chosen by the GM
                saveGmThemeSettings();
                applyGmThemeSettingsToAll();
            }
            else {
                saveGmThemeSettings();
                enableThemeSettings();
            }

        }
    });
    

    // Register a "dummy" setting that acts as a button
    game.settings.register("custom-themes", "themeSettingsEnabled", {
        name: "Toggle Theme Settings",
        hint: "Enable or disable all theme settings. This action is immediate.",
        scope: "world",
        config: true,
        type: Boolean,
        default: true, // Assume enabled by default
        onChange: value => {
            if (game.user.isGM) {
                if (value) {
                    enableThemeSettings(true);
                } else {
                    disableAllThemeSettings();
                }
                // The setting itself remains as the indicator of the current state
            }
        }
    });

    // Other settings registration
    game.settings.register("custom-themes", "gmThemeSettings", {
        name: "GM Theme Settings",
        hint: "Serialized theme settings for GM control.",
        scope: "world",
        config: false, // This likely doesn't need to be visible to the user
        type: String,
        default: "{}", // Default to an empty JSON object
    });
 





    Hooks.once("ready", function() {
        if (game.settings.get("custom-themes", "themeSettingsEnabled")) {
            enableThemeSettings(true);
        };
    
        saveGmThemeSettings();
        applyGmThemeSettingsToAll();
    });
    Hooks.on("renderSettingsConfig", (app, html, data) => {
        // Check if the theme is locked and the current user is not the GM
        const themeLock = game.settings.get("custom-themes", "themeLock");
        if (themeLock && !game.user.isGM) {
            // Disable all theme-related settings inputs for non-GM users
            const settingsToDisable = ["themeMode", "enableCustomBackground", "colorPalette", "customPrimary", "customSecondary", "customTertiary", "customBackgroundColor", "filterSelection", "customCSS"]; // Add all the setting names you want to disable
            settingsToDisable.forEach(settingName => {
                const settingElement = html.find(`[name="custom-themes.${settingName}"]`);
                if (settingElement) {
                    settingElement.prop('disabled', true);
                }
            });
        }
    });
    
});






    
