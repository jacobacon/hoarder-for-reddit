/**
 * Created by jacob on 6/5/2017.
 */

const fs = require('fs');


//Builds the output string line by line.
let output = [];
exports.buildArray = function (input) {

    for (let i = 0; i < input.length; i++) {
        output.push(input[i]);
    }
};


//Writes the file.
exports.writeFile = function (location, name, format) {


    console.log('You chose : ' + format + ' as your format');


    switch (format) {
        case 'csv':
            fs.writeFile(location + '\/output.csv', output.join(', '), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Wrote file to: ', location + '\/output.csv');
                }
            });
            break;
        case 'json':
            fs.writeFile(location + '\/output.json', JSON.stringify(output), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Wrote file to: ', location + '\/output.json');
                }
            });
            console.log('Wrote JSON');
            break;
        case 'txt':
            fs.writeFile(location + '\/output.txt', output.join("\/n"), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Wrote file to: ', location + '\/output.txt');
                }
            });
            console.log('Wrote TXT');
            break;
        case 'html':
            console.log('Wrote HTML');
            fs.writeFile(location + '\/output.html', builtHtml(), function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Wrote file to: ', location + '\/output.html');
                }

            });
            break;
        case 'excel':
            console.log('Wrote Excel File');
            break;
    }

};


function builtHtml() {
    let outputString = "";


    outputString += "<style type='text/css'>.tg  {border-collapse:collapse;border-spacing:0;margin:0px auto;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-yw4l{vertical-align:top} </style>";
    outputString += "<html>";
    outputString += "<table>";


    for (let i = 0; i < output.length; i += 2) {
        outputString += "<tr>";

        outputString += "<th>" + output[i] + "</th>";
        outputString += "<th>" + '<a href="' + output[i + 1] + '"> ' + output[i + 1] + '</a></th>';

        outputString += "</tr>";
    }


    outputString += "</table>";
    outputString += "</html>";

    return outputString;

}


