pragma solidity ^0.4.4;


contract Spectiv {
  address public owner;

  mapping(address => bool) private admins;
  mapping(address => bool) private advertisers;

  function Spectiv() public {
    owner = msg.sender;
    admins[msg.sender] = true;
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

  function getAdmin(address addr) public view isAdmin returns (bool) {
    return admins[addr];
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

  // function getAdvertiser(address addr) public view isAdmin returns (bool) {
  //   return advertisers[addr];
  // }

  // function addAdvertiser(address addr) public isAdmin {
  //   advertisers[addr] = true;
  // }

  // function removeAdvertiser(address addr) public isAdmin {
  //   advertisers[addr] = false;
  // }
}
