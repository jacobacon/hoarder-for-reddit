//Node app for saving reddit content from user account.
//Copyright Jacob Beneski 2017


// 1) Create reddit helper object
// 2) Get saved content in a promise
// 3) Filter promise for wanted data
// 4) Export filtered data to desired format

const snoowrap = require('snoowrap');
const fs = require('fs');

var config = require('./config');

var output = '';


const reddit = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken
});


reddit.getMe().getSavedContent({limit: Infinity, depth: Infinity}).then(function(saved) {

    console.log('Found ', saved.length, 'saved items');
    for(var i = 0; i < saved.length; i++){

        var line = [];

        line.push(saved[i].url);
        line.push(saved[i].title);

        buildFile(line);
    }

    console.log('Built File');

    writeFile();



});

function buildFile(input){

    for(i = 0; i < input.length; i++){
        output += input[i] +  " ";
    }

    output += "\r\n";
}

function writeFile(){

    fs.writeFile('output example.txt', output, function(err){
        if(err){
            console.error(err);
        } else {
            console.log('Wrote file');
        }


    });


}