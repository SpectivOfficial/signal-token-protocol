pragma solidity ^0.4.4;

import './SignalTokenMock.sol';


contract Spectiv {
  address public owner;

  mapping(address => bool) private admins;
  mapping(address => bool) private advertisers;

  SignalTokenMock private signal_token_mock;

  function Spectiv() public {
    owner = msg.sender;
    admins[owner] = true;

    signal_token_mock = new SignalTokenMock(this);
  }

  modifier isOwner() {
    if (msg.sender == owner) {
      _;
    }
  }

  modifier isAdmin() {
    if (admins[msg.sender]) {
      _;
    }
  }

  function transfer(address advertiser, address publisher, uint amount) public returns (bool) {
    return signal_token_mock.executeTransfer(advertiser, publisher, amount);
  }

  function addAdmin(address addr) public isOwner {
    admins[addr] = true;
  }

  function removeAdmin(address addr) public isOwner {
    if (addr == owner) {
      return;
    }

    admins[addr] = false;
  }

  function getAdmin(address addr) public view isAdmin returns (bool) {
    return admins[addr];
  }
}
