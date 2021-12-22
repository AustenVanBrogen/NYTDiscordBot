const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

const http = new XMLHttpRequest();
let date = new Date();
let month = date.getMonth()+1; //1 indexing
let year = date.getFullYear();
//Read the file syncronously to avoid problems
//Also, need to specify utf8 to get a string instead of a buffer of ascii integers
let key = fs.readFileSync('keys/nytApiKey.txt', 'utf8'); 
const apiURL = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${key}`;
console.log(date.getFullYear());
access(apiURL);


function access(url)
{
    http.open("GET", url);
    http.send();

    http.onload=(e)=>{
        //Makes the JSON string human-readable
        let resText = JSON.stringify(JSON.parse(http.responseText), null, 4);
        //console.log(resText);
        fs.writeFile("NYTResponse.txt", resText, (error) =>{
            if(error)
            {
                console.log(error);
            }
        });
    }
}