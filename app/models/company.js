let mongoose = require('mongoose');

// company schema
let companySchema = mongoose.Schema({
        Account:{
            type: String,
            require: true
        },
        ETHAccount:{
            type: String,
            require: true
        },
        CompanyCode:{
            type: String,
            require: true
        },
        CompanyGroup:{
            type: String,
            require: true
        },
        TaxID:{
            type: String,
            require: true
        },
        NameThai:{
            type: String,
            require: true
        },
        NameEnglish:{
            type: String,
            require: true
        },
        BusinessType:{
            type: String,
            require: true
        },
        Address:{
            type: String,
            require: true
        },
        Building:{
            type: String,
            require: true
        },
        Soi:{
            type: String,
            require: true
        },
        Street:{
            type: String,
            require: true
        },
        Tumbol:{
            type: String,
            require: true
        },
        District:{
            type: String,
            require: true
        },
        Province:{
            type: String,
            require: true
        },
        ZipCode:{
            type: String,
            require: true
        },
        CompanyDocument:{
            type: String,
            require: true
        }
});

let Company = module.exports = mongoose.model('Company', companySchema);
