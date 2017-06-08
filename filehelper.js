/**
 * Created by jacob on 6/5/2017.
 */

const fs = require('fs');


//Builds the output string line by line.
var output = '';
exports.buildFile = function (input)
{

    for (i = 0; i < input.length; i++) {
        output += input[i] + " ";
    }

    output += "\r\n";
}


//Writes the file.
exports.writeFile = function (location, name) {

    fs.writeFile(location + '\\output.txt', output, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Wrote file to: ', location + '\\output.txt');
        }


    });


}


