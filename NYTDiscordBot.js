const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

const http = new XMLHttpRequest();
let date = new Date();
let month = date.getMonth()+1; //1 indexing
let year = date.getFullYear();
let mostRecentArticleTitle;
let millisecondsPerSecond = 1000;
let secondsToWait = 60;

//Read the file syncronously to avoid problems
//Also, need to specify utf8 to get a string instead of a buffer of ascii integers
let key = fs.readFileSync('keys/nytApiKey.txt', 'utf8'); 
const apiURL = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${key}`;
access(apiURL);
// setTimeout(() =>{
//     access(apiURL)
//     }, secondsToWait * millisecondsPerSecond);

function access(url)
{
    let article;
    let articleTitle;
    let articleURL;
    let mostRecentArticleTitleOnEntry = mostRecentArticleTitle;
    http.open("GET", url);

    http.onload=(e)=>{
        //Makes the JSON string human-readable
        let resJson = JSON.parse(http.responseText);

        //Saves the response to a file called "NYTResponse.txt"
        // let resText = JSON.stringify(JSON.parse(http.responseText), null, 4);
        // fs.writeFile("NYTResponse.txt", resText, (error) =>{
        //     if(error)
        //     {
        //         console.log(error);
        //     }
        // });

        article = resJson.response.docs[resJson.response.docs.length-1];
        articleURL = article.web_url;
        articleTitle = article.headline.main;
        
        if(mostRecentArticleTitle == null)
        {
            console.log("Set initial value");
            mostRecentArticleTitle = articleTitle;
        }
        else if(articleTitle !== mostRecentArticleTitle && articleTitle !== mostRecentArticleTitleOnEntry)
        {
            mostRecentArticleTitle = articleTitle;
            console.log('The New York Times have done it again!');
            console.log(articleTitle);
            console.log(articleURL);
        }
        else{
            console.log("No update here");
        }
    }

    http.send();
}
