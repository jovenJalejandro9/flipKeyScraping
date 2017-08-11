var request = require('request');
var cheerio = require('cheerio');
//importar csv
var json2csv = require('json2csv');
var fs = require('fs');
var secId  = 10;

var appendThis = [
    {
        linkHouse: '100',
        linkHouse: 'myName1'
    },
    {
        linkHouse: '100',
        linkHouse: 'myName1'
    }
];


request('https://www.flipkey.com/frontdesk/view/'+secId+'/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    var nameCSV="lista.csv";
    var listElements=[];
    var fields =['linkHouse','nameHouse'];

    const lis =  $("div.property-photo-summary").get();
    var cont = 0;

    
    lis.forEach(function(div){
        const $li = $(div);
        //with trim() we remove the white spaces and the /n
        const linkHouse = "https://www.flipkey.com" + $(div).attr('data-href'); 
        const nameHouse = $(div).find('h3.title').first().text();


        cont++;

                   //console.log("\n\n"+cont)

        
       
        listElements.push({
           linkHouse : linkHouse,
           nameHouse : nameHouse
        });


        //Each house
        request(linkHouse, function (error, response, html) {
          if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
// aqui no puedo meter mas datos en list elements

           // console.log(listElements[0]);
        //listElements[0].hola=2;

           



          }
        });
    });
    console.log(listElements);
    
    var csv = json2csv({ data: listElements, fields: fields });
     
    fs.writeFile(nameCSV, csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
    



  }
});

