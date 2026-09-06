// NAME: Click Particles
// DESCRIPTION: Creates configurable particle bursts whenever you left-click in Spotify.
// AUTHOR: Local

(async function clickParticles() {
    const STYLE_ID = "click-particles-style";
    const LAYER_ID = "click-particles-layer";
    const MENU_BUTTON_ID = "click-particles-settings-button";
    const MENU_ID = "click-particles-settings";
    const SETTINGS_KEY = "click-particles-settings";
    const defaults = { enabled: true, count: 14, lifetime: 2800, palette: "theme" };
    let settings = loadSettings();

    function loadSettings() {
        try {
            return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
        } catch {
            return { ...defaults };
        }
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    while (!document.body) await new Promise(resolve => setTimeout(resolve, 50));
    if (document.getElementById(LAYER_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
        #${LAYER_ID} { position: fixed; z-index: 2147483647; inset: 0; pointer-events: none; overflow: hidden; }
        .click-particle {
            position: fixed; width: var(--particle-size); height: var(--particle-size);
            left: var(--particle-x); top: var(--particle-y); border-radius: 50%;
            background: var(--particle-colour); box-shadow: 0 0 10px var(--particle-colour);
            transform: translate(-50%, -50%);
            animation: click-particle-burst var(--particle-lifetime) cubic-bezier(.12,.7,.25,1) forwards;
        }
        @keyframes click-particle-burst {
            from { opacity: .95; transform: translate(-50%, -50%) scale(1); }
            18% { opacity: 1; transform: translate(calc(-50% + var(--particle-dx)), calc(-50% + var(--particle-dy))) scale(.9); }
            to { opacity: 0; transform: translate(calc(-50% + var(--particle-dx)), calc(-50% + var(--particle-dy))) scale(.35); }
        }
        #${MENU_BUTTON_ID} {
            position: fixed; z-index: 1001; top: 76px; right: 18px; width: 34px; height: 34px;
            border: 0; border-radius: 50%; color: var(--spice-text, #fff); background: var(--spice-card, #282828);
            box-shadow: 0 4px 12px rgba(0,0,0,.35); cursor: pointer; font-size: 17px;
        }
        #${MENU_BUTTON_ID}:hover, #${MENU_BUTTON_ID}:focus-visible { background: var(--spice-button, #1db954); outline: none; }
        #${MENU_ID} {
            position: fixed; z-index: 1001; top: 118px; right: 18px; width: 264px; box-sizing: border-box;
            padding: 16px; border: 1px solid rgba(255,255,255,.12); border-radius: 12px;
            background: var(--spice-sidebar, #121212); color: var(--spice-text, #fff);
            box-shadow: 0 12px 32px rgba(0,0,0,.45); font: 13px/1.35 system-ui, sans-serif;
        }
        #${MENU_ID}[hidden] { display: none; }
        #${MENU_ID} h2 { margin: 0 0 14px; font-size: 15px; }
        #${MENU_ID} label { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 12px 0; }
        #${MENU_ID} input[type="range"] { width: 142px; accent-color: var(--spice-button, #1db954); }
        #${MENU_ID} select { width: 142px; padding: 5px 7px; border: 0; border-radius: 5px; color: var(--spice-text, #fff); background: var(--spice-main, #282828); }
        #${MENU_ID} .click-particles-value { min-width: 42px; color: var(--spice-subtext, #b3b3b3); text-align: right; }
        #${MENU_ID} .click-particles-footer { margin: 14px 0 0; color: var(--spice-subtext, #b3b3b3); font-size: 11px; }
        @media (prefers-reduced-motion: reduce) { .click-particle { display: none; } }
    `;
    document.head.appendChild(style);

    const layer = document.createElement("div");
    layer.id = LAYER_ID;
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const menuButton = document.createElement("button");
    menuButton.id = MENU_BUTTON_ID;
    menuButton.type = "button";
    menuButton.textContent = "✦";
    menuButton.title = "Click particle settings";
    menuButton.setAttribute("aria-label", "Open click particle settings");
    document.body.appendChild(menuButton);

    const menu = document.createElement("section");
    menu.id = MENU_ID;
    menu.hidden = true;
    menu.setAttribute("aria-label", "Click particle settings");
    menu.innerHTML = `
        <h2>Click particles</h2>
        <label><span>Enabled</span><input id="click-particles-enabled" type="checkbox"></label>
        <label><span>Amount</span><input id="click-particles-count" type="range" min="4" max="30" step="1"><output class="click-particles-value" id="click-particles-count-value"></output></label>
        <label><span>Lifetime</span><input id="click-particles-lifetime" type="range" min="300" max="5000" step="100"><output class="click-particles-value" id="click-particles-lifetime-value"></output></label>
        <label><span>Colours</span><select id="click-particles-palette"><option value="theme">Spotify theme</option><option value="rainbow">Rainbow</option><option value="blue">Ice blue</option></select></label>
        <p class="click-particles-footer">Settings save automatically.</p>
    `;
    document.body.appendChild(menu);

    const controls = {
        enabled: menu.querySelector("#click-particles-enabled"),
        count: menu.querySelector("#click-particles-count"),
        countValue: menu.querySelector("#click-particles-count-value"),
        lifetime: menu.querySelector("#click-particles-lifetime"),
        lifetimeValue: menu.querySelector("#click-particles-lifetime-value"),
        palette: menu.querySelector("#click-particles-palette"),
    };

    function syncMenu() {
        controls.enabled.checked = settings.enabled;
        controls.count.value = String(settings.count);
        controls.countValue.textContent = String(settings.count);
        controls.lifetime.value = String(settings.lifetime);
        controls.lifetimeValue.textContent = `${(settings.lifetime / 1000).toFixed(1)}s`;
        controls.palette.value = settings.palette;
    }

    menuButton.addEventListener("click", () => {
        menu.hidden = !menu.hidden;
        if (!menu.hidden) syncMenu();
    });
    controls.enabled.addEventListener("change", () => { settings.enabled = controls.enabled.checked; saveSettings(); });
    controls.count.addEventListener("input", () => { settings.count = Number(controls.count.value); syncMenu(); saveSettings(); });
    controls.lifetime.addEventListener("input", () => { settings.lifetime = Number(controls.lifetime.value); syncMenu(); saveSettings(); });
    controls.palette.addEventListener("change", () => { settings.palette = controls.palette.value; saveSettings(); });

    function colours() {
        if (settings.palette === "rainbow") return ["#ff5c8a", "#ffb347", "#ffef6e", "#68e2a0", "#6bc5ff", "#b790ff"];
        if (settings.palette === "blue") return ["#e0f6ff", "#89dcff", "#4da8ff", "#9bbcff"];
        return ["var(--spice-button, #1db954)", "var(--spice-button-active, #1ed760)", "var(--spice-text, #ffffff)"];
    }

    function burst(x, y) {
        if (!settings.enabled) return;
        const particleColours = colours();
        for (let index = 0; index < settings.count; index += 1) {
            const angle = (Math.PI * 2 * index / settings.count) + (Math.random() - .5) * .35;
            const distance = 22 + Math.random() * 48;
            const particle = document.createElement("i");
            particle.className = "click-particle";
            particle.style.setProperty("--particle-x", `${x}px`);
            particle.style.setProperty("--particle-y", `${y}px`);
            particle.style.setProperty("--particle-dx", `${Math.cos(angle) * distance}px`);
            particle.style.setProperty("--particle-dy", `${Math.sin(angle) * distance}px`);
            particle.style.setProperty("--particle-size", `${3 + Math.random() * 5}px`);
            particle.style.setProperty("--particle-colour", particleColours[index % particleColours.length]);
            particle.style.setProperty("--particle-lifetime", `${settings.lifetime}ms`);
            layer.appendChild(particle);
            particle.addEventListener("animationend", () => particle.remove(), { once: true });
        }
    }

    document.addEventListener("pointerdown", event => {
        if (event.button === 0 && event.isPrimary && !menu.contains(event.target) && event.target !== menuButton) {
            burst(event.clientX, event.clientY);
        }
    }, true);
})();
