const express = require('express');
const router = express.Router();
const moment = require('moment');
const Web3 = require('web3');
const contract = require('truffle-contract');
const tokenContract = require('../../../SCF-Solution_official/build/contracts/Token.json');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// company model
let Company = require('../models/company');
// invoice model
let Invoice = require('../models/invoice');

var token;
// setup contract
var Token = contract(tokenContract);
Token.setProvider(web3.currentProvider);
// initialize contract
Token.deployed().then(function (instance) {
    token = instance;
});
var accounts = web3.eth.accounts;

router.get('/', function (req, res) {
    let temp = req.user._id;
    Company.find({ "Account": temp }, function(err, company){
      if(err){
        console.log(err);
      } else {
        var addr = company[0].ETHAccount;
        var balance = {};
        var eth_balance = web3.eth.getBalance(addr);
        balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
        // get token balance
        token.balanceOf.call(addr).then(function (b) {
            balance.token = b.toNumber();
            res.render('wallet', {
                accounts:addr,
                balance:balance
              });
        });
      }
    });
});

router.get('/transfer', function (req, res) {
    let temp = req.user._id;
    Company.find({ "Account": temp }, function(err, company){
      if(err){
        console.log(err);
      } else {
        var addr = company[0].ETHAccount;
        var balance = {};
        var eth_balance = web3.eth.getBalance(addr);
        balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
        // get token balance
        token.balanceOf.call(addr).then(function (b) {
            balance.token = b.toNumber();
            Company.find({}, function(err, company){
                if(err){
                  console.log(err);
                } else {
                    Invoice.find({}, function(err, invoice){
                        if(err){
                          console.log(err);
                        } else {
                            res.render('transfer', {
                                company:company,
                                balance:balance,
                                invoice:invoice
                            });
                        }
                    });
                }
            });
        });
      }
    });
});

router.post('/transfer', function (req, res) {
    var temp = req.body.VoucherNo;
    Invoice.find({ "VoucherNo":temp }, function(err, invoice){
        if(err){
          console.log(err);
        } else {
            var temp2 = invoice[0].AccountPayer;
            Company.find({ "Account": temp2 }, function(err, company){
                if(err){
                  console.log(err);
                } else {
                    var balance = {};
                    var eth_balance = web3.eth.getBalance(company[0].ETHAccount);
                    balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
                    // get token balance
                    token.balanceOf.call(company[0].ETHAccount).then(function (b) {
                        balance.token = b.toNumber();
                        if(invoice[0].TotalAmount<=balance.token){
                            var to = accounts[0];
                            var from = company[0].ETHAccount;
                            var amount = invoice[0].TotalAmount;
                            //Token.web3.personal.unlockAccount(from, 'Password123');
                            token.transfer(to, amount, {
                                from: from
                            }).then(function (v) {
                                var temp3 = invoice[0]._id;
                                Invoice.findByIdAndUpdate(temp3 , { $set:{ Stage:4 } }, function(err, invoice2){
                                    if(err){
                                      console.log(err);
                                    } else {
                                        req.flash('success', 'Voucher No: '+invoice2.VoucherNo+' Transfer is Complete');
                                        res.redirect('/wallets/transfer');
                                    }
                                });
                            }).catch(function (err) {
                                res.send(err);
                            });
                        } else {
                            req.flash('danger', 'Your token too low.');
                            res.redirect('/wallets/transfer');
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;