router.get('/', function(req, res) {
    var data = "none";
    var newData = "";
    parse(data , function( val ) {
         newData = val;
         console.log( "newData : " , newData );
         console.log( "this happens last" );
         // if you need to return anything, return it here. Do everything else you want to do inside this parse function.
         return res.sendStatus( 200 );
    } );
    console.log( "this happens first" );
});

function parse( out , callback ){
    url = 'http://www.XXXXXX.int/';
    out =  out || "Init value";
    request(url, out,  function(error, response, html){
        // don't you do anything with the error, response, html variables?
        console.log( "out : " , out);
        out ="ASDA";
        return callback( out ); //op1
   }) ;
}