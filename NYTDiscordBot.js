const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');
const async = require('async');

const http = new XMLHttpRequest();
let date = new Date();
const key = fs.readFileSync('keys/nytApiKey.txt', 'utf8'); 
let apiURL;
let mostRecentArticleTitle;
let millisecondsPerSecond = 1000;
let secondsToWait = 30;

//Read the file syncronously to avoid problems
//Also, need to specify utf8 to get a string instead of a buffer of ascii integers

const access = async function(url)
{
    let article;
    let articleTitle;
    let articleURL;
    let month = date.getMonth()+1; //1 indexing
    let year = date.getFullYear();
    apiURL = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${key}`;

    http.open("GET", apiURL, false);

    http.onload=(e)=>{
        //Makes the JSON string human-readable
        let resJson;
        try{
            resJson = JSON.parse(http.responseText);
        }
        catch(error)
        {
            console.log("The response wasn't a json");
            console.log(http.responseText);
            return;
        }

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
        
        if(mostRecentArticleTitle == null && articleTitle != null)
        {
            console.log(`Set initial value: ${articleTitle}`);
            mostRecentArticleTitle = articleTitle;
        }
        else if(articleTitle !== mostRecentArticleTitle)
        {
            mostRecentArticleTitle = articleTitle;
            console.log('The New York Times have done it again!');
            console.log(articleTitle);
            console.log(articleURL);
        }
        else{

        }
    }
    http.send();
}

const timerFunction = async function()
{
    await access(apiURL);
    setTimeout(() =>{
        try{
        timerFunction();
        }
        catch(error)
        {
            console.log("There was an error");
        }
    },secondsToWait * millisecondsPerSecond);
}

timerFunction();
