var ENV = process.env.NODE_ENV || 'development';

if(ENV ==='development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoApp';

} else if( ENV ==='test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI =  'mongodb://localhost:27017/TodoAppTest';
}
