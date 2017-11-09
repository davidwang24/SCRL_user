var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// bring in models
var UserTB = require('../models/user_model');

router.get('/', function (req, res) {
    UserTB.find(function (err, article) {
        if(err){
            console.log(err);
        } else {
            var account = web3.eth.accounts;
            res.render('account', {article: article, account: account});
        }
    });
});

// get user account
router.get('/:id', function(req, res){
    UserTB.findById(req.params.id, function(err, user){
        res.render('info',{user: user});
    });
});

// load edit
router.get('/edit/:id', function(req, res){
    UserTB.findById(req.params.id, function(err, user){
        res.render('edit_info',{user: user});
    });
});

// update account
router.post('/edit/:id', function (req, res) {
    var user={};
    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.name;
    user.email = req.body.email;

    var query = {_id:req.params.id}
    UserTB.update(query,user,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/account/'+req.params.id);
        }
    });
});

// delete account
router.delete('/:id',function(req, res){
    var query = {_id:req.params.id}
    UserTB.remove(query,function(err){
        if(err){
            console.log(err);
        }else{
            res.send('Success');
        }
    });
});

module.exports = router;