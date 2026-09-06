# Spicetify-Particle-Effects-
This extension adds a small particle burst whenever you left-click in Spotify. Use the **✦** button near the upper-right corner of Spotify to change the effect's amount, lifetime, colours, or turn it off.

## Install

1. Open PowerShell in this `Particle Effects` folder.
2. Paste and run this command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\install.ps1
```

The installer copies `click-particles.js` to Spicetify's Extensions folder, enables it if necessary, and applies the change automatically. Restart Spotify when it finishes.

## Files

- `click-particles.js` — the extension.
- `install.ps1` — the one-command installer.
- `README.md` — this guide.
