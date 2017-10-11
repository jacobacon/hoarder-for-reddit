//Node app for saving reddit content from user account.
//Copyright Jacob Beneski 2017


// 1) Create reddit helper object
// 2) Get saved content in a promise
// 3) Filter promise for wanted data
// 4) Export filtered data to desired format

const {app, BrowserWindow} = require('electron');
const http = require('http');
const url = require('url');
const ipcMain = require('electron').ipcMain;
const request = require('request');
const snoowrap = require('snoowrap');
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .alias('l', 'limit')
    .alias('o', 'output')
    .alias('f', 'format')
    .choices('f', ['csv', 'json', 'txt', 'html', 'excel'])
    .alias('n', 'name')
    .alias('d', 'download')
    .describe('l', 'How far back to go in history.')
    .describe('o', 'Choose the output location of the file.')
    .describe('f', 'Format of file to output.')
    .describe('n', 'The name of the output file.')
    .describe('d', 'Download Images')
    .default('o', __dirname)
    .default('f', 'csv')
    .default('n', 'output')
    .argv;


//var config = require('./config');
const fh = require('./filehelper');


let mainWindow;

//Setup Reddit OAuth Variable
//TODO move reddit oauth to external module

const REDDIT_AUTH = 'https://www.reddit.com/api/v1/authorize.compact';
const CLIENT_ID = 'm1h0ltl6XNjJ3g';
const RESPONSE_TYPE = 'code';
let state = 'jacobacon-' + Math.floor(Math.random() * 10000);
const REDIRECT_URI = 'http://127.0.0.1:3000/auth/reddit/callback';
const DURATION = 'permanent';
const SCOPES = ['identity', 'edit', 'history', 'mysubreddits',
    'privatemessages', 'read', 'save'];


let authURL = REDDIT_AUTH + '?client_id=' + CLIENT_ID + '&response_type=' + RESPONSE_TYPE +
    '&state=' + state + '&redirect_uri=' + REDIRECT_URI + '&duration=' + DURATION + '&scope=' + SCOPES.join(' ');

let authToken;
let refreshToken;
let timeToExpire;

let authCode;
let callbackServer;

//End Variables

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        show: false
    });

    if (!authToken) {
        //Show Login
        showLogin();
    } else if (timeToExpire) {
        //Refresh Token
    } else {
        showApp();
        //Show App
    }
});

ipcMain.on('get-comments', function () {
    console.log('Getting Comments');

    getContent();
});


function showLogin() {
    mainWindow.loadURL(authURL);
    mainWindow.show();


    //Create a server for callback

    callbackServer = http.createServer(function (req, res) {
        console.log('Request:' + req.method + ' to ' + req.url);
        res.writeHead(200, 'OK');
        res.write('<h1>Recieved callback...</h1>');
        res.end();
        handleCallback(req.url);
    }).listen(3000);
    console.log('Ready on port 3000');

}


function handleCallback(resp) {
    console.log('We got: ' + resp);

    if (resp.includes('error')) {
        console.error('An Error Occured');
    }

    //console.log('State starts at: ' + resp.indexOf('state') + ' and code starts at: ' + resp.indexOf('code'));

    let returnState = resp.substring(28, 42);

    authCode = resp.substring(48);

    console.log('State: ' + returnState + ' code: ' + authCode);

    if (state != returnState) {
        console.error("Returned State Didn't Match Expected. Try to login again");

        //TODO Handle this Problem better
    } else {
        getAuthToken(function (err, auth, refresh) {

            if (err) {
                console.error(err);
            }
            //console.log(err, auth, refresh);

            console.log('Showing the app');

            authToken = auth;
            refreshToken = refresh;


            mainWindow.loadURL('file://' + __dirname + '/app/views/index.html');

            getContent();


            mainWindow.show();

            setTimeout(function () {
                mainWindow.webContents.send('comment');
            }, 3000);

        });
    }

    callbackServer.close();


}


function getAuthToken(callback) {
    let tokenURL = 'https://' + CLIENT_ID + '@www.reddit.com/api/v1/access_token';

    request.post(tokenURL, {
        form: {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: '',
            code: authCode,
            redirect_uri: REDIRECT_URI
        }, headers: {},
        json: true
    }, function (err, res, body) {
        // assert.equal(typeof body, 'object')
        if (err) {

            callback(err, null, null)
        } else if (body) {


            let string = JSON.stringify(body);
            let objectValue = JSON.parse(string);
            console.log('The Access token is: ' + objectValue['access_token']);


            let accessToken = objectValue['access_token'];
            let refreshToken = objectValue['refresh_token'];

            callback(null, accessToken, refreshToken);

        }
    })


}

/*
 function processJSON(stringValue) {
 let string = JSON.stringify(stringValue);
 let objectValue = JSON.parse(string);
 console.log('The Access token is: ' + objectValue['access_token']);


 let accessToken = objectValue['access_token'];
 let refreshToken = objectValue['refresh_token'];

 }

 */

/*



 const reddit = new snoowrap({
 userAgent: config.userAgent,
 clientId: config.clientId,
 clientSecret: config.clientSecret,
 refreshToken: config.refreshToken
 });


 if (!argv.limit) {
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

 */
//TODO Move to helper class
function getContent() {

    const reddit = new snoowrap({
        userAgent: 'reddit-downloader',
        clientId: CLIENT_ID,
        clientSecret: '',
        refreshToken: refreshToken,
        accessToken: authToken

    });

    let content;

    reddit.getMe().getSavedContent().then((comments) => {
        //console.log(comments);

        content = comments;


        //document.getElementById('content').innerHTML += ('starting ...');

    });


}


function processSaved(saved) {

    console.log('Found ', saved.length, 'saved items.');
    for (var i = 0; i < saved.length; i++) {

        var line = [];

        line.push(saved[i].title);
        line.push(saved[i].url);

        fh.buildArray(line);
    }

    console.log('Built Array');


    //console.log('Post has value: ' , post.title, ' -- ', post.url);

    //console.log(post.getPost());

    fh.writeFile(argv.output, argv.name, argv.format);

}

function showApp() {
    //TODO
}

