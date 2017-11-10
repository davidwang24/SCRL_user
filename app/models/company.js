let mongoose = require('mongoose');

// company schema
let companySchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let Company = module.exports = mongoose.model('Company', companySchema);
