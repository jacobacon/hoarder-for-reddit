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
const level = require('level');
require('dotenv').config();

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .help('h')
    .alias('h', 'help')
    .alias('l', 'limit')
    .alias('o', 'output')
    .alias('f', 'format')
    .alias('g', 'gui')
    .choices('f', ['csv', 'json', 'txt', 'html', 'excel'])
    .alias('n', 'name')
    .alias('d', 'download')
    .describe('l', 'How far back to go in history.')
    .describe('o', 'Choose the output location of the file.')
    .describe('f', 'Format of file to output.')
    .describe('n', 'The name of the output file.')
    .describe('d', 'Download Images')
    .describe('g', 'Enable or Disable the GUI')
    .default('o', __dirname)
    .default('f', 'csv')
    .default('n', 'output')
    .default('g', true)
    .argv;


//var config = require('./config');
const fh = require('./filehelper');

//TODO Check if GUI should be enabled.


let mainWindow;

//Setup Reddit OAuth Variable
//TODO move reddit oauth to external module

const REDDIT_AUTH = 'https://www.reddit.com/api/v1/authorize.compact';
const CLIENT_ID = process.env.CLIENT_ID;
const RESPONSE_TYPE = 'code';
let state = 'jacobacon-' + Math.floor(Math.random() * 10000);
const REDIRECT_URI = 'http://127.0.0.1:3000/auth/reddit/callback';
const DURATION = 'permanent';
const SCOPES = ['identity', 'edit', 'history', 'mysubreddits',
    'privatemessages', 'read', 'save'];


let authURL = REDDIT_AUTH + '?client_id=' + CLIENT_ID + '&response_type=' + RESPONSE_TYPE +
    '&state=' + state + '&redirect_uri=' + REDIRECT_URI + '&duration=' + DURATION + '&scope=' + SCOPES.join(' ');

let accessToken;
let refreshToken;
let timeToExpire;

//Used to get an access token
let authCode;
let callbackServer;

let db = level(__dirname + '/.database');

//End Variables

//When the app is ready, check access token is valid. Redirect to reddit, refresh or redirect to the app.
app.on('ready', () => {

        //Load the Access Token From the Database
        db.get('accessToken', (err, access) => {




            //If it is not in DB, redirect the user to reddit login page.
            if (err) {
                console.error('No Valid Access Token, The User Needs to Provide Us Access' + '\n' + err);
                showLogin();
            } else {

                accessToken = access;


                db.get('refreshToken', (err, refresh) => {


                    if (err) {
                        console.error('No Refresh Token');
                    }

                    refreshToken = refresh;




                        if ((accessToken) && (refreshToken)) { //Access token and refresh token both exist.
                            showApp();
                        } else if (!refresh) { //Access Token is expired, refresh it.
                            //TODO Handle expired tokens.
                            console.log('No Refresh Token, you will need to login again in an hour.');
                            showApp();
                        }





                });


            }



        });


    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        show: false
    });

});

ipcMain.on('get-comments', () => {
    console.log('Getting Comments');

    getContent((err, data) => {

        if (err) {
            console.error(err);
        } else {
            mainWindow.webContents.send('set-comments', data);

            console.log(data);
        }

    });
});

ipcMain.on('logout', () => {
    console.log('Logging Out...');
    logout();
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
        //Handle the Callback URL
        handleCallback(req.url);
    }).listen(3000);
    console.log('Ready on port 3000');

}


function handleCallback(resp) {
    console.log('We got: ' + resp);

    if (resp.includes('error')) {
        console.error('An Error Occured');
    }

//TODO Change this to use correct URL parsing to prevent the code from being too short sometimes.
    let returnState = resp.substring(28, 42);


    authCode = resp.substring(48);

    console.log('State: ' + returnState + ' code: ' + authCode);

    if (state != returnState) {
        console.error("Returned State Didn't Match Expected. Try to login again");
        showLogin();

        //TODO Handle this Problem better
    } else {
        getAccessToken(function (err, access, refresh) {

            if (err) {
                console.error(err);
            }

            accessToken = access;
            refreshToken = refresh;
            timeToExpire = ((new Date).getTime() / 1000) + 3600;

            db.batch()
                .put('accessToken', access)
                .put('refreshToken', refresh)
                .put('expireTime', timeToExpire)
                .write((err) => {
                    console.error(err);
                });

            console.log('Stored Access Code in Database');

            console.log('Showing the app');


            console.log('Token Will Expire at: ' + timeToExpire);


            showApp();

        });
    }

    callbackServer.close();


}


function getAccessToken(callback) {
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
function getContent(callback) {

    const reddit = new snoowrap({
        userAgent: 'reddit-downloader',
        clientId: CLIENT_ID,
        clientSecret: '',
        refreshToken: refreshToken,
        accessToken: accessToken

    });

    let content;

    //Gets Saved Content from Reddit
    reddit.getMe().getSavedContent().then((savedContent) => {


        //console.log(savedContent);

        content = savedContent;
        console.log('Calling Callback');

        callback(null, content);


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

    mainWindow.loadURL('file://' + __dirname + '/app/views/index.html');


    getContent((err, data) => {
        if (err)
            console.error(err);
        else {

            mainWindow.webContents.send('set-comments', data);

        }
    });


    mainWindow.show();
}

function logout() {

    db.batch()
        .del('accessToken')
        .del('refreshToken')
        .del('expireTime')
        .write((err) => {
            if (err)
                console.error(err);
        });

    authCode = null;
    accessToken = null;
    refreshToken = null;
    timeToExpire = null;

    mainWindow.webContents.session.clearStorageData([], (data) => {
        console.log('Cleared Login Data');
    });

    showLogin();


}
