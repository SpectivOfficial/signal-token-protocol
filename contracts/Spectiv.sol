pragma solidity ^0.4.4;


contract Spectiv {
  address owner;

  mapping(address => bool) admins;
  mapping(address => bool) advertisers;

  function Spectiv() {
    owner = msg.sender;
    admins[msg.sender] = true;
  }

  modifier isOwner() {
    if (msg.sender != owner) {
      return;
    }

    _;
  }

  modifier isAdmin() {
    if (!admins[msg.sender]) {
      return;
    }

    _;
  }

  function addAdmin(address addr) public isOwner returns (bool) {
    admins[addr] = true;
    return true;
  }

  function removeAdmin(address addr) public isOwner returns (bool) {
    if (owner == addr) {
      return false;
    }

    admins[addr] = false;
    return true;
  }

  function addAdvertiser(address addr) public isAdmin returns (bool) {
    advertisers[addr] = true;
    return true;
  }

  function removeAdvertiser(address addr) public isAdmin returns (bool) {
    advertisers[addr] = false;
    return true;
  }
}
