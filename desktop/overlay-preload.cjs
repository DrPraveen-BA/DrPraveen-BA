const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('Overlay',Object.freeze({init:()=>ipcRenderer.invoke('overlay-init'),submit:value=>ipcRenderer.send('overlay-result',value),cancel:()=>ipcRenderer.send('overlay-result',null)}));
