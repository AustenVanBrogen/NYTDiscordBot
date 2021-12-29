const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const fs = require('fs');

const http = new XMLHttpRequest();
let date = new Date();
const key = fs.readFileSync('keys/nytApiKey.txt', 'utf8'); 
let apiURL;
let mostRecentArticleTitle;
let millisecondsPerSecond = 1000;
let secondsToWait = 30;

//Read the file syncronously to avoid problems
//Also, need to specify utf8 to get a string instead of a buffer of ascii integers

//access(apiURL);
timerFunction();
function timerFunction()
{
    access(apiURL);
    setTimeout(() =>{
        timerFunction();
    },secondsToWait * millisecondsPerSecond);
}


function access(url)
{
    let article;
    let articleTitle;
    let articleURL;
    let mostRecentArticleTitleOnEntry = mostRecentArticleTitle;
    let month = date.getMonth()+1; //1 indexing
    let year = date.getFullYear();
    apiURL = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${key}`;

    http.open("GET", apiURL);

    http.onload=(e)=>{
        try
        {
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
            
            if(mostRecentArticleTitle == null && articleTitle != null)
            {
                console.log(`Set initial value: ${articleTitle}`);
                mostRecentArticleTitle = articleTitle;
            }
            else if(articleTitle !== mostRecentArticleTitle && articleTitle === mostRecentArticleTitleOnEntry)
            {
                mostRecentArticleTitle = articleTitle;
                console.log('The New York Times have done it again!');
                console.log(articleTitle);
                console.log(articleURL);
            }
            else{

            }
        }
        catch(error)
        {
            console.log("There was an error");
        }
    }
    http.send();
}
