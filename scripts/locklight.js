/**
 * Override the theme on an element to always use the light theme.
 * @param {HTMLElement} element  Body or sheet element on which to set the theme data.
 */
function enforceLightTheme(element) {
  // Remove any existing dnd5e theme or flag classes
  element.className = element.className.replace(/\bdnd5e-(theme|flag)-[\w-]+\b/g, "");

  // Force the theme to light
  const theme = "light";
  element.classList.add(`dnd5e-theme-${theme}`);
  element.dataset.theme = theme;

  // Optionally clear theme flags if not needed
  element.dataset.themeFlags = "";
}

// Call this function with document.body to enforce the light theme on the entire page
Hooks.once("ready", function() {
  enforceLightTheme(document.body);
});
