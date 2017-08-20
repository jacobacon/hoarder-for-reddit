/**
 * Created by jacobbeneski on 8/19/17.
 */
const Scraper = require('image-scraper');


var scraper = new Scraper("http://imgur.com/Yyttsg3");

console.log('Trying to scrape.');



scraper.scrape(function(image){



    //console.log(image.attributes);

    console.log(image.attributes.address);



    image.save();



});

