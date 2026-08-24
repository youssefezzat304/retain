import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion')
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
