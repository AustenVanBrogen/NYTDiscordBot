const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

const http = new XMLHttpRequest();
//Read the file syncronously to avoid problems
//Also, need to specify utf8 to get a string instead of a buffer of ascii integers
let key = fs.readFileSync('keys/nytApiKey.txt', 'utf8'); 
const apiURL = 'https://api.nytimes.com/svc/archive/v1/2021/12.json?api-key='+key

http.open("GET", apiURL);
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