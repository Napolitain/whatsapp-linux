import {contextBridge} from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    notify: (title: string, body: string) => {
        new Notification(title, {body});
    }
});
