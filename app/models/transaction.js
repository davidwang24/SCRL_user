let mongoose = require('mongoose');

// transaction schema
let transactionSchema = mongoose.Schema({
        TxHash:{
            type: String,
            require: true
        },
        TxReceiptStatus:{
            type: String,
            require: true
        },
        Timestamp:{
            type: String,
            require: true
        },
        From:{
            type: String,
            require: true
        },
        To:{
            type: String,
            require: true
        },
        Quantity:{
            type: String,
            require: true
        },
        Event:{
            type: String
        }
});

let Transaction = module.exports = mongoose.model('Transaction', transactionSchema);