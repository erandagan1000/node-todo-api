//remote libs
var express= require('express');
var bodyParser = require('body-parser');

//local libs
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req, res) => {
    var todo= new Todo({
        text:req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
        res.status(200);
    }, (e) => res.send(e));

});

app.listen(3000, () => console.log('listening on port 3000'));

