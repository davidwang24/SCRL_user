pragma solidity ^0.4.11;
import '../zeppelin-solidity/math/SafeMath.sol';
import '../zeppelin-solidity/token/BasicToken.sol';
import '../ownership/Ownable.sol';
import '../lifecycle/Statusable.sol';

contract Token is BasicToken, Statusable {
    string public name;
    string public symbol;
    uint public decimals;

    mapping(address => bool) frozenAccount;

    event Deposit(address indexed from, uint256 value, string txref);
    event WithDraw(address indexed from, uint256 value, string txref);

    function Token(string _name, string _symbol, uint256 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals; 
    }

    function deposit(string _txref, uint _value) returns (uint256 amount) {
        totalSupply = totalSupply.add(_value);
        balances[msg.sender] = balances[msg.sender].add(_value);
        Deposit(msg.sender, _value, _txref);
        return balanceOf(msg.sender);
    }

    function withdraw(string _txref, uint _value) returns (uint256 amount) {
        // SafeMath.sub will throw if there is not enough balance.
        balances[msg.sender] = balances[msg.sender].sub(_value);
        totalSupply = totalSupply.sub(_value);
        WithDraw(msg.sender, _value, _txref);
        return balanceOf(msg.sender);
    }

}