let mongoose = require('mongoose');

// invoice schema
let invoiceSchema = mongoose.Schema({
        AccountPayer:{
            type: String,
            require: true
        },
        AccountPayee:{
            type: String,
            require: true
        },
        VoucherNo
        Tracking No
        No of Transactions
        Total Amount
        Confirm By
        Confirm Date
        Effective Date
        Payment Method
        Payer Account Number
        Loan Term
        Maturity Date
        Authorization Sequence
        Number of Authorizer
});

let Invoice = module.exports = mongoose.model('Invoice', invoiceSchema);
