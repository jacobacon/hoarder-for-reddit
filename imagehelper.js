/**
 * Created by jacobbeneski on 8/19/17.
 */

const download = require('image-downloader')

const options = {

    url: 'https://fat.gfycat.com/SpitefulFittingBongo.webm',
    dest: __dirname

};







download.image(options)
    .then(({ filename, image }) => {
        console.log('File saved to', filename)
    }).catch((err) => {
    throw err
});



exports.downloadImages = function(items, location){


    for(let i = 0; i < items.length; i++){

        if(items[i]);

    };
    

};
