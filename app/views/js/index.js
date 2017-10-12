/**
 * Created by jacobbeneski on 9/30/17.
 */

const ipcRender = require('electron').ipcRenderer;

document.getElementById('content').innerHTML = "Test";

ipcRender.on('comment',function (event, data) {
    document.getElementById('content').innerHTML += data;
});

function getContent() {
    ipcRender.send('get-comments');
}