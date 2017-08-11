var request = require('request');
var cheerio = require('cheerio');
//importar csv
var json2csv = require('json2csv');
var fs = require('fs');
var secId  = 10;


request('https://www.flipkey.com/frontdesk/view/'+secId+'/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    //var nameCSV="lista.csv";
    var listElements=[];
   // var fields =['srcNameCapital','dstNameCapital','conductorName','addressSRC','addressDST','priceTrip'];

    const lis = $('div.property-photo-summary').get();
    console.log(lis);

    var cont=0;
    
    lis.forEach(function(div){
        cont +=1;
        const $li = $(div);
        //with trim() we remove the white spaces and the /n
        const nameTitle = $li.find('div.property-rate').first().text(); 
       


        //  console.log(element)
       
        listElements.push({
            price:nameTitle            
        });
        //listElements.push({addressSRC:addressSRC});
        //listElements.push({addressDST:addressDST});




    });
    console.log(listElements);
    console.log(cont);
    /*
    var csv = json2csv({ data: listElements, fields: fields });
     
    fs.writeFile(nameCSV, csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
    */



  }
});