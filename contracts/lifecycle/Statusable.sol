pragma solidity ^0.4.11;

import "../ownership/Ownable.sol";

contract Statusable is Ownable {
    mapping(address => string) accountStatus;
    event ChangeStatus(address indexed who, string oldStatus, string newStatus, address indexed by);

    function setStatus(address who, string newStatus) onlyOwner {
        string oldStatus = accountStatus[who];
        accountStatus[who] = newStatus;
        ChangeStatus(who, oldStatus, newStatus, msg.sender);
    }
}