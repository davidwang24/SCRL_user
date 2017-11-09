var mongoose = require('mongoose');
var User = mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        require: true
    },
    ethacc:{
        type: String,
        require: true
    }
});

var UserTB = module.exports = mongoose.model('UserTB',User);