Hooks.once("init", function() {
    console.log("Initializing custom theme selector...");

    // Define the color palettes
    const colorPalettes = {
        red: { primary: "#c00404", secondary: "#bd6a6a", tertiary: "#f5dbdb" },
        orange: { primary: "#ff5722", secondary: "#ff8a65", tertiary: "#ffccbc" },
        blue: { primary: "#007bff", secondary: "#69abf2", tertiary: "#bfdfff" },
        green: { primary: "#28a745", secondary: "#7ed396", tertiary: "#c3e6cb" },
        purple: { primary: "#6f42c1", secondary: "#a885d8", tertiary: "#dcbfdf" },
        yellow: { primary: "#ffc107", secondary: "#ffe083", tertiary: "#fff3cd" },
        teal: { primary: "#20c997", secondary: "#73d2cc", tertiary: "#b2f2e6" },
        pink: { primary: "#e83e8c", secondary: "#f496b1", tertiary: "#f8c6d9" },
        indigo: { primary: "#6610f2", secondary: "#9b7ede", tertiary: "#d1c4f6" },
        cyan: { primary: "#17a2b8", secondary: "#69c8d4", tertiary: "#bfedf2" },
        gray: { primary: "#6c757d", secondary: "#a5a5a5", tertiary: "#d6d6d6" },
        dark: { primary: "#343a40", secondary: "#5a6268", tertiary: "#8a9298" }
    };

    // Define available filters
    const filters = {
        none: "No Filter",
        crt: "crt",
        pip: "pip",
        // Add more filters as needed
    };

    // Register the mode selection setting
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

    // Register the color palette selection setting
    game.settings.register("custom-themes", "colorPalette", {
        name: "Color Palette",
        hint: "Select a color palette preset.",
        scope: "client",
        config: true,
        type: String,
        choices: {
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
        },
        default: "red",
        onChange: paletteKey => {
            let palette;
            if (paletteKey === "custom") {
                palette = "custom"; // Use a special marker or structure to indicate custom theme
            } else {
                palette = colorPalettes[paletteKey];
            }
        
            if (palette) {
                applyThemeColors(palette);
            }
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

    // Function to apply Theme colors / Custom Colors to CSS variables
    function applyThemeColors(palette) {
        let primaryColor = palette.primary,
            secondaryColor = palette.secondary,
            tertiaryColor = palette.tertiary;
    
    // If custom theme is selected, fetch and use custom colors
    if (palette === "custom") {
        primaryColor = game.settings.get("custom-themes", "customPrimary") || colorPalettes.red.primary;
        secondaryColor = game.settings.get("custom-themes", "customSecondary") || colorPalettes.red.secondary;
        tertiaryColor = game.settings.get("custom-themes", "customTertiary") || colorPalettes.red.tertiary;
    } else {
        primaryColor = palette.primary;
        secondaryColor = palette.secondary;
        tertiaryColor = palette.tertiary;
    }

    document.documentElement.style.setProperty('--Primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--tertiary-color', tertiaryColor);
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
        // Option 1: Directly applying styles via CSS files
        let link = document.createElement('link');
        link.id = 'ui-filter-style';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = `modules/custom-themes/styles/Filters/${selectedFilter}.css`;
        link.media = 'all';
        head.appendChild(link);
    
        // Option 2: Apply a CSS class to the overlay for styling (if your CSS is designed this way)
        // overlay.className = `filter-${selectedFilter}`; // Make sure these classes are defined in your CSS
    }
    

    Hooks.once("ready", function() {
        const selectedPaletteKey = game.settings.get("custom-themes", "colorPalette");
        // Apply Theme Colors
        let palette = colorPalettes[selectedPaletteKey];
        if (selectedPaletteKey === "custom") {
            palette = "custom";
        }
    
        applyThemeColors(palette || colorPalettes["red"]); // Fallback to red or another default
        // Apply Theme Mode
        const themeMode = game.settings.get("custom-themes", "themeMode");
        loadThemeMode(themeMode);

        // Apply the selected filter
        const selectedFilter = game.settings.get("custom-themes", "filterSelection");
        loadFilter(selectedFilter);

        const enableCustomBackground = game.settings.get("custom-themes", "enableCustomBackground");
        if (enableCustomBackground) {
            const customBackgroundColor = game.settings.get("custom-themes", "customBackgroundColor");
            document.documentElement.style.setProperty('--background-color', customBackgroundColor);
        }
    });
});