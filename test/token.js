var Token = artifacts.require("./Token.sol");

contract('Token', function (accounts) {
    // basic functionality
    it("should has correct property", function () {
        var token;
        var name;
        var symbol;
        var decimals;

        return Token.deployed().then(function (instance) {
            token = instance;
            return instance.name.call();
        }).then(function (_name) {
            name = _name;
            return token.symbol.call();
        }).then(function (_symbol) {
            symbol = _symbol;
            return token.decimals.call();
        }).then(function (_decimals) {
            decimals = _decimals;
            assert.equal(name, "Thailand Baht", "Token Name is incorrect");
            assert.equal(symbol, "THB", "Token Symbol is incorrect");
            assert.equal(decimals, 2, "Token Decimals is incorrect");
        });
    });
    it("should deposit correctly", function() {
        var token;
        var account = accounts[0];
        var balance1;
        var balance2;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.balanceOf.call(account);
        }).then(function(balanceA){
            balance1 = balanceA.toNumber();
            return token.deposit("TEST1000",1000, {from:account});
        }).then(function() {
            return token.balanceOf.call(account);
        }).then(function(balanceB){
            balance2 = balanceB.toNumber();
            assert.equal(balance1, 0, "initialize balance is not zero");
            assert.equal(balance2, 1000, "deposit not correctly");
        })
    });
    it("should withdraw correctly", function() {
        var token;
        var account = accounts[0];
        var balance1;
        var balance2;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.balanceOf.call(account);
        }).then(function(balanceA){
            balance1 = balanceA.toNumber();
            return token.withdraw("TEST1000",1000, {from:account});
        }).then(function() {
            return token.balanceOf.call(account);
        }).then(function(balanceB){
            balance2 = balanceB.toNumber();
            assert.equal(balance1, 1000, "initialize balance is not 1000");
            assert.equal(balance2, 0, "withdraw not correctly");
        })
    });
    it("should transfer token correctly", function(){
        var token;
        var account1 = accounts[0];
        var account2 = accounts[1];
        var balance_before_account1;
        var balance_after_account1;
        var balance_before_account2;
        var balance_after_account2;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.deposit("TEST1000", 1000, {from: account1});
        }).then(function(){
            return token.balanceOf.call(account1);
        }).then(function(balanceA1){
            balance_before_account1 = balanceA1.toNumber();
            return token.balanceOf.call(account2);
        }).then(function(balanceB1) {
            balance_before_account2 = balanceB1.toNumber();
            return token.transfer(account2, 500, {from: account1});
        }).then(function(){
            return token.balanceOf.call(account1);
        }).then(function(balanceA2){
            balance_after_account1 = balanceA2.toNumber();
            return token.balanceOf.call(account2);
        }).then(function(balanceB2){
            balance_after_account2 = balanceB2.toNumber();
            assert.equal(balance_before_account1, 1000, "initial balance is not correct");
            assert.equal(balance_before_account2, 0, "initial balance is not zero");
            assert.equal(balance_after_account1, 500, "ending balance should be 500");
            assert.equal(balance_after_account2, 500, "ending balance should be 500");
        });
    });

    // ownership function
    it("should has correct owner", function(){
        return Token.deployed().then(function (instance) {
            var account = accounts[0];
            return instance.isOwner.call(account);
        }).then(function(result) {
            assert.equal(result, true, "owner is not correct");
        });
    });
    it("should add owner correctly", function() {
        var token;
        var account1 = accounts[0];
        var account2 = accounts[1];
        var owner_before_account2;
        var owner_after_account2;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.isOwner.call(account2);
        }).then(function(result1) {
            owner_before_account2 = result1;
            return token.addOwnership(account2, {from: account1});
        }).then(function() {
            return token.isOwner.call(account2);
        }).then(function(result2){
            owner_after_account2 = result2;
            assert.equal(owner_before_account2, false, "owner is not correct");
            assert.equal(owner_after_account2, true, "cannot add new owner");
        });
    });
    it("should remove owner correctly", function() {
        var token;
        var account1 = accounts[0];
        var account2 = accounts[1];
        var owner_before_account1;
        var owner_after_account1;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.isOwner.call(account1);
        }).then(function(result1) {
            owner_before_account1 = result1;
            return token.removeOwnership(account1, {from: account2});
        }).then(function() {
            return token.isOwner.call(account1);
        }).then(function(result2){
            owner_after_account1 = result2;
            assert.equal(owner_before_account1, true, "owner is not correctly set");
            assert.equal(owner_after_account1, false, "owner should be revoked");
        });
    });
    it("should transfer owner correctly", function() {
        var token;
        var account1 = accounts[0];
        var account2 = accounts[1];
        var owner_before_account1;
        var owner_after_account1;
        var owner_before_account2;
        var owner_after_account2;

        return Token.deployed().then(function (instance) {
            token = instance;
            return token.isOwner.call(account1);
        }).then(function(resultA1) {
            owner_before_account1 = resultA1;
            return token.isOwner.call(account2);
        }).then(function(resultB1) {
            owner_before_account2 = resultB1;
            return token.transferOwnership(account1, {from: account2});
        }).then(function(){
            return token.isOwner.call(account1);
        }).then(function(resultA2){
            owner_after_account1 = resultA2;
            return token.isOwner.call(account2);
        }).then(function(resultB2){
            owner_after_account2 = resultB2;
            assert.equal(owner_before_account1, false, "owner is not correctly set");
            assert.equal(owner_before_account2, true, "owner is not correctly set");
            assert.equal(owner_after_account1, true, "owner is not transfer correctly");
            assert.equal(owner_after_account2, false, "owner is not transfer correctly");
        });
    });
});