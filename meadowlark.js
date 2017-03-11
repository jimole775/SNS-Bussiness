var exp = require("express");
var app = exp();
app.set("port",process.env.PORT || 3000);

app.use(function(req,res){
	res.type("text/plain");
	res.status(404);
	res.send('404 - not found');

});
app.use(function(err,req,res,next){
	console.log(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - server error');
})

app.listen(app.get('port'),function(){
	console.log('express started on http://localhost:'+app.get('port')+';press Ctrl-C to termainate');

});

