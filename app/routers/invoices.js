const express = require('express');
const router = express.Router();

// invoice model
let Invoice = require('../models/invoice');
// user model
let User = require('../models/user');

router.get('/', function(req, res){
  let temp = req.user._id;
  Invoice.find({ "Account": temp }, function(err, invoice){
    if(err){
      console.log(err);
    } else {
      
      res.render('invoice', {
        name:req.user.name,
        invoice: invoice
      });
    }
  });
});

// add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_invoice', {
    title:'Add Invoice'
  });
});

// add submit POST route
router.post('/add', function(req, res){
  req.checkBody('CompanyCode','CompanyCode is required').notEmpty();
  req.checkBody('CompanyGroup','CompanyGroup is required').notEmpty();
  req.checkBody('TaxID','TaxID is required').notEmpty();
  req.checkBody('NameThai','NameThai is required').notEmpty();
  req.checkBody('NameEnglish','NameEnglish is required').notEmpty();
  req.checkBody('BusinessType','BusinessType is required').notEmpty();
  req.checkBody('Address','Address is required').notEmpty();
  req.checkBody('Building','Building is required').notEmpty();
  req.checkBody('Soi','Soi is required').notEmpty();
  req.checkBody('Street','Street is required').notEmpty();
  req.checkBody('Tumbol','Tumbol is required').notEmpty();
  req.checkBody('District','District is required').notEmpty();
  req.checkBody('Province','Province is required').notEmpty();
  req.checkBody('ZipCode','ZipCode is required').notEmpty();

  // get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_invoice', {
      title:'Add Invoice',
      errors:errors
    });
  } else {
    User.findByIdAndUpdate(req.user._id, {
      $set:{
        stage:1
      }
    }, function(err, user){
      if(err){
        console.log(err);
        return;
      }
    });

    let invoice = new Invoice();
    invoice.Account = req.user._id;
    invoice.CompanyCode = req.body.CompanyCode;
    invoice.CompanyGroup = req.body.CompanyGroup;
    invoice.TaxID = req.body.TaxID;
    invoice.NameThai = req.body.NameThai;
    invoice.NameEnglish = req.body.NameEnglish;
    invoice.BusinessType = req.body.BusinessType;
    invoice.Address = req.body.Address;
    invoice.Building = req.body.Building;
    invoice.Soi = req.body.Soi;
    invoice.Street = req.body.Street;
    invoice.Tumbol = req.body.Tumbol;
    invoice.District = req.body.District;
    invoice.Province = req.body.Province;
    invoice.ZipCode = req.body.ZipCode;

    invoice.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Invoice Added');
        res.redirect('/invoices');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Invoice.findById(req.params.id, function(err, invoice){
    if(invoice.Account != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_invoice', {
      title:'Edit Invoice',
      invoice:invoice
    });
  });
});

// update submit POST route
router.post('/edit/:id', function(req, res){
  let invoice = {};
  invoice.title = req.body.title;
  invoice.Account = req.body.Account;
  invoice.body = req.body.body;

  let query = {_id:req.params.id}

  Invoice.update(query, invoice, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Invoice Updated');
      res.redirect('/');
    }
  });
});

// delete invoice
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Invoice.findById(req.params.id, function(err, invoice){
    if(invoice.Account != req.user._id){
      res.status(500).send();
    } else {
      Invoice.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// get single invoice
router.get('/:id', function(req, res){
  Invoice.findById(req.params.id, function(err, invoice){
    User.findById(invoice.Account, function(err, user){
      res.render('invoice', {
        invoice:invoice,
        Account: user.name
      });
    });
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

module.exports = router;
