/**
 * Created by jacobbeneski on 9/30/17.
 */

const ipcRender = require('electron').ipcRenderer;

document.getElementById('content').innerHTML = "Test";
document.getElementById('titleColumn').innerHTML += "Hello World";
//$('#titleColumn')

ipcRender.on('comment',function (event, data) {
    document.getElementById('content').innerHTML += data;
});

ipcRender.on('set-comments', function (event, data) {

    for(let i =0; i < 5; i++){
        $('#titleColumn').append(data[i].title);
        $('#linkColumn').append(data[i].url);
        $('#subredditColumn').append(data[i].subreddit_name_prefixed);
    }


});

function getContent () {
    ipcRender.send('get-comments');
    //$('.titleColumn').setBackgroundColor('green');
    //TODO make a loading screen show.

}

function logout () {
    ipcRender.send('logout');
}