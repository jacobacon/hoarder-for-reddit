/**
 * Created by jacobbeneski on 9/30/17.
 */

const ipcRender = require('electron').ipcRenderer;
const React = require('react');
const ReactDOM = require('react-dom');
ipcRender.on('set-comments', function (event, data) {

    console.log('Event Happened: ' + event);


    for (let i = 0; i < data.length; i++) {

        let table = document.getElementById('tab_logic');

        let length = table.rows.length;
        let row = table.insertRow(length);
        let subredditCell = row.insertCell(0);
        let titleCell = row.insertCell(1);
        let urlCell = row.insertCell(2);
        subredditCell.innerHTML = data[i].subreddit_name_prefixed;
        titleCell.innerHTML = data[i].title;
        urlCell.innerHTML = "<a href='" + data[i].url + "'> " + data[i].url + "</a>";

    }


});

function getContent () {
    ipcRender.send('get-comments');
    //$('.titleColumn').setBackgroundColor('green');
    //TODO make a loading screen show.

}

function exportContent(){
    ipcRender.send('export-content');
}

function showSettings(){
    ipcRender.send('show-settings');
}

function logout () {
    ipcRender.send('logout');
}

function downloadImages() {
    ipcRender.send('download-images');
}

