var mongoose = require('mongoose');
var Schema = mongoose.Schema({
    username:{
        type: String
    },
    password:{
        type: String
    },
    name:{
        type: String
    },
    email:{
        type: String
    }
});
var UserTB = module.exports = mongoose.model('UserTB',Schema);