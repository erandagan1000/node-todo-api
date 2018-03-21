const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim:true,
        minlength: 3,
        unique: true,
        validate: {
            validator: validator.isEmail,  
            message: '{VALUE} is not a valid email' 
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4
    },
    tokens:[{
        access:{
            type:String,
            required: true

        },
        token:{
            type:String,
            required: true
        }
    }]
});

//override method to override the default json that is sen to client
UserSchema.methods.toJSON = function(){
    var user =this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens.push({access, token});
    //user.tokens = user.tokens.concat([{access, token}]);  ///ifpush doesnt work
    return user.save().then(() => {
        return token;
    });
};

UserSchema.static.findByToken = function(token) {
    var User= this;
    var decoded;
    
    try {
        decoded = jwt.verify(token, 'abc123');
        User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        })

    } catch (e) {

    }

};

var User = mongoose.model('User',UserSchema);


module.exports = {User};