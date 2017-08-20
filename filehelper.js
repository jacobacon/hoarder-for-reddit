/**
 * Created by jacob on 6/5/2017.
 */

const fs = require('fs');


//Builds the output string line by line.
let output = [];
exports.buildArray = function (input)
{

    for (let i = 0; i < input.length; i++) {
        output.push(input[i]);
    }
    console.log("Here is the output of the array");
    console.log(output);
}


//Writes the file.
exports.writeFile = function (location, name, format) {


    console.log('You chose : ' + format + ' as your format');


    switch(format) {
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
            if (err){
                console.error(err);
            } else {
                console.log('Wrote file to: ', location + '\/output.json');
            }
        });
            console.log('Wrote JSON');
            break;
        case 'txt':
            fs.writeFile(location + '\/output.txt', output.join("/n"), function (err) {
               if(err){
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
                if(err){
                    console.error(err);
                } else{
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

    outputString += "<html>";
    outputString += "<table>";


    for(let i = 0; i < 5; i++){
        outputString += "<tr>";

        outputString += "<th>" + i + "</th>";
        outputString += "<th>" + i + "</th>";

        outputString += "</tr>";
    }



    outputString += "</table>";
    outputString += "</html>";

    return outputString;

}


