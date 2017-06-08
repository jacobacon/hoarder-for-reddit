//Node app for saving reddit content from user account.
//Copyright Jacob Beneski 2017


// 1) Create reddit helper object
// 2) Get saved content in a promise
// 3) Filter promise for wanted data
// 4) Export filtered data to desired format

const snoowrap = require('snoowrap');
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .alias('l', 'limit')
    .describe('l', 'How far back to go in history.')
    .alias('f', 'format')
    .describe('f', 'Format of file to output.')
    .choices('f', ['csv','json','txt','html','excel'])
    .default('f', 'csv')
    .alias('o', 'output')
    .describe('o', 'Choose the output location of the file')
    .default('o', __dirname)
    .argv;



var config = require('./config');
var fh = require('./filehelper');

var Post = require('./Post.js');

var post = new Post('hello', 'world');

var output = '';


const reddit = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: config.refreshToken
});


if(!argv.limit) {
    console.log('Going Back with No Limit');
    reddit.getMe().getSavedContent({limit: Infinity, depth: Infinity}).then(function (saved) {
        processSaved(saved);

    });
} else {
    console.log('Limit in place of: ', argv.limit);
    reddit.getMe().getSavedContent({limit: argv.limit, depth: argv.limit}).then(function (saved) {
       processSaved(saved);
    });
}




function processSaved(saved){

    console.log('Found ', saved.length, 'saved items');
    for(var i = 0; i < saved.length; i++){

        var line = [];

        line.push(saved[i].url);
        line.push(saved[i].title);

        fh.buildFile(line);
    }

    console.log('Built File');


    console.log('Post has value: ' , post.title, ' -- ', post.url);

    console.log(post.getPost());

    switch(argv.format) {
        case 'csv':
            console.log('Wrote CSV');
            break;
        case 'json':
            console.log('Wrote JSON');
            break;
        case 'txt':
            console.log('Wrote TXT');
            break;
        case 'html':
            console.log('Wrote HTML');
            break;
        case 'excel':
            console.log('Wrote Excel File');
            break;
    };



    fh.writeFile(argv.output, argv.name);

}

