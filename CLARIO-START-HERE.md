# Clario for Windows

1. Extract the entire downloaded ZIP. Move the extracted folder to a permanent location.
2. Double-click **Launch-Clario.cmd**. Clario opens in its own Edge or Chrome app window; if neither is installed, your default browser opens.
3. For a desktop icon, double-click **Install-Clario-Shortcut.cmd** once. Then double-click **Clario** on the desktop whenever you need it.

No Node.js, Python, administrator privileges, account, or server setup is required. This is a browser-powered Windows launcher, not a native Snipping Tool replacement or an EXE installer. Windows PowerShell launches the browser and creates the optional shortcut; managed computers may block scripts.

## Capture and edit
Click **New capture** and select a screen, window, or tab in the browser's sharing dialog. Permission is required for every capture. Browser support or company policy may prevent capture; use **Win+Shift+S** and paste into Clario, or upload an image instead.
Add arrows, highlights, freehand marks, or text; drag a crop and click **Apply crop**; export a PNG before closing. Undo works with **Ctrl+Z**.

You can pin the desktop shortcut to Start through Windows. There is no global capture hotkey or background tray process.
Keep the extracted folder in place: moving/deleting it breaks the shortcut. Rerun setup after moving it. To remove the shortcut, delete the Clario desktop icon. No registry or system settings are changed.

Images remain in the current browser session; they are not uploaded by this launcher. Share copies a URL, not the image; share the exported PNG. Redo and persistent autosave are not implemented.
Internet access is only used for optional web fonts.

## Validation
The existing nine editor regression tests pass, including crop undo geometry and vertical arrow completion. JavaScript syntax is checked. Windows launch, PowerShell execution, shortcut creation, and capture permissions require a Windows device and have not been executed in the Linux build environment.
