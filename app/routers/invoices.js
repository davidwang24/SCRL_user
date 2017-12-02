const express = require('express');
const router = express.Router();

// invoice model
let Invoice = require('../models/invoice');
// company model
let Company = require('../models/company');
// user model
let User = require('../models/user');

router.get('/', function(req, res) {
 let temp = req.user._id;
 Invoice.find({
  "AccountPayer": temp
 }, function(err, invoice) {
  if (err) {
   console.log(err);
  } else {
   Company.find({}, function(err, company) {
    if (err) {
     console.log(err);
    } else {
     res.render('invoice', {
      invoice: invoice,
      company: company
     });
    }
   });
  }
 });
});

// add route
router.get('/add', function(req, res) {
 Company.find({}, function(err, company) {
  if (err) {
   console.log(err);
  } else {
   res.render('add_invoice', {
    company: company,
    id: req.user._id
   });
  }
 });
});

// add submit POST route
router.post('/add', function(req, res) {
 req.checkBody('VoucherNo', 'Voucher No is required').notEmpty();
 req.checkBody('NoofTransactions', 'No of Transactions is required').notEmpty();
 req.checkBody('TotalAmount', 'Total Amount is required').notEmpty();
 req.checkBody('InvoiceDocument', 'Invoice Document is required').notEmpty();

 // get errors
 let errors = req.validationErrors();

 if (errors) {
  Company.find({}, function(err, company) {
   if (err) {
    console.log(err);
   } else {
    res.render('add_invoice', {
     title: 'Add Invoice',
     company: company,
     id: req.user._id,
     errors: errors
    });
   }
  });
 } else {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
   dd = '0' + dd;
  }
  if (mm < 10) {
   mm = '0' + mm;
  }
  var today = dd + '/' + mm + '/' + yyyy;
  let invoice = new Invoice();
  invoice.Stage = 0;
  invoice.AccountPayer = req.user._id;
  invoice.ConfirmBy = req.user.name;
  invoice.ConfirmDate = today;
  invoice.VoucherNo = req.body.VoucherNo;
  invoice.NoofTransactions = req.body.NoofTransactions;
  invoice.TotalAmount = req.body.TotalAmount;
  invoice.OutstandingBalance = req.body.TotalAmount;
  invoice.PaymentMethod = req.body.Radio;
  invoice.LoanTerm = req.body.LoanTerm;
  invoice.InvoiceDocument = req.body.InvoiceDocument;
  let temp = req.body.PayeeCompany;
  Company.find({
   "CompanyCode": temp
  }, function(err, company) {
   if (err) {
    console.log(err);
   }
   invoice.AccountPayee = company[0].Account;
   invoice.save(function(err) {
    if (err) {
     console.log(err);
     return;
    } else {
     req.flash('success', 'Invoice Added');
     res.redirect('/invoices');
    }
   });
  });
 }
});

// reject invoice
router.delete('/:id', function(req, res) {
 let query = {
  _id: req.params.id
 }
 Invoice.findByIdAndUpdate(query, {
  $set: {
   Stage: -1,
  }
 }, function(err, invoice) {
  if (err) {
   console.log(err);
   return;
  }
  res.send('Success');
 });
});

// access control
function ensureAuthenticated(req, res, next) {
 if (req.isAuthenticated()) {
  return next();
 } else {
  req.flash('danger', 'Please login');
  res.redirect('/users/login');
 }
}

router.get('/confirm', function(req, res) {
 let temp = req.user._id;
 Invoice.find({
  "AccountPayee": temp
 }, function(err, invoice) {
  if (err) {
   console.log(err);
  } else {
   res.render('confirm', {
    invoice: invoice
   });
  }
 });
});

// confirm invoice
router.get('/confirm/:id', function(req, res) {
 let query = {
  _id: req.params.id
 }
 Invoice.findByIdAndUpdate(query, {
  $set: {
   Stage: 1,
   Authorizer: req.user.name
  }
 }, function(err, invoice) {
  if (err) {
   console.log(err);
   return;
  }
  res.send('Success');
 });
});

// status invoice
router.get('/status', function(req, res) {
 Invoice.find({}, function(err, invoice) {
  if (err) {
   console.log(err);
  } else {
   res.render('status', {
    invoice: invoice,
    id: req.user._id
   });
  }
 });
});

// invoice detalis
router.get('/status/:id', function(req, res) {
 let temp = req.params.id;
 Invoice.find({
  "_id": temp
 }, function(err, invoice) {
  if (err) {
   console.log(err);
  } else {
   User.find({}, function(err, users) {
    if (err) {
     console.log(err);
    } else {
     Company.find({}, function(err, company) {
      if (err) {
       console.log(err);
      } else {
       res.render('detail_invoice', {
        invoice: invoice,
        users: users,
        company: company
       });
      }
     });
    }
   });
  }
 });
});

module.exports = router;