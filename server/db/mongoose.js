var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://test:test@ds219879.mlab.com:19879/todoapp');



module.exports = {mongoose};