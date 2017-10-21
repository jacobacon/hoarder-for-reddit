/**
 * Created by jacobbeneski on 9/30/17.
 */

const ipcRender = require('electron').ipcRenderer;


ipcRender.on('set-comments', function (event, data) {

    console.log('Event Happened: ' + event);

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