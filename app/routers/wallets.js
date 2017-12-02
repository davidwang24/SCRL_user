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
// invoice model
let Transaction = require('../models/transaction');

var token;
// setup contract
var Token = contract(tokenContract);
Token.setProvider(web3.currentProvider);
// initialize contract
Token.deployed().then(function(instance) {
 token = instance;
});
var accounts = web3.eth.accounts;

router.get('/', function(req, res) {
 let temp = req.user._id;
 Company.find({
  "Account": temp
 }, function(err, company) {
  if (err) {
   console.log(err);
  } else {
   var addr = company[0].ETHAccount;
   var balance = {};
   var eth_balance = web3.eth.getBalance(addr);
   balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
   // get token balance
   token.balanceOf.call(addr).then(function(b) {
    balance.token = b.toNumber();
    res.render('wallet', {
     accounts: addr,
     balance: balance
    });
   });
  }
 });
});

router.get('/transfer', function(req, res) {
 let temp = req.user._id;
 Company.find({
  "Account": temp
 }, function(err, company) {
  if (err) {
   console.log(err);
  } else {
   var addr = company[0].ETHAccount;
   var balance = {};
   var eth_balance = web3.eth.getBalance(addr);
   balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
   // get token balance
   token.balanceOf.call(addr).then(function(b) {
    balance.token = b.toNumber();
    Company.find({}, function(err, company) {
     if (err) {
      console.log(err);
     } else {
      Invoice.find({}, function(err, invoice) {
       if (err) {
        console.log(err);
       } else {
        res.render('transfer', {
         company: company,
         balance: balance,
         invoice: invoice
        });
       }
      });
     }
    });
   });
  }
 });
});

