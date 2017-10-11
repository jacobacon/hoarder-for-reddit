/**
 * Created by jacobbeneski on 9/30/17.
 */

const ipcRender = require('electron').ipcRenderer;

document.getElementById('content').innerHTML = "Test";

ipcRender.on('comment', function () {
    document.getElementById('content').innerHTML += "Hello IPC";
    window.alert('Hello IPC');
});

function getContent() {
    ipcRender.send('get-comments');
}