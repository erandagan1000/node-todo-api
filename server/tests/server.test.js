    const expect = require('expect');
    const request = require('supertest');
    const {ObjectID} = require('mongodb');

    const {app}  = require('./../server');
    const {Todo} = require('./../models/todo');


    const todos = [{
        _id: new ObjectID(),
        text:'1st todo'
        },
    {
        _id: new ObjectID(),
        text: '2nd todo',
        completed: true,
        completedAt:333
    }];

    //initialize todos
    beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
        }).then(() => done());

    });

    describe('POST /todos',() => {
        it('should create a new todo',(done) => {
            var text = 'test to do text';
            
            request(app) //the url we want to test
            .post('/todos') //the api we use
            .send({text})  //the data we send
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err){return done(err);}
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })

        });

        it('should not create todo with invalid data',(done) => {
            request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){ return done(err);}
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();

                }).catch((e) => done(e));
                

            })
        });

    });

    describe('GET /todos', () => {
        it('should get all todos', (done) => {
            request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);

            }).end(done)

        });

    });

    describe('GET /todos/:id', () => {
        it('should return todo doc', (done) => {
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);

            }).end(done)

        });

        it('should return 404 if todo not found', (done) => {
            var hexId = new ObjectID().toHexString();
            request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done)

        });

        it('should return 404 if for non ObjectId', (done) => {
            request(app)
            .get(`/todos/abc123`)
            .expect(404)
            .end(done)

        });

    });

    describe('PATCH /todos/:id', ()=> {
        it('should update the todo', (done) => {
            var hexId = todos[0]._id.toHexString();
            var text = 'this should be the new text';
            
            request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed:true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)

        });

        it('should clear completedAt when todo is not completed', (done) => {
            var hexId = todos[1]._id.toHexString();
            var text = 'this should be the new text';
            
            request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed:false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done)

        });


    });