router.post('/transfer', function(req, res) {
 var temp = req.body.VoucherNo;
 Invoice.find({
  "VoucherNo": temp
 }, function(err, invoice) {
  if (err) {
   console.log(err);
  } else {
   var temp2 = invoice[0].AccountPayer;
   Company.find({
    "Account": temp2
   }, function(err, company) {
    if (err) {
     console.log(err);
    } else {
     if (invoice[0].PaymentMethod == 'Cash') {
      var balance = {};
      var eth_balance = web3.eth.getBalance(company[0].ETHAccount);
      balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
      // get token balance
      token.balanceOf.call(company[0].ETHAccount).then(function(b) {
       balance.token = b.toNumber();
       if (invoice[0].TotalAmount <= balance.token) {
        var to = accounts[0];
        var from = company[0].ETHAccount;
        var amount = invoice[0].TotalAmount;
        //Token.web3.personal.unlockAccount(from, 'Password123');
        token.transfer(to, amount, {
         from: from
        }).then(function(v) {
         var temp3 = invoice[0]._id;
         Invoice.findByIdAndUpdate(temp3, {
          $set: {
           Stage: 4,
           OutstandingBalance: 0
          }
         }, function(err, invoice2) {
          if (err) {
           console.log(err);
          } else {
            var date = (web3.eth.getBlock((web3.eth.getTransaction(v.logs[0].transactionHash)).blockNumber).timestamp)
            var date2 = new Date(date*1000);
            var dd = date2.getDate();
            var mm = date2.getMonth() + 1; //January is 0!
            var yyyy = date2.getFullYear();
            var h = date2.getHours();
            var m = date2.getMinutes();
            var s = date2.getSeconds();
            if (dd < 10) {
            dd = '0' + dd;
            }
            if (mm < 10) {
            mm = '0' + mm;
            }
            if (h < 10) {
              h = '0' + h;
            }
            if (m < 10) {
              m = '0' + m;
            }
            if (s < 10) {
              s = '0' + s;
            }
            var Timestamp = dd + '/' + mm + '/' + yyyy + ' '+ h + ':' + m + ':' + s;
            let transaction = new Transaction();
            transaction.TxHash = v.logs[0].transactionHash;
            transaction.TxReceiptStatus = v.receipt.status;
            transaction.Timestamp = Timestamp;
            transaction.From = v.logs[0].args.from;
            transaction.To = v.logs[0].args.to;
            transaction.Quantity = v.logs[0].args.value.toNumber();
            transaction.Event = v.logs[0].event;
            transaction.save(function(err) {
              if (err) {
               console.log(err);
               return;
              } else {
                req.flash('success', 'Voucher No: ' + invoice2.VoucherNo + ' Transfer is Complete');
                res.redirect('/wallets/transfer');
              }
             });
          }
         });
        }).catch(function(err) {
         res.send(err);
        });
       } else {
        req.flash('danger', 'Your token too low.');
        res.redirect('/wallets/transfer');
       }
      });
     } else {
      var balance = {};
      var eth_balance = web3.eth.getBalance(company[0].ETHAccount);
      balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
      // get token balance
      token.balanceOf.call(company[0].ETHAccount).then(function(b) {
       balance.token = b.toNumber();
       if (req.body.Amount <= balance.token) {
        var to = accounts[0];
        var from = company[0].ETHAccount;
        var amount = req.body.Amount;
        //Token.web3.personal.unlockAccount(from, 'Password123');
        token.transfer(to, amount, {
         from: from
        }).then(function(v) {
         var int = invoice[0].OutstandingBalance - amount;
         if (int == 0) {
          var temp3 = invoice[0]._id;
          Invoice.findByIdAndUpdate(temp3, {
           $set: {
            Stage: 4,
            OutstandingBalance: 0
           }
          }, function(err, invoice2) {
           if (err) {
            console.log(err);
           } else {
            var date = (web3.eth.getBlock((web3.eth.getTransaction(v.logs[0].transactionHash)).blockNumber).timestamp)
            var date2 = new Date(date*1000);
            var dd = date2.getDate();
            var mm = date2.getMonth() + 1; //January is 0!
            var yyyy = date2.getFullYear();
            var h = date2.getHours();
            var m = date2.getMinutes();
            var s = date2.getSeconds();
            if (dd < 10) {
            dd = '0' + dd;
            }
            if (mm < 10) {
            mm = '0' + mm;
            }
            if (h < 10) {
              h = '0' + h;
            }
            if (m < 10) {
              m = '0' + m;
            }
            if (s < 10) {
              s = '0' + s;
            }
            var Timestamp = dd + '/' + mm + '/' + yyyy + ' '+ h + ':' + m + ':' + s;
            let transaction = new Transaction();
            transaction.TxHash = v.logs[0].transactionHash;
            transaction.TxReceiptStatus = v.receipt.status;
            transaction.Timestamp = Timestamp;
            transaction.From = v.logs[0].args.from;
            transaction.To = v.logs[0].args.to;
            transaction.Quantity = v.logs[0].args.value.toNumber();
            transaction.Event = v.logs[0].event;
            transaction.save(function(err) {
              if (err) {
               console.log(err);
               return;
              } else {
                req.flash('success', 'Voucher No: ' + invoice2.VoucherNo + ' Transfer is Complete');
                res.redirect('/wallets/transfer');
              }
             });
           }
          });
         } else {
          var temp3 = invoice[0]._id;
          Invoice.findByIdAndUpdate(temp3, {
           $set: {
            OutstandingBalance: int
           }
          }, function(err, invoice2) {
           if (err) {
            console.log(err);
           } else {
            var date = (web3.eth.getBlock((web3.eth.getTransaction(v.logs[0].transactionHash)).blockNumber).timestamp)
            var date2 = new Date(date*1000);
            var dd = date2.getDate();
            var mm = date2.getMonth() + 1; //January is 0!
            var yyyy = date2.getFullYear();
            var h = date2.getHours();
            var m = date2.getMinutes();
            var s = date2.getSeconds();
            if (dd < 10) {
            dd = '0' + dd;
            }
            if (mm < 10) {
            mm = '0' + mm;
            }
            if (h < 10) {
              h = '0' + h;
            }
            if (m < 10) {
              m = '0' + m;
            }
            if (s < 10) {
              s = '0' + s;
            }
            var Timestamp = dd + '/' + mm + '/' + yyyy + ' '+ h + ':' + m + ':' + s;
            let transaction = new Transaction();
            transaction.TxHash = v.logs[0].transactionHash;
            transaction.TxReceiptStatus = v.receipt.status;
            transaction.Timestamp = Timestamp;
            transaction.From = v.logs[0].args.from;
            transaction.To = v.logs[0].args.to;
            transaction.Quantity = v.logs[0].args.value.toNumber();
            transaction.Event = v.logs[0].event;
            transaction.save(function(err) {
              if (err) {
               console.log(err);
               return;
              } else {
                req.flash('success', 'Voucher No: ' + invoice2.VoucherNo + ' Transfer is Complete');
                res.redirect('/wallets/transfer');
              }
             });
           }
          });
         }
        }).catch(function(err) {
         res.send(err);
        });
       } else {
        req.flash('danger', 'Your token too low.');
        res.redirect('/wallets/transfer');
       }
      });
     }
    }
   });
  }
 });
});

module.exports = router;