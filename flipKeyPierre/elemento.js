var request = require('request');
var cheerio = require('cheerio');
//importar csv
var json2csv = require('json2csv');
var fs = require('fs');
var secId  = 10;
var url = "https://www.flipkey.com/manchester-vacation-rentals/p111/";

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    //var nameCSV="lista.csv";
    var listElements=[];


    


        //with trim() we remove the white spaces and the /n
        //const price = $('p#rental_price.large-black.rental_price').first().text().trim();
        const name = $('h1.hidden-pdp-mobile').first().text().trim();
//No se porque esta mal
        const numReviews = parseInt($('span#nav-review-count').text());
        const overallRating = $('li.owner-box-item').find('div.value').text();
        const responseRate = $('li.owner-box-item').find('span.value').eq(0).text();
        const responseTime = $('li.owner-box-item').find('span.value').eq(1).text();
        const revAndProp = $('span.property-count').text();
        const location =$('div#map_header').text().trim();

        var splitProp = revAndProp.split(" ");
        const revBased = splitProp[2];
        const numProierties = splitProp[5];


        var splitId = url.split("/");
        const pID = splitId[splitId.length-2];
        



        listElements.push({
         name : name,
         numReviews : numReviews,
         overallRating : overallRating,
         responseRate : responseRate,
          responseTime : responseTime,
          revBased : revBased,
          numProierties : numProierties,
          url : url,
          location : location,
          pID : pID
          
        });


    
    console.log(listElements);




  }
});

