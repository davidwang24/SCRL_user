let mongoose = require('mongoose');

// invoice schema
let invoiceSchema = mongoose.Schema({
        //system
        Stage:{
            type: String,
            require: true
        },
        AccountPayer:{
            type: String,
            require: true
        },
        AccountPayee:{
            type: String,
            require: true
        },
        ConfirmBy:{
            type: String,
            require: true
        },
        ConfirmDate:{
            type: String,
            require: true
        },
        //วันใช้งานได้
        EffectiveDate:{
            type: String,
            require: true
        },
        //วันครบกำหนด
        MaturityDate:{
            type: String,
            require: true
        },
        Authorizer:{
            type: String,
            require: true
        },

        //manual
        VoucherNo:{
            type: String,
            require: true
        },
        NoofTransactions:{
            type: Number,
            require: true
        },
        TotalAmount:{
            type: Number,
            require: true
        },
        PaymentMethod:{
            type: String,
            require: true
        },
        PayerAccountNumber:{
            type: String,
            require: true
        },
        LoanTerm:{
            type: Number,
            require: true
        }
});

let Invoice = module.exports = mongoose.model('Invoice', invoiceSchema);
