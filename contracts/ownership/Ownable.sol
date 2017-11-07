pragma solidity ^0.4.11;


/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  mapping(address => bool) owners;
  address root;

  event ChangeOwner(address indexed from, address indexed to, address indexed by); 

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() {
    owners[msg.sender] = true;
    root = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(owners[msg.sender]);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) onlyOwner {
    _addOwnership(newOwner);
    _removeOwnership(msg.sender);
    ChangeOwner(msg.sender, newOwner, msg.sender);
  }

  function addOwnership(address newOwner) onlyOwner {
    _addOwnership(newOwner);
    ChangeOwner(address(0), newOwner, msg.sender);
  }

  function removeOwnership(address oldOwner) onlyOwner {
    _removeOwnership(oldOwner);
    ChangeOwner(oldOwner, address(0), msg.sender);
  }

  function _addOwnership(address newOwner) internal {
    require(newOwner != address(0));
    owners[newOwner] = true;
  }

  function _removeOwnership(address oldOwner) internal {
    require(oldOwner != address(0));
    owners[oldOwner] = false;
  }

  function isOwner(address _address) constant returns (bool) {
    return owners[_address];
  }

}