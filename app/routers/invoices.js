const express = require('express');
const router = express.Router();

// invoice model
let Invoice = require('../models/invoice');
// company model
let Company = require('../models/company');
// user model
let User = require('../models/user');

router.get('/', function(req, res){
  let temp = req.user._id;
  Invoice.find({ "AccountPayer": temp }, function(err, invoice){
    if(err){
      console.log(err);
    } else {
      res.render('invoice', {
        invoice: invoice
      });
    }
  });
});

// add route
router.get('/add', ensureAuthenticated, function(req, res){
  Company.find({}, function(err, company){
    if(err){
      console.log(err);
    } else {
      res.render('add_invoice', {
        title:'Add Invoice',
        company:company
      });
    }
  });
});

// add submit POST route
router.post('/add', function(req, res){
  req.checkBody('VoucherNo','Voucher No is required').notEmpty();
  req.checkBody('NoofTransactions','No of Transactions is required').notEmpty();
  req.checkBody('TotalAmount','Total Amount is required').notEmpty();
  
  // get errors
  let errors = req.validationErrors();

  if(errors){
    Company.find({}, function(err, company){
      if(err){
        console.log(err);
      } else {
        res.render('add_invoice', {
          title:'Add Invoice',
          company:company,
          errors:errors
        });
      }
    });
  } else {
    User.findByIdAndUpdate(req.user._id, {
      $set:{
        stage:3
      }
    }, function(err, user){
      if(err){
        console.log(err);
        return;
      }
    });
    var today = new Date();
    //today.setDate(today.getDate() + 7);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    }
    var today = dd+'/'+mm+'/'+yyyy;
    let invoice = new Invoice();
    invoice.Stage = 0;
    invoice.AccountPayer = req.user._id;
    invoice.ConfirmBy = req.user.name;
    invoice.ConfirmDate = today;
    //invoice.EffectiveDate = req.body.EffectiveDate;
    //invoice.MaturityDate = req.body.MaturityDate;
    //invoice.Authorizer = 'NULL';
    invoice.VoucherNo = req.body.VoucherNo;
    invoice.NoofTransactions = req.body.NoofTransactions;
    invoice.TotalAmount = req.body.TotalAmount;
    invoice.PaymentMethod = req.body.Radio;
    invoice.PayerAccountNumber = req.body.PayerAccountNumber;
    invoice.LoanTerm = req.body.LoanTerm;
    let temp = req.body.PayeeCompany;
    Company.find({ "CompanyCode": temp }, function(err, company){
      if(err){
        console.log(err);
      }
      invoice.AccountPayee = company[0].Account;
      invoice.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success','Invoice Added');
          res.redirect('/invoices');
        }
      });
    });
  }
});

// delete invoice
router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}
      Invoice.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
});

// access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

router.get('/approve', function(req, res){
  let temp = req.user._id;
  Invoice.find({ "AccountPayee": temp }, function(err, invoice){
    if(err){
      console.log(err);
    } else {
      res.render('approve', {
        invoice: invoice
      });
    }
  });
});

// approve invoice
router.get('/approve/:id', function(req, res){
  let query = {_id:req.params.id}
  Invoice.findByIdAndUpdate(query, {
    $set:{
      Stage:1,
      Authorizer:req.user.name
    }
      }, function(err, invoice){
        if(err){
          console.log(err);
          return;
        }
        res.send('Success');
      });
});

// status invoice
router.get('/status', function(req, res){
  Invoice.find({}, function(err, invoice){
    if(err){
      console.log(err);
    } else {
      res.render('status', {
        invoice: invoice,
        id:req.user._id
      });
    }
  });
});

module.exports = router;
