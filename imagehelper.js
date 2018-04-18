/**
 * Created by jacobbeneski on 8/19/17.
 */

const download = require('image-downloader');

//Iterate through list from reddit
//Filter out comments
//Convert to direct links to images / albums
//Download each image to disk



exports.downloadImages = function (items, location) {


    for (let i = 0; i < items.length; i++) {
        let saveLocation;
        let imageURL;

        if(location)
            saveLocation = location;
        else
            saveLocation = __dirname;

        let options = {

            url: items[i],
            dest: saveLocation

        };

        download.image(options)
            .then(({filename, image}) => {
                console.log('File saved to', filename);
            }).catch((err) => {
            throw err
        });


    }
};
