const express = require('express'),
      http = require('http'),
	  app = express()
	  fs  = require('fs')
;
app.use(express.static(__dirname + '/public_html/'));

app.use(function(req, res, next){
	res.status(404);
	res.send(fs.readFileSync(__dirname + '/public_html/index.html', 'utf-8'));
});
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
console.log("Server running:" + port);