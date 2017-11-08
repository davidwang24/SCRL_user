var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var Web3 = require('web3');
var contract = require('truffle-contract');
var tokenContract = require('./../build/contracts/Token.json');
var mongoose = require('mongoose');

var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

var token;
// setup contract
var Token = contract(tokenContract);
Token.setProvider(web3.currentProvider);
// initialize contract
Token.deployed().then(function (instance) {
    token = instance;
    app.listen(port, function () {
        console.log('Example app listening on port ' + port)
    });
});

// set public folder
app.use(express.static('public'))

mongoose.connect('mongodb://localhost/UserDB', { useMongoClient: true });
mongoose.Promise = global.Promise;
var UserTB = require('./models/schema');

// load view engine
app.set('view engine', 'pug');

// home route
app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', function (req, res) {
    if(req.body.username=="admin"&&req.body.password=="admin"){
        res.redirect('/account');
    }else res.redirect('/')
    });

app.get('/account', function (req, res) {
    UserTB.find(function (err, article) {
        if(err){
            console.log(err);
        } else {
            var account = web3.eth.accounts;
            res.render('account', {
                articles: article,
                accounts: account
            });
        }
    });
});

app.get('/account/delete', function (req, res) {
    UserTB.find(function (err, article) {
        if(err){
            console.log(err);
        } else {
            var account = web3.eth.accounts;
            res.render('delete', {
                articles: article,
                accounts: account
            });
        }
    });
});

app.get('/info/:id', function(req, res){
    UserTB.findById(req.params.id, function(err, user){
        res.render('info',{
            user: user
        });
    });
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    var user = new UserTB();
    user.username = req.body.username;
    user.password = req.body.password;
    user.name = req.body.name;
    user.email = req.body.email;

    user.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/account');
        }
    })
});

app.post('/token/deposit', function(req, res) {
    var from = req.body.from;
    var txref = req.body.txref;
    var amount = req.body.amount;

    token.deposit(txref, amount, {
        from: from
    }).then(function (v){
        res.send(v);
    }).catch(function (err){
        res.send(err);
    });
});

app.post('/token/transfer', function (req, res) {
    var from = req.body.from
    var to = req.body.to;
    var amount = req.body.amount;
    //Token.web3.personal.unlockAccount(from, 'Password123');
    token.transfer(to, amount, {
        from: from
    }).then(function (v) {
        res.send(v);
    }).catch(function (err) {
        res.send(err);
    });
});

app.get('/account/:addr', function (req, res) {
    var addr = req.params.addr;
    var balance = {};
    var eth_balance = web3.eth.getBalance(addr);
    balance.eth = web3.fromWei(eth_balance, 'ether').toString(10);
    // get token balance
    token.balanceOf.call(addr).then(function (b) {
        balance.token = b.toNumber();
        res.send(balance);
    });
});

app.get('/block/:num', function(req, res){
    var num = req.params.num;
    var block = web3.eth.getBlock(num);
    return res.send(block);
});