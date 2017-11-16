const express = require('express');
const router = express.Router();

// company model
let Company = require('../models/company');
// user model
let User = require('../models/user');

router.get('/', function(req, res){
  let temp = req.user._id;
  Company.find({ "Account": temp }, function(err, company){
    if(err){
      console.log(err);
    } else {
      res.render('company', {
        company: company
      });
    }
  });
});

// add route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_company', {
    title:'Add Company'
  });
});

// add submit POST route
router.post('/add', function(req, res){
  req.checkBody('CompanyCode','Company Code is required').notEmpty();
  req.checkBody('CompanyGroup','Company Group is required').notEmpty();
  req.checkBody('TaxID','Tax ID is required').notEmpty();
  req.checkBody('NameThai','Name Thai is required').notEmpty();
  req.checkBody('NameEnglish','Name English is required').notEmpty();
  req.checkBody('BusinessType','Business Type is required').notEmpty();
  req.checkBody('Address','Address is required').notEmpty();
  req.checkBody('Building','Building is required').notEmpty();
  req.checkBody('Soi','Soi is required').notEmpty();
  req.checkBody('Street','Street is required').notEmpty();
  req.checkBody('Tumbol','Tumbol is required').notEmpty();
  req.checkBody('District','District is required').notEmpty();
  req.checkBody('Province','Province is required').notEmpty();
  req.checkBody('ZipCode','Zip Code is required').notEmpty();
  req.checkBody('CompanyDocument','Company Document is required').notEmpty();

  // get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_company', {
      title:'Add Company',
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

    let company = new Company();
    company.Account = req.user._id;
    company.ETHAccount = '';
    company.CompanyCode = req.body.CompanyCode;
    company.CompanyGroup = req.body.CompanyGroup;
    company.TaxID = req.body.TaxID;
    company.NameThai = req.body.NameThai;
    company.NameEnglish = req.body.NameEnglish;
    company.BusinessType = req.body.BusinessType;
    company.Address = req.body.Address;
    company.Building = req.body.Building;
    company.Soi = req.body.Soi;
    company.Street = req.body.Street;
    company.Tumbol = req.body.Tumbol;
    company.District = req.body.District;
    company.Province = req.body.Province;
    company.ZipCode = req.body.ZipCode;
    company.CompanyDocument = req.body.CompanyDocument;

    company.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Company Added');
        res.redirect('/companys');
      }
    });
  }
});

// load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
    Company.findById(req.params.id, function(err, company){
    if(company.Account != req.user._id){
      req.flash('danger', 'Not Authorized');
      res.redirect('/');
    }
    res.render('edit_company', {
      title:'Edit Company',
      company:company
    });
  });
});

// update submit POST route
router.post('/edit/:id', function(req, res){
  let company = {};
  company.Account = req.user._id;
  company.CompanyCode = req.body.CompanyCode;
  company.CompanyGroup = req.body.CompanyGroup;
  company.TaxID = req.body.TaxID;
  company.NameThai = req.body.NameThai;
  company.NameEnglish = req.body.NameEnglish;
  company.BusinessType = req.body.BusinessType;
  company.Address = req.body.Address;
  company.Building = req.body.Building;
  company.Soi = req.body.Soi;
  company.Street = req.body.Street;
  company.Tumbol = req.body.Tumbol;
  company.District = req.body.District;
  company.Province = req.body.Province;
  company.ZipCode = req.body.ZipCode;
  company.CompanyDocument = req.body.CompanyDocument;

  let query = {_id:req.params.id}

  Company.update(query, company, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Company Updated');
      res.redirect('/companys');
    }
  });
});

// delete company
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Company.findById(req.params.id, function(err, company){
    if(company.Account != req.user._id){
      res.status(500).send();
    } else {
        Company.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
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
