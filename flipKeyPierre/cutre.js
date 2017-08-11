
function extracLinks(url,callback){

	request(url, function (error, response, html){

		if (!error && response.statusCode == 200) {
	 		var $ = cheerio.load(html);
	    var listUrls=[];

    	const lis =  $("div.property-photo-summary").get();


	    lis.forEach(function(div){
	    	const $li = $(div);
	    	listUrls.push("https://www.flipkey.com" + $(div).attr('data-href'));
	    })
	    callback(listUrls);
		}
	})
}

function extracDetails(url, callback){
	request(url, function (error, response, html) {

		if (!error && response.statusCode == 200) {
		    var $ = cheerio.load(html);
		    //var nameCSV="lista.csv";
		    var details={};

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
		        
		        details. name = name;
		       //details.numReviews = numReviews;
		        details.overallRating = overallRating;
		        details.responseRate = responseRate;
		        details.responseTime = responseTime;
		        details.revBased = revBased;
		        details.numProierties = numProierties;
		        details.url = url;
		        details.location = location;
		        details.pID = pID;

		        /*
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
		        });*/
		  }

		  callback(details);
	
	})
}

function saveResult(details){

	// CSV fields
	var fields =['name','overallRating','responseRate','responseTime','revBased','numProierties','url','location','pID'];
	
	var newLine= "\r\n";

	console.log(details)


	fs.stat('file.csv', function (err, stat) {
	    if (err == null) {
	        console.log('File exists');
	        var toCsv = { data: details, fields: fields, hasCSVColumnTitle: false };

	        //write the actual data and end with newline
	        var csv = json2csv(toCsv) + newLine;

	        fs.appendFile('file.csv', csv, function (err) {
	            if (err) throw err;
	            console.log('The "data to append" was appended to file!');
	   	        details.splice(0,details.length);	

	        });
	    }
	    else {
	        //write the headers and newline
	        console.log('New file, just writing headers');
	        var toCsv = { data: details, fields: fields};
	        var csv = json2csv(toCsv);
	        //fields= (fields + newLine);

	        fs.writeFile('file.csv', csv, function (err) {
	            if (err) throw err;
	            console.log('file saved');
	            details.splice(0,details.length);	

	        });
	    }
	});

}


var request = require('request');
var cheerio = require('cheerio');
//importar csv
var json2csv = require('json2csv');
var fs = require('fs');
var secId  = 0,maxID = 200;

//Delete csv
fs.stat('file.csv', function (err, stats) {
   console.log(stats);//here we got all information of file in stats variable
   if (err) {
       return console.error(err);
   }

   fs.unlink('file.csv',function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });  
});

	
var urlPending = 0;
for(i =secId; i <= maxID ; i++){
	var firstUrl = 'https://www.flipkey.com/frontdesk/view/'+i+'/';
	for(j = 1;j < 6;j++){
		if(j != 1){
			firstUrl = 'https://www.flipkey.com/frontdesk/view/'+i+'//?frontdesk-id='+i+'&page='+j;
		}
		//console.log("id: "+i+", pestaña: "+j);
		extracLinks(firstUrl, function(listUrls){
			//console.log(listUrls.length);
			urlPending +=listUrls.length;
			var pending = listUrls.length;

			listUrls.forEach(function(url){
				//console.log(url);
				listElements = [];
				extracDetails(url, function(details){
					listElements.push(details);

					//saveResult(details);	

					//console.log(pending)
					//console.log(details)
					//console.log(pending)
					if(--pending === 0){
						//console.log(pending)
						//console.log(urlPending)
						//if(urlPending == listElements.length){
							saveResult(listElements);
						//}
						

					}
				})
			})
		})
	}

}
