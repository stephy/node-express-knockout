var express = require('express'),
  app = express();

/*
	Fake DB
	arrays used as db just for purposes of demonstration
	real dbs need to be used in real projects :)
*/
var db = [];

var Expense = function(name, time){
  this.desc = name;
  this.time = time;
}

//initialize db with some expenses
db.push(new Expense('phone call', 0.2));
db.push(new Expense('writing', 0.6));
db.push(new Expense('reading', 0.9));

app.use(express.json());
app.use(express.urlencoded());

app.get("/api/expenses/", function(req, res){
  res.json(200, db);
});

app.post("/api/expenses/", function(req, res){
  console.log('req', req.body);
  db.push(new Expense(req.body.desc, req.body.time));
  res.json(200, db[db.length-1]);
  res.end();
  
});


app.configure(function(){
  app.use(express.static(__dirname));
});
//start listening on port 3000
app.listen(3000